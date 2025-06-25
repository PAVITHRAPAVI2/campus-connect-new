// File: Controllers/AdminController.cs
using CampusConnectAPI.Data;
using CampusConnectAPI.DTOs;
using CampusConnectAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CampusConnectAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAdmin([FromBody] AdminCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.CollegeId) || string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("College ID and Email are required");

            if (await _context.Admins.AnyAsync(a => a.Email == dto.Email || a.CollegeId == dto.CollegeId))
                return BadRequest("Admin already exists with given Email or College ID");


            var creatorId = User?.Identity?.IsAuthenticated == true
                ? User.Identity?.Name ?? "System"
                : "System";

            var admin = new Admin
            {
                CollegeId = dto.CollegeId,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                FullName = dto.FullName,
                IsApproved = true,
                CreatedBy = creatorId,
                UpdatedBy = creatorId
            };


            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();

            return Ok("Admin registered successfully.");
        }

        // ✅ Get all Admins (optional)
        [HttpGet]
        public async Task<IActionResult> GetAllAdmins()
        {
            var admins = await _context.Admins
                .Where(a => !a.IsDeleted)
                .ToListAsync();

            return Ok(admins);
        }
    }
}
