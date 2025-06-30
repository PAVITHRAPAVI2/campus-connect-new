using System.ComponentModel.DataAnnotations;

namespace campus_connect.Server.Model.DTO.Events
{
    public class CreateEventDto
    {
        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Url]
        public string PosterUrl { get; set; } = string.Empty;

        [Required]
        public DateTime EventDate { get; set; }

        public string? Department { get; set; } // Optional for department-specific events
    }
}
