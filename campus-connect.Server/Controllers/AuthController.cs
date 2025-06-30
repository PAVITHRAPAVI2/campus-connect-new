using campus_connect.Server.Model.DTO.CampusConnectAPI.DTOs;
using CampusConnectAPI.Data;
using CampusConnectAPI.DTOs;
using CampusConnectAPI.Models;
using CampusConnectAPI.Services;
using Microsoft.AspNetCore.Authorization;
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

        public AuthController(AppDbContext context, JwtService jwt)
        {
            _context = context;
            _jwt = jwt;
        }

        // 1️⃣ Register Student (Public)
        [HttpPost("register-student-public")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterStudentPublic([FromBody] RegisterStudentDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.CollegeId) || string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("College ID and Email are required");

            bool exists = await _context.Students
                .AnyAsync(s => s.Email == dto.Email || s.CollegeId == dto.CollegeId);

            if (exists)
                return BadRequest("Student already exists");

            var student = new Student
            {
                CollegeId = dto.CollegeId.Trim(),
                Email = dto.Email.Trim(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                FullName = dto.FullName,
                Department = dto.Department,
                Batch = dto.Batch,
                Role = "student",
                IsApproved = false,
                CreatedBy = "Self"
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return Ok("Student registered successfully and pending approval.");
        }

        // 2️⃣ Get All Unapproved Students (faculty, admin)
        [HttpGet("unapproved-students")]
        [Authorize(Roles = "faculty,admin")]
        public async Task<IActionResult> GetUnapprovedStudents()
        {
            var unapproved = await _context.Students
                .Where(s => !s.IsApproved && !s.IsDeleted)
                .ToListAsync();

            return Ok(unapproved);
        }

        // 3️⃣ Approve Student
        [HttpPost("approve-student/{collegeId}")]
        [Authorize(Roles = "faculty,admin")]
        public async Task<IActionResult> ApproveStudent(string collegeId)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.CollegeId == collegeId && !s.IsDeleted);

            if (student == null)
                return NotFound("Student not found");

            if (student.IsApproved)
                return BadRequest("Student already approved");

            student.IsApproved = true;
            student.UpdatedAt = DateTime.UtcNow;
            student.UpdatedBy = User.Identity?.Name ?? "faculty";
            student.ApprovedByCollegeId = User.Identity?.Name ?? "faculty";
            student.ApprovedOn = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok("Student approved successfully");
        }

        // 🔐 4️⃣ Login
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.CollegeId) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest("College ID and Password are required");

            object? user = null;
            string role = "";
            string storedHash = "";
            string email = "";
            string userId = "";
            string department = "";

            string collegeId = dto.CollegeId.Trim();

            try
            {
                // 👩‍🎓 Try student
                var student = await _context.Students
                    .FirstOrDefaultAsync(s => s.CollegeId == collegeId && !s.IsDeleted);

                if (student != null)
                {
                    if (!student.IsApproved)
                        return Unauthorized("Student registration not approved yet.");

                    user = student;
                    storedHash = student.PasswordHash;
                    role = student.Role;
                    email = student.Email;
                    userId = student.CollegeId;
                }
                else
                {
                    // 👨‍🏫 Try faculty
                    var faculty = await _context.Faculties
                        .FirstOrDefaultAsync(f => f.CollegeId == collegeId && !f.IsDeleted);

                    if (faculty != null)
                    {
                        user = faculty;
                        storedHash = faculty.PasswordHash;
                        role = faculty.Role;
                        email = faculty.Email;
                        userId = faculty.CollegeId;
                    }
                    else
                    {
                        // 👨‍💼 Try admin
                        var admin = await _context.Admins
                            .FirstOrDefaultAsync(a => a.CollegeId == collegeId && !a.IsDeleted);

                        if (admin != null)
                        {
                            user = admin;
                            storedHash = admin.PasswordHash;
                            role = admin.Role;
                            email = admin.Email;
                            userId = admin.CollegeId;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Login error: {ex.Message}");
            }

            // 🔐 Final credential check
            if (user == null || string.IsNullOrEmpty(storedHash) || !BCrypt.Net.BCrypt.Verify(dto.Password, storedHash))
                return Unauthorized("Invalid credentials");

            var token = _jwt.GenerateToken(userId, email, role, department);

            return Ok(new LoginResponseDto
            {
                Token = token,
                Role = role,
                UserId = userId,
                Email = email,
                Expiration = DateTime.UtcNow.AddHours(1)
            });
        }
    }
}
