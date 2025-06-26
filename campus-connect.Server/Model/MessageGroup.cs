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

        public string? Department { get; set; } // for department-specific groups

        public List<Message> Messages { get; set; } = new();

        
        public bool IsDeleted { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}
