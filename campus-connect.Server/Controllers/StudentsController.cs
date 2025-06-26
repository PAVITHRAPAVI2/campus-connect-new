using campus_connect.Server.Model.DTO;
using CampusConnectAPI.Data;
using CampusConnectAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace campus_connect.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentsController(AppDbContext context)
        {
            _context = context;
        }





        [HttpGet("students/approved")]
        public async Task<IActionResult> GetApprovedStudents()
        {
            var students = await _context.Students
                .Where(s => !s.IsDeleted && s.IsApproved)
                .Select(s => new
                {
                    s.Id,
                    s.CollegeId,
                    s.FullName,
                    s.Email,
                    s.Department,
                    s.Batch,
                    s.Role,
                    s.IsApproved,
                    s.Avatar,
                    s.CreatedAt
                })
                .ToListAsync();

            return Ok(students);
        }


        [HttpGet("students/pending")]
        public async Task<IActionResult> GetPendingStudents()
        {
            var students = await _context.Students
                .Where(s => !s.IsDeleted && !s.IsApproved)
                .Select(s => new
                {
                    s.Id,
                    s.CollegeId,
                    s.FullName,
                    s.Email,
                    s.Department,
                    s.Batch,
                    s.Role,
                    s.IsApproved,
                    s.Avatar,
                    s.CreatedAt
                })
                .ToListAsync();

            return Ok(students);
        }

        [HttpGet("students/pending/{department}")]
        public async Task<IActionResult> GetPendingStudentsByDepartment(string department)
        {
            var students = await _context.Students
                .Where(s => !s.IsDeleted && !s.IsApproved && s.Department == department)
                .Select(s => new
                {
                    s.Id,
                    s.CollegeId,
                    s.FullName,
                    s.Email,
                    s.Department,
                    s.Batch,
                    s.Role,
                    s.IsApproved,
                    s.Avatar,
                    s.CreatedAt
                })
                .ToListAsync();

            return Ok(students);
        }


        [HttpPut("students/{id}")]
        public async Task<IActionResult> UpdateStudent(Guid id, [FromBody] UpdateStudentDto dto)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null || student.IsDeleted)
                return NotFound("Student not found.");

            student.FullName = dto.FullName;
            student.Department = dto.Department;
            student.Batch = dto.Batch;
            student.Avatar = dto.Avatar;
            student.UpdatedAt = DateTime.UtcNow;
            student.UpdatedBy = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "system";

            await _context.SaveChangesAsync();
            return Ok("Student updated successfully.");
        }

        [HttpPut("students/{id}/restore")]
        //[Authorize(Roles = "admin")]
        public async Task<IActionResult> RestoreStudent(Guid id)
        {
            var student = await _context.Students
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(s => s.Id == id && s.IsDeleted);

            if (student == null)
                return NotFound("Soft-deleted student not found");

            student.IsDeleted = false;
            student.UpdatedAt = DateTime.UtcNow;
            student.UpdatedBy = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "system";

            await _context.SaveChangesAsync();
            return Ok("Student restored successfully.");
        }


        [HttpDelete("students/{id}")]
        //[Authorize(Roles = "admin")]
        public async Task<IActionResult> SoftDeleteStudent(Guid id)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);
            if (student == null)
                return NotFound("Student not found");

            student.IsDeleted = true;
            student.UpdatedAt = DateTime.UtcNow;
            student.UpdatedBy = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "system";

            await _context.SaveChangesAsync();
            return Ok("Student soft-deleted successfully.");
        }
    }
}
