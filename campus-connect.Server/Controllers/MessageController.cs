using campus_connect.Server.Model;
using campus_connect.Server.Model.DTO.Message;
using CampusConnectAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;


namespace campus_connect.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<ChatHub> _hubContext;

        public MessageController(AppDbContext context , IHubContext<ChatHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // ✅ Get All Accessible Groups
        [HttpGet("groups")]
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

        // ✅ Get Messages in a Group
        [HttpGet("groups/{groupId}/messages")]
        public async Task<IActionResult> GetGroupMessages(Guid groupId)
        {
            var group = await _context.MessageGroups.FirstOrDefaultAsync(g => g.Id == groupId && !g.IsDeleted);
            if (group == null) return NotFound("Group not found");

            var userDept = User.FindFirst("Department")?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (!group.IsCommon && group.Department != userDept)
                return Forbid("You are not authorized to view this group's messages");

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
            var group = await _context.MessageGroups.FirstOrDefaultAsync(g => g.Id == dto.GroupId && !g.IsDeleted);
            if (group == null) return NotFound("Group not found");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var userDept = User.FindFirst("Department")?.Value;

            if (!group.IsCommon && group.Department != userDept)
                return Forbid("You cannot send messages to this group");

            var message = new Message
            {
                Content = dto.Content,
                SenderCollegeId = userId!,
                SenderRole = role!,
                GroupId = group.Id,
                CreatedBy = userId,
                UpdatedBy = userId
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            
            await _hubContext.Clients.Group(dto.GroupId.ToString()).SendAsync("ReceiveMessage", new
            {
                Id = message.Id,
                Content = message.Content,
                SenderCollegeId = message.SenderCollegeId,
                SenderRole = message.SenderRole,
                SentAt = message.CreatedAt
            });

            return Ok("Message sent and Group.");
        }

        // ✅ Update a message (only sender can update)
        [HttpPut("messages/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateMessage(Guid id, [FromBody] UpdateMessageDto dto)
        {
            var message = await _context.Messages.FindAsync(id);
            if (message == null)
                return NotFound("Message not found");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (message.SenderCollegeId != userId)
                return Forbid("You can only edit your own messages");

            message.Content = dto.Content;
            message.UpdatedAt = DateTime.UtcNow;
            message.UpdatedBy = userId;

            await _context.SaveChangesAsync();
            return Ok("Message updated successfully.");
        }

        // ✅ Soft delete a message (only sender can delete)
        [HttpDelete("messages/{id}")]
        [Authorize]
        public async Task<IActionResult> SoftDeleteMessage(Guid id)
        {
            var message = await _context.Messages.FindAsync(id);
            if (message == null)
                return NotFound("Message not found");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (message.SenderCollegeId != userId)
                return Forbid("You can only delete your own messages");

            message.IsDeleted = true;
            message.UpdatedAt = DateTime.UtcNow;
            message.UpdatedBy = userId;

            await _context.SaveChangesAsync();
            return Ok("Message deleted successfully.");
        }



    }
}
