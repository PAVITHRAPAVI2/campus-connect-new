using campus_connect.Server.Model;
using campus_connect.Server.Model.DTO;
using campus_connect.Server.Model.Services;
using CampusConnectAPI.Data;
using CampusConnectAPI.Models;
using CampusConnectAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;


namespace CampusConnectAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwt;
        private readonly IEmailService _emailService;
        public AuthController(AppDbContext context, JwtService jwt, IEmailService emailService)
        {
            _context = context;
            _jwt = jwt;
            _emailService = emailService;
        }



        //  Student Registration Only
        [HttpPost("register-student")]
        public async Task<IActionResult> RegisterStudent([FromBody] RegisterStudentDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.CollegeId) || string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("College ID and Email are required");

            if (await _context.Students.AnyAsync(s => s.Email == dto.Email || s.CollegeId == dto.CollegeId))
                return BadRequest("Student already exists with given Email or College ID");

            var student = new Student
            {
                CollegeId = dto.CollegeId,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                FullName = dto.FullName,
                Department = dto.Department,
                Batch = dto.Batch,
                Role = "student",
                IsApproved = false, //  Student must be approved before login
                CreatedBy = dto.CollegeId,
                UpdatedBy = dto.CollegeId
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            // (Optional) Send email to department faculty for approval
            return Ok("Student registered successfully. Awaiting faculty approval.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.CollegeId) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest("College ID and Password are required");

            object? user = null;
            string role = "", storedHash = "", email = "", userId = "", userName = "", department = "";
            bool isApproved = true; // Default true for admin

            var collegeId = dto.CollegeId.Trim();

            // 1. Try Student
            var student = await _context.Students.FirstOrDefaultAsync(s => s.CollegeId == collegeId && !s.IsDeleted);
            if (student != null)
            {
                user = student;
                storedHash = student.PasswordHash;
                role = student.Role;
                email = student.Email;
                userId = student.CollegeId;
                userName = student.FullName;
                department = student.Department;
                isApproved = student.IsApproved;
            }

            // 2. Try Faculty
            if (user == null)
            {
                var faculty = await _context.Faculties.FirstOrDefaultAsync(f => f.CollegeId == collegeId && !f.IsDeleted);
                if (faculty != null)
                {
                    user = faculty;
                    storedHash = faculty.PasswordHash;
                    role = faculty.Role;
                    email = faculty.Email;
                    userId = faculty.CollegeId;
                    userName = faculty.FullName;
                    department = faculty.Department;
                    isApproved = faculty.IsApproved;
                }
            }

            // 3. Try Admin
            if (user == null)
            {
                var admin = await _context.Admins.FirstOrDefaultAsync(a => a.CollegeId == collegeId && !a.IsDeleted);
                if (admin != null)
                {
                    user = admin;
                    storedHash = admin.PasswordHash;
                    role = admin.Role;
                    email = admin.Email;
                    userId = admin.CollegeId;
                    userName = admin.FullName;
                    department = admin.Department ?? "Administration";
                    isApproved = true; // Admins don't need approval
                }
            }

            if (user == null)
                return Unauthorized("User not found");

            if (string.IsNullOrEmpty(storedHash) || !BCrypt.Net.BCrypt.Verify(dto.Password, storedHash))
                return Unauthorized("Incorrect password");

            //  Approval check for students/faculties
            if ((role == "student" || role == "faculty") && !isApproved)
                return Unauthorized("Your account is pending approval.");

            //  Generate token
            var token = _jwt.GenerateToken(userId, userName, email, role, department);

            var response = new LoginResponseDto
            {
                Token = token,
                Role = role,
                UserId = userId,
                Email = email,
                UserName = userName,
                Department = department,
                Expiration = DateTime.UtcNow.AddHours(1)
            };

            return Ok(response);
        }





        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("Email is required.");

            string email = dto.Email.Trim().ToLower();

            // Lookup user from any of the 3 roles
            object? user = await _context.Students.FirstOrDefaultAsync(u => u.Email.ToLower() == email && !u.IsDeleted);

            if (user == null)
                user = await _context.Faculties.FirstOrDefaultAsync(f => f.Email.ToLower() == email && !f.IsDeleted);

            if (user == null)
                user = await _context.Admins.FirstOrDefaultAsync(a => a.Email.ToLower() == email && !a.IsDeleted);

            if (user == null)
                return NotFound("Email not found.");

            
            var recentToken = await _context.PasswordResetTokens
                .Where(t => t.Email.ToLower() == email && !t.IsUsed)
                .OrderByDescending(t => t.CreatedAt)
                .FirstOrDefaultAsync();

            if (recentToken != null && recentToken.CreatedAt > DateTime.UtcNow.AddMinutes(-2))
                return BadRequest("Please wait before requesting another OTP.");

            
            var rng = new Random();
            string otp = rng.Next(100000, 999999).ToString();

            var token = new PasswordResetToken
            {
                Email = email,
                Otp = otp,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddMinutes(10),
                IsUsed = false
            };

            _context.PasswordResetTokens.Add(token);
            await _context.SaveChangesAsync();

            await _emailService.SendEmailAsync(
                email,
                "Your OTP for Campus Connect Password Reset",
                $"<p>Your OTP is: <strong>{otp}</strong></p><p>This OTP is valid for 10 minutes.</p>"
            );

            return Ok("OTP has been sent to your email.");
        }






        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto dto)
        {
            var token = await _context.PasswordResetTokens
                .FirstOrDefaultAsync(t => t.Email == dto.Email && t.Otp == dto.Otp && !t.IsUsed && t.ExpiresAt > DateTime.UtcNow);

            if (token == null)
                return BadRequest("Invalid or expired OTP.");

            token.IsUsed = true;
            await _context.SaveChangesAsync();

            return Ok("OTP verified. You can now reset your password.");
        }
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            if (dto.NewPassword != dto.ConfirmPassword)
                return BadRequest("Passwords do not match.");

            var user = await _context.Students.FirstOrDefaultAsync(u => u.Email == dto.Email && !u.IsDeleted);
            if (user == null)
                return NotFound("User not found.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok("Password reset successfully.");
        }






        [HttpGet("profile")]
        //[Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var collegeId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(collegeId) || string.IsNullOrEmpty(role))
                return Unauthorized("Invalid token");

            object? userProfile = null;

            if (role == "student")
            {
                userProfile = await _context.Students
                    .Where(s => s.CollegeId == collegeId && !s.IsDeleted)
                    .Select(s => new
                    {
                        s.Id,
                        s.CollegeId,
                        s.FullName,
                        s.Email,
                        s.Department,
                        s.Batch,
                        s.Role,
                        s.Avatar,
                        s.IsApproved,
                        s.CreatedAt
                    }).FirstOrDefaultAsync();
            }
            else if (role == "faculty")
            {
                userProfile = await _context.Faculties
                    .Where(f => f.CollegeId == collegeId && !f.IsDeleted)
                    .Select(f => new
                    {
                        f.Id,
                        f.CollegeId,
                        f.FullName,
                        f.Email,
                        f.Department,
                        f.Role,
                        f.IsApproved,
                        f.CreatedAt
                    }).FirstOrDefaultAsync();
            }
            else if (role == "admin")
            {
                userProfile = await _context.Admins
                    .Where(a => a.CollegeId == collegeId && !a.IsDeleted)
                    .Select(a => new
                    {
                        a.Id,
                        a.CollegeId,
                        a.FullName,
                        a.Email,
                        a.Department,
                        a.Role,
                        a.CreatedAt
                    }).FirstOrDefaultAsync();
            }

            if (userProfile == null)
                return NotFound("User not found");

            return Ok(userProfile);
        }


    }
}