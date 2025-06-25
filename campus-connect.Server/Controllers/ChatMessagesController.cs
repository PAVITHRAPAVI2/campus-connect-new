using campus_connect.Server.Model;
using CampusConnectAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CampusConnectAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChatController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/chat/common
        [HttpGet("common")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ChatMessage>>> GetCommonMessages()
        {
            var messages = await _context.ChatMessages
                .Where(m => m.IsCommonChat)
                .OrderByDescending(m => m.SentAt)
                .ToListAsync();

            return Ok(messages);
        }

        // GET: api/chat/department/CS
        [HttpGet("department/{dept}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ChatMessage>>> GetDepartmentMessages(string dept)
        {
            var messages = await _context.ChatMessages
                .Where(m => !m.IsCommonChat && m.Department.ToLower() == dept.ToLower())
                .OrderByDescending(m => m.SentAt)
                .ToListAsync();

            return Ok(messages);
        }

        // POST: api/chat
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ChatMessage>> SendMessage([FromBody] ChatMessage msg)
        {
            if (string.IsNullOrWhiteSpace(msg.SenderName) ||
                string.IsNullOrWhiteSpace(msg.Role) ||
                string.IsNullOrWhiteSpace(msg.Message) ||
                string.IsNullOrWhiteSpace(msg.Department))
            {
                return BadRequest("SenderName, Role, Department, and Message are required.");
            }

            msg.SentAt = DateTime.UtcNow;

            _context.ChatMessages.Add(msg);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCommonMessages), new { id = msg.Id }, msg);
        }

        // POST: api/chat/{id}/like
        [HttpPost("{id}/like")]
        [Authorize]
        public async Task<IActionResult> LikeMessage(int id)
        {
            var message = await _context.ChatMessages.FindAsync(id);
            if (message == null)
                return NotFound(new { Message = "Chat message not found." });

            message.Likes++;
            await _context.SaveChangesAsync();

            return Ok(new { message.Id, message.Likes });
        }
    }
}





