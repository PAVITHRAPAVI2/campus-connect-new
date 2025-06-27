using CampusConnectAPI.Data;
using CampusConnectAPI.DTOs;
using CampusConnectAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CampusConnectAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FacultyController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FacultyController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/faculty/register
        [HttpPost("register")]
        [Authorize(Roles = "admin")] // Only admin can register a faculty
        public async Task<IActionResult> RegisterFaculty([FromBody] FacultyCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.CollegeId) || string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("College ID and Email are required");

            if (await _context.Faculties.AnyAsync(f => f.Email == dto.Email || f.CollegeId == dto.CollegeId))
                return BadRequest("Faculty already exists with given Email or College ID");

            var creatorId = User?.Identity?.IsAuthenticated == true
                ? User.Identity?.Name ?? "System"
                : "System";

            var faculty = new Faculty
            {
                CollegeId = dto.CollegeId,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                FullName = dto.FullName,
                Department = dto.Department,
                Role = "faculty",
                IsApproved = true,
                CreatedBy = creatorId,
                UpdatedBy = creatorId
            };

            _context.Faculties.Add(faculty);
            await _context.SaveChangesAsync();

            return Ok("Faculty registered successfully.");
        }

        // GET: api/faculty
        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAllFaculty()
        {
            var list = await _context.Faculties
                .Where(f => !f.IsDeleted)
                .ToListAsync();

            return Ok(list);
        }

        // PUT: api/faculty/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateFaculty(Guid id, [FromBody] FacultyUpdateDto dto)
        {
            var faculty = await _context.Faculties.FindAsync(id);
            if (faculty == null || faculty.IsDeleted)
                return NotFound("Faculty not found");

            // Optional: Check if email is already used by another faculty
            var emailUsed = await _context.Faculties.AnyAsync(f => f.Email == dto.Email && f.Id != id);
            if (emailUsed)
                return BadRequest("Another faculty already uses this email.");

            faculty.FullName = dto.FullName;
            faculty.Email = dto.Email;
            faculty.Department = dto.Department;
            faculty.IsApproved = dto.IsApproved;
            faculty.UpdatedBy = User.Identity?.Name ?? "System";
            faculty.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok("Faculty updated successfully.");
        }

        // DELETE: api/faculty/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteFaculty(int id)
        {
            var faculty = await _context.Faculties.FindAsync(id);
            if (faculty == null || faculty.IsDeleted)
                return NotFound("Faculty not found");

            faculty.IsDeleted = true;
            faculty.UpdatedBy = User.Identity?.Name ?? "System";
            faculty.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok("Faculty soft-deleted.");
        }
    }
}
