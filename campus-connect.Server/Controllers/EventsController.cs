using campus_connect.Server.Model;
using CampusConnectAPI.Data;
using CampusConnectAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CampusConnectAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EventsController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all events ordered by event date descending.
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
        {
            var events = await _context.Events
                .OrderByDescending(e => e.EventDate)
                .ToListAsync();

            return Ok(events);
        }

        /// <summary>
        /// Get a specific event by ID.
        /// </summary>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Event>> GetEvent(int id)
        {
            var ev = await _context.Events.FindAsync(id);

            if (ev == null)
                return NotFound($"Event with ID {id} not found.");

            return Ok(ev);
        }

        /// <summary>
        /// Create a new event (Admin only).
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Event>> CreateEvent(Event ev)
        {
            ev.CreatedOn = DateTime.UtcNow;
            ev.CreatedBy = User?.Identity?.Name ?? "System";

            _context.Events.Add(ev);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvent), new { id = ev.Id }, ev);
        }

        /// <summary>
        /// Update an existing event (Admin only).
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateEvent(int id, Event ev)
        {
            if (id != ev.Id)
                return BadRequest("Event ID mismatch.");

            var existingEvent = await _context.Events.FindAsync(id);
            if (existingEvent == null)
                return NotFound($"Event with ID {id} not found.");

            // Update only the editable fields
            existingEvent.Title = ev.Title;
            existingEvent.Description = ev.Description;
            existingEvent.PosterUrl = ev.PosterUrl;
            existingEvent.EventDate = ev.EventDate;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        /// <summary>
        /// Delete an event by ID (Admin only).
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var ev = await _context.Events.FindAsync(id);
            if (ev == null)
                return NotFound($"Event with ID {id} not found.");

            _context.Events.Remove(ev);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
