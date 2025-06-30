using System.ComponentModel.DataAnnotations;

namespace campus_connect.Server.Model
{
    public class MessageGroup
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public bool IsCommon { get; set; } = false;

        public string? Department { get; set; }

        public List<Message> Messages { get; set; } = new();

        public bool IsDeleted { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
