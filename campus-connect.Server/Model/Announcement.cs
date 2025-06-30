using System.ComponentModel.DataAnnotations;

namespace CampusConnectAPI.Models
{
    public class Announcement
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string PostedBy { get; set; } = string.Empty;

        public DateTime PostedOn { get; set; } = DateTime.UtcNow;

        // Optional: image or file attachment
        public string AttachmentUrl { get; set; } = string.Empty;
    }
}
