using campus_connect.Server.Model.DTO;
using campus_connect.Server.Model.DTO.Admin;
using CampusConnectAPI.Data;
using CampusConnectAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace campus_connect.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("admins")]
        public async Task<IActionResult> GetAllAdmins()
        {
            var admins = await _context.Admins
                .Where(a => !a.IsDeleted)
                .Select(a => new
                {
                    a.Id,
                    a.CollegeId,
                    a.FullName,
                    a.Email,
                    a.Department,
                    a.Role,
                    a.CreatedAt
                })
                .ToListAsync();

            return Ok(admins);
        }
        [HttpGet("admins/{id}")]
        public async Task<IActionResult> GetAdminById(Guid id)
        {
            var admin = await _context.Admins
                .Where(a => a.Id == id && !a.IsDeleted)
                .Select(a => new
                {
                    a.Id,
                    a.CollegeId,
                    a.FullName,
                    a.Email,
                    a.Department,
                    a.Role,
                    a.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (admin == null)
                return NotFound("Admin not found");

            return Ok(admin);
        }


        [HttpPost("register-admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterAdminDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.CollegeId) || string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("College ID and Email are required");

            if (await _context.Admins.AnyAsync(a => a.Email == dto.Email || a.CollegeId == dto.CollegeId))
                return BadRequest("Admin already exists with given Email or College ID");

            var admin = new Admin
            {
                CollegeId = dto.CollegeId,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                FullName = dto.FullName,
                Role = "admin",
                Department = "Administration",
                CreatedBy = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? dto.CollegeId,
                UpdatedBy = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? dto.CollegeId
            };

            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();

            return Ok("Admin registered successfully.");
        }





        [HttpPut("admins/{id}")]
        public async Task<IActionResult> UpdateAdmin(Guid id, [FromBody] AdminUpdateDto dto)
        {
            var admin = await _context.Admins.FindAsync(id);
            if (admin == null || admin.IsDeleted)
                return NotFound("Admin not found.");

            admin.FullName = dto.FullName;
            admin.Department = dto.Department;
            admin.UpdatedAt = DateTime.UtcNow;
            admin.UpdatedBy = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? admin.CollegeId;

            await _context.SaveChangesAsync();
            return Ok("Admin updated successfully.");
        }


        [HttpDelete("admins/{id}")]
        public async Task<IActionResult> SoftDeleteAdmin(Guid id)
        {
            var admin = await _context.Admins.FindAsync(id);
            if (admin == null || admin.IsDeleted)
                return NotFound("Admin not found.");

            admin.IsDeleted = true;
            admin.UpdatedAt = DateTime.UtcNow;
            admin.UpdatedBy = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? admin.CollegeId;

            await _context.SaveChangesAsync();
            return Ok("Admin soft deleted.");
        }


        [HttpPut("admins/{id}/restore")]
        //[Authorize(Roles = "admin")]
        public async Task<IActionResult> RestoreStudent(Guid id)
        {
            var admin = await _context.Admins
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(s => s.Id == id && s.IsDeleted);

            if (admin == null)
                return NotFound("Soft-deleted Admin not found");

            admin.IsDeleted = false;
            admin.UpdatedAt = DateTime.UtcNow;
            admin.UpdatedBy = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "system";

            await _context.SaveChangesAsync();
            return Ok("Admin restored successfully.");
        }
    }
}
