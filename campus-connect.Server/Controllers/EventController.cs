using campus_connect.Server.Model;
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
    public class EventController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public EventController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // ✅ Upload Poster
        [HttpPost("upload-poster")]
        [RequestSizeLimit(5 * 1024 * 1024)]
        public async Task<IActionResult> UploadPoster([FromForm] IFormFile poster)
        {
            if (poster == null || poster.Length == 0)
                return BadRequest("No file uploaded.");

            var uploadsPath = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsPath))
                Directory.CreateDirectory(uploadsPath);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(poster.FileName);
            var filePath = Path.Combine(uploadsPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await poster.CopyToAsync(stream);
            }

            var url = $"/uploads/{fileName}";
            return Ok(new { Url = url });
        }

        // ✅ Create Event
        [HttpPost]
        [Authorize(Roles = "admin,faculty")]
        public async Task<IActionResult> CreateEvent([FromBody] Event evt)
        {
            evt.CreatedBy = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "unknown";
            evt.CreatedAt = DateTime.UtcNow;

            _context.Events.Add(evt);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Event created", evt.Id });
        }

        // ✅ Get All Visible Events
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetVisibleEvents()
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var dept = User.FindFirst("Department")?.Value;

            var query = _context.Events.Where(e => !e.IsDeleted);

            if (role == "student" || role == "faculty")
            {
                query = query.Where(e => e.Department == null || e.Department == dept);
            }

            var events = await query.OrderByDescending(e => e.EventDate).ToListAsync();
            return Ok(events);
        }

        // ✅ Get by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEventById(int id)
        {
            var evt = await _context.Events.FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);
            if (evt == null) return NotFound("Event not found");

            return Ok(evt);
        }

        // GET: api/Event/paged?skip=0&take=10
        [HttpGet("paged")]
        [Authorize(Roles = "student,faculty")]
        public async Task<IActionResult> GetPagedEvents([FromQuery] int skip = 0, [FromQuery] int take = 10)
        {
            var dept = User.FindFirst("Department")?.Value;

            var query = _context.Events
                .Where(e => !e.IsDeleted && (e.Department == null || e.Department == dept))
                .OrderByDescending(e => e.EventDate);

            var total = await query.CountAsync();
            var events = await query.Skip(skip).Take(take).ToListAsync();

            return Ok(new
            {
                Total = total,
                Skip = skip,
                Take = take,
                Events = events
            });
        }







        // ✅ Update
        [HttpPut("{id}")]
        [Authorize(Roles = "admin,faculty")]
        public async Task<IActionResult> UpdateEvent(int id, [FromBody] Event updated)
        {
            var evt = await _context.Events.FindAsync(id);
            if (evt == null || evt.IsDeleted) return NotFound("Event not found");

            evt.Title = updated.Title;
            evt.Description = updated.Description;
            evt.EventDate = updated.EventDate;
            evt.PosterUrl = updated.PosterUrl;
            evt.Department = updated.Department;

            evt.UpdatedAt = DateTime.UtcNow;
            evt.UpdatedBy = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            await _context.SaveChangesAsync();
            return Ok("Event updated successfully");
        }

        // ✅ Soft Delete
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var evt = await _context.Events.FindAsync(id);
            if (evt == null || evt.IsDeleted) return NotFound("Event not found");

            evt.IsDeleted = true;
            evt.UpdatedAt = DateTime.UtcNow;
            evt.UpdatedBy = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            await _context.SaveChangesAsync();
            return Ok("Event deleted");
        }
    }
}

