using campus_connect.Server.Model;
using campus_connect.Server.Model.DTO;
using campus_connect.Server.Model.Services;
using CampusConnectAPI.Data;
using CampusConnectAPI.Models;
using CampusConnectAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


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
                IsApproved = true,
                CreatedBy = dto.CollegeId,
                UpdatedBy = dto.CollegeId
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return Ok("Student registered successfully.");
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.CollegeId) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest("College ID and Password are required");

            object? user = null;
            string role = "", storedHash = "", email = "", userId = "", userName = "", department = "";

            var collegeId = dto.CollegeId.Trim();

            //  Try Student
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
            }

            //  Try Faculty
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
                }
            }

            //  Try Admin
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
                    department = admin.Department ?? "Administration"; // in case admin has no department
                }
            }

            if (user == null)
                return Unauthorized("User not found");

            if (string.IsNullOrEmpty(storedHash) || !BCrypt.Net.BCrypt.Verify(dto.Password, storedHash))
                return Unauthorized("Incorrect password");

            //  Generate token with all required values
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




        [HttpPost("send-reset-token")]
        public async Task<IActionResult> SendResetToken([FromBody] EmailDto dto)
        {
            var email = dto.Email;
            var student = await _context.Students.FirstOrDefaultAsync(s => s.Email == email && !s.IsDeleted);
            if (student == null)
                return NotFound("Email not found.");

            string otp = Guid.NewGuid().ToString().Substring(0, 6).ToUpper();

            var resetToken = new PasswordResetToken
            {
                Email = email,
                Token = otp,
                ExpiryTime = DateTime.UtcNow.AddMinutes(10)
            };

            _context.PasswordResetTokens.Add(resetToken);
            await _context.SaveChangesAsync();

            await _emailService.SendEmailAsync(email, "Campus Connect - Password Reset OTP",
                $"<p>Hello {student.FullName},</p><p>Your OTP to reset your password is:</p><h2>{otp}</h2><p>This OTP expires in 10 minutes.</p>");

            return Ok("OTP sent to your email.");
        }



        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Token) ||
                string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                return BadRequest("All fields are required.");
            }

            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.Email == dto.Email && !s.IsDeleted);

            if (student == null)
            {
                return NotFound("Student not found.");
            }

            // Validate the token — you should store & verify token securely.
            var storedToken = await _context.PasswordResetTokens
                .FirstOrDefaultAsync(t => t.Email == dto.Email && t.Token == dto.Token && !t.IsUsed);

            if (storedToken == null || storedToken.ExpiryTime < DateTime.UtcNow)
            {
                return BadRequest("Invalid or expired token.");
            }

            // Update password (you should hash it with BCrypt or similar)
            student.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            storedToken.IsUsed = true;
            storedToken.UsedOn = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok("Password reset successful.");
        }



    }
}