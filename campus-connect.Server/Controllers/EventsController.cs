using CampusConnectAPI.Data;
using CampusConnectAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CampusConnectAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EventController(AppDbContext context)
        {
            _context = context;
        }

        // 🔓 GET: api/event (Public)
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Event>>> GetAllEvents()
        {
            var events = await _context.Events
                .OrderByDescending(e => e.EventDate)
                .ToListAsync();

            return Ok(events);
        }

        // 🔓 GET: api/event/5 (Public)
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Event>> GetEvent(int id)
        {
            var evnt = await _context.Events.FindAsync(id);
            if (evnt == null)
                return NotFound(new { Message = "Event not found" });

            return Ok(evnt);
        }

        // 🔐 POST: api/event (Only admin/faculty)
        [HttpPost]
        [Authorize(Roles = "admin,faculty")]
        public async Task<ActionResult<Event>> CreateEvent([FromBody] Event evnt)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            evnt.CreatedOn = DateTime.UtcNow;
            evnt.CreatedBy = User?.Identity?.Name ?? "System";

            _context.Events.Add(evnt);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvent), new { id = evnt.Id }, evnt);
        }

        // 🔐 PUT: api/event/5 (Only admin/faculty)
        [HttpPut("{id}")]
        [Authorize(Roles = "admin,faculty")]
        public async Task<IActionResult> UpdateEvent(int id, [FromBody] Event evnt)
        {
            if (id != evnt.Id)
                return BadRequest(new { Message = "Event ID mismatch" });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existing = await _context.Events.FindAsync(id);
            if (existing == null)
                return NotFound(new { Message = "Event not found" });

            existing.Title = evnt.Title;
            existing.Description = evnt.Description;
            existing.PosterUrl = evnt.PosterUrl;
            existing.EventDate = evnt.EventDate;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        // 🔐 DELETE: api/event/5 (Only admin/faculty)
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin,faculty")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var evnt = await _context.Events.FindAsync(id);
            if (evnt == null)
                return NotFound(new { Message = "Event not found" });

            _context.Events.Remove(evnt);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
