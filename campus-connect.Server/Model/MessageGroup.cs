using System.ComponentModel.DataAnnotations;

namespace campus_connect.Server.Model
{
    public class MessageGroup
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string Name { get; set; } = string.Empty; // e.g., "Common Group", "CSE Dept"

        [Required]
        public bool IsCommon { get; set; } = false; // true = visible to all

        public string? Department { get; set; } // only for department-based groups

        // Relationships
        public List<Message> Messages { get; set; } = new();

        // Audit
        public string CreatedBy { get; set; } = string.Empty;         // CollegeId of creator
        public string CreatedByRole { get; set; } = string.Empty;     // "admin" or "faculty"
        public string? UpdatedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public bool IsDeleted { get; set; } = false;
    }
}
