using System.ComponentModel.DataAnnotations;

namespace CampusConnectAPI.Models
{
    public class Event
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; } = string.Empty;

        public string PosterUrl { get; set; } = string.Empty;

        [Required(ErrorMessage = "EventDate is required")]
        public DateTime EventDate { get; set; }

        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        public string CreatedBy { get; set; } = string.Empty;
    }
}
