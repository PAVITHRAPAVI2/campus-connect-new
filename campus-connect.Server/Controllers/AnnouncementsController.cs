using campus_connect.Server.Model;
using CampusConnectAPI.Data;
using CampusConnectAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CampusConnectAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AnnouncementsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/announcements
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Announcement>>> GetAnnouncements()
        {
            var list = await _context.Announcements
                .OrderByDescending(a => a.PostedOn)
                .ToListAsync();

            return Ok(list);
        }

        // GET: api/announcements/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Announcement>> GetAnnouncement(int id)
        {
            var announcement = await _context.Announcements.FindAsync(id);
            if (announcement == null)
                return NotFound($"Announcement with ID {id} not found.");

            return Ok(announcement);
        }

        // POST: api/announcements
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Announcement>> CreateAnnouncement(Announcement announcement)
        {
            announcement.PostedOn = DateTime.UtcNow;
            announcement.PostedBy = User?.Identity?.Name ?? "Admin";

            _context.Announcements.Add(announcement);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAnnouncement), new { id = announcement.Id }, announcement);
        }

        // PUT: api/announcements/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateAnnouncement(int id, Announcement announcement)
        {
            if (id != announcement.Id)
                return BadRequest("ID mismatch.");

            var existing = await _context.Announcements.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.Title = announcement.Title;
            existing.Description = announcement.Description;
            existing.AttachmentUrl = announcement.AttachmentUrl;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/announcements/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAnnouncement(int id)
        {
            var announcement = await _context.Announcements.FindAsync(id);
            if (announcement == null)
                return NotFound();

            _context.Announcements.Remove(announcement);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
