using campus_connect.Server.Model;
using campus_connect.Server.Model.DTO.Message;
using CampusConnectAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace campus_connect.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageGroupsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MessageGroupsController(AppDbContext context)
        {
            _context = context;
        }

        // Admin creates group
        [HttpPost("create")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> CreateGroup([FromBody] CreateGroupDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Group name is required");

            if (!dto.IsCommon && string.IsNullOrWhiteSpace(dto.Department))
                return BadRequest("Department is required for department-specific groups");

            var exists = await _context.MessageGroups.AnyAsync(g => g.Name == dto.Name);
            if (exists)
                return BadRequest("Group with this name already exists");

            var group = new MessageGroup
            {
                Name = dto.Name,
                IsCommon = dto.IsCommon,
                Department = dto.IsCommon ? null : dto.Department
            };

            _context.MessageGroups.Add(group);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Group created", groupId = group.Id });
        }

        [HttpGet("my-groups")]
        [Authorize]
        public async Task<IActionResult> GetMyGroups()
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var department = User.FindFirst("Department")?.Value;

            var groups = await _context.MessageGroups
                .Where(g => g.IsCommon || (!g.IsCommon && g.Department == department))
                .Select(g => new MessageGroupDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    IsCommon = g.IsCommon,
                    Department = g.Department
                })
                .ToListAsync();

            return Ok(groups);
        }
    }
}
