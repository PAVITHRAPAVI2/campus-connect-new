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
    public class MessageController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MessageController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("groups")]
        [Authorize]
        public async Task<IActionResult> GetAccessibleGroups()
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var department = User.FindFirst("Department")?.Value;

            var groups = await _context.MessageGroups
                .Where(g => g.IsCommon || (g.Department == department))
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

        [HttpGet("groups/{groupId}/messages")]
        [Authorize]
        public async Task<IActionResult> GetGroupMessages(Guid groupId)
        {
            var group = await _context.MessageGroups
                .FirstOrDefaultAsync(g => g.Id == groupId && !g.IsDeleted);

            if (group == null)
                return NotFound("Group not found");

            var userDept = User.FindFirst("Department")?.Value;
            if (!group.IsCommon && group.Department != userDept)
                return Forbid("Unauthorized");

            var messages = await _context.Messages
                .Where(m => m.GroupId == groupId)
                .OrderBy(m => m.CreatedAt)
                .Select(m => new MessageResponseDto
                {
                    Id = m.Id,
                    Content = m.Content,
                    SenderCollegeId = m.SenderCollegeId,
                    SenderRole = m.SenderRole,
                    SentAt = m.CreatedAt
                })
                .ToListAsync();

            return Ok(messages);
        }

        [HttpPost("send")]
        [Authorize]
        public async Task<IActionResult> SendMessage([FromBody] CreateMessageDto dto)
        {
            var group = await _context.MessageGroups
                .FirstOrDefaultAsync(g => g.Id == dto.GroupId && !g.IsDeleted);

            if (group == null)
                return NotFound("Group not found");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var department = User.FindFirst("Department")?.Value;

            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(role))
                return Unauthorized("Invalid user token claims");

            if (!group.IsCommon && group.Department != department)
                return Forbid("Unauthorized");

            var message = new Message
            {
                Content = dto.Content,
                SenderCollegeId = userId,
                SenderRole = role,
                GroupId = group.Id,
                CreatedBy = userId,
                UpdatedBy = userId
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return Ok("Message sent");
        }
    }
}
