using campus_connect.Server.Model.DTO.Faculty;
using CampusConnectAPI.Data;
using CampusConnectAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace campus_connect.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacultiesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FacultiesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("faculties")]
        public async Task<IActionResult> GetAllFaculties()
        {
            var faculties = await _context.Faculties
                .Where(f => !f.IsDeleted)
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
                })
                .ToListAsync();

            return Ok(faculties);
        }

        [HttpPost("register-faculty")]
        public async Task<IActionResult> RegisterFaculty([FromBody] RegisterFacultyDto dto)
        {
            if (await _context.Faculties.AnyAsync(f => f.Email == dto.Email || f.CollegeId == dto.CollegeId))
                return BadRequest("Faculty already exists.");

            var faculty = new Faculty
            {
                CollegeId = dto.CollegeId,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                FullName = dto.FullName,
                Department = dto.Department,
                Role = "faculty",   
                IsApproved = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CreatedBy = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? dto.CollegeId,
                UpdatedBy = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? dto.CollegeId
            };

            _context.Faculties.Add(faculty);
            await _context.SaveChangesAsync();

            return Ok("Faculty registered successfully.");
        }

        [HttpGet("faculties/{id}")]
        public async Task<IActionResult> GetFacultyById(Guid id)
        {
            var faculty = await _context.Faculties
                .Where(f => f.Id == id && !f.IsDeleted)
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
                })
                .FirstOrDefaultAsync();

            if (faculty == null)
                return NotFound("Faculty not found");

            return Ok(faculty);
        }
        [HttpDelete("faculties/{id}")]
        //[Authorize(Roles = "admin")]
        public async Task<IActionResult> SoftDeleteFaculty(Guid id)
        {
            var faculty = await _context.Faculties.FirstOrDefaultAsync(f => f.Id == id && !f.IsDeleted);
            if (faculty == null)
                return NotFound("Faculty not found");

            faculty.IsDeleted = true;
            faculty.UpdatedAt = DateTime.UtcNow;
            faculty.UpdatedBy = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "system";

            await _context.SaveChangesAsync();
            return Ok("Faculty soft-deleted successfully.");
        }



        [HttpPut("faculties/{id}/restore")]
        //[Authorize(Roles = "admin")]
        public async Task<IActionResult> RestoreFaculty(Guid id)
        {
            var faculty = await _context.Faculties
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(f => f.Id == id && f.IsDeleted);

            if (faculty == null)
                return NotFound("Soft-deleted faculty not found");

            faculty.IsDeleted = false;
            faculty.UpdatedAt = DateTime.UtcNow;
            faculty.UpdatedBy = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "system";

            await _context.SaveChangesAsync();
            return Ok("Faculty restored successfully.");
        }


        [Authorize(Roles = "faculty")]
        [HttpGet("pending-students")]
        public async Task<IActionResult> GetPendingStudentsInDepartment()
        {
            var facultyCollegeId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var faculty = await _context.Faculties.FirstOrDefaultAsync(f => f.CollegeId == facultyCollegeId && !f.IsDeleted);
            if (faculty == null)
                return Unauthorized("Faculty not found");

            var department = faculty.Department;

            var pendingStudents = await _context.Students
                .Where(s => !s.IsDeleted && !s.IsApproved && s.Department == department)
                .Select(s => new
                {
                    s.Id,
                    s.CollegeId,
                    s.FullName,
                    s.Email,
                    s.Department,
                    s.Batch,
                    s.CreatedAt
                })
                .ToListAsync();

            return Ok(pendingStudents);
        }


        [HttpPut("approve-student/{studentId}")]
        public async Task<IActionResult> ApproveStudent(Guid studentId)
        {
            var facultyCollegeId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var faculty = await _context.Faculties.FirstOrDefaultAsync(f => f.CollegeId == facultyCollegeId && !f.IsDeleted);
            if (faculty == null)
                return Unauthorized("Faculty not found");

            var student = await _context.Students.FirstOrDefaultAsync(s => s.Id == studentId && !s.IsDeleted);
            if (student == null)
                return NotFound("Student not found");

            if (student.Department != faculty.Department)
                return Forbid("You can only approve students in your own department.");

            student.IsApproved = true;
            student.UpdatedAt = DateTime.UtcNow;
            student.UpdatedBy = facultyCollegeId;

            await _context.SaveChangesAsync();
            return Ok("Student approved successfully.");
        }

    }
}
