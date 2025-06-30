using campus_connect.Server.Model;
using campus_connect.Server.Model.DTO.Message;
using CampusConnectAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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

        //  Only admins can create groups
        [HttpPost("create")]
        [Authorize(Roles = "admin,faculty")]
        public async Task<IActionResult> CreateGroup([FromBody] CreateGroupDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Group name is required");

            if (!dto.IsCommon && string.IsNullOrWhiteSpace(dto.Department))
                return BadRequest("Department is required for department-specific groups");

            // Optional: prevent duplicate group name
            var exists = await _context.MessageGroups.AnyAsync(g => g.Name == dto.Name && !g.IsDeleted);
            if (exists)
                return BadRequest("A group with this name already exists");

            var creatorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var creatorRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(creatorId) || string.IsNullOrEmpty(creatorRole))
                return Unauthorized("Invalid token or missing claims");

            var group = new MessageGroup
            {
                Name = dto.Name,
                IsCommon = dto.IsCommon,
                Department = dto.IsCommon ? null : dto.Department,
                CreatedBy = creatorId,
                CreatedByRole = creatorRole,
                CreatedAt = DateTime.UtcNow
            };

            _context.MessageGroups.Add(group);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Group created successfully",
                GroupId = group.Id
            });
        }

        //  Optional: Get all visible groups based on user role & department
        [HttpGet("my-groups")]
        [Authorize]
        public async Task<IActionResult> GetMyGroups()
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var department = User.FindFirst("Department")?.Value;

            var groups = await _context.MessageGroups
                .Where(g =>
                    g.IsCommon ||
                    (!g.IsCommon && g.Department == department && (role == "student" || role == "faculty" || role == "admin"))
                )
                .Select(g => new
                {
                    g.Id,
                    g.Name,
                    g.IsCommon,
                    g.Department
                })
                .ToListAsync();

            return Ok(groups);
        }
        [HttpPut("update/{groupId}")]
        [Authorize(Roles = "admin,faculty")]
        public async Task<IActionResult> UpdateGroup(Guid groupId, [FromBody] CreateGroupDto dto)
        {
            var group = await _context.MessageGroups.FindAsync(groupId);
            if (group == null || group.IsDeleted)
                return NotFound("Group not found");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userDept = User.FindFirst("Department")?.Value;

            // Authorization Logic
            if (group.CreatedByRole == "admin")
            {
                if (userRole != "admin")
                    return Forbid("Only admin can update this group.");
            }
            else if (group.CreatedByRole == "faculty")
            {
                if (userRole == "admin") { /* allowed */ }
                else if (group.CreatedBy == userId) { /* allowed */ }
                else if (group.Department == userDept && userRole == "faculty") { /* allowed */ }
                else
                    return Forbid("You are not authorized to update this group.");
            }

            // Validation
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Group name is required.");

            if (!dto.IsCommon && string.IsNullOrWhiteSpace(dto.Department))
                return BadRequest("Department is required for department-specific groups.");

            // Update fields
            group.Name = dto.Name;
            group.IsCommon = dto.IsCommon;
            group.Department = dto.IsCommon ? null : dto.Department;
            group.UpdatedBy = userId;
            group.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok("Group updated successfully.");
        }



        [HttpDelete("delete/{groupId}")]
        [Authorize(Roles = "admin,faculty")]
        public async Task<IActionResult> DeleteGroup(Guid groupId)
        {
            var group = await _context.MessageGroups.FindAsync(groupId);
            if (group == null || group.IsDeleted)
                return NotFound("Group not found");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userDept = User.FindFirst("Department")?.Value;

            // If admin created → only admin can delete
            if (group.CreatedByRole == "admin")
            {
                if (userRole != "admin")
                    return Forbid("Only admin can delete this group created by an admin.");
            }  

            // If faculty created:
            else if (group.CreatedByRole == "faculty")
            {
                if (userRole == "admin") { /* allowed */ }
                else if (group.CreatedBy == userId) { /* allowed */ }
                else if (group.Department == userDept && userRole == "faculty") { /* allowed */ }
                else
                    return Forbid("You are not authorized to delete this group.");
            }

            group.IsDeleted = true;
            group.UpdatedBy = userId;
            group.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok("Group deleted successfully.");
        }

    }
}
 