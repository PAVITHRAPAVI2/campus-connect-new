using System.ComponentModel.DataAnnotations;

namespace campus_connect.Server.Model
{
    public class Message : AuditableEntity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string Content { get; set; } = string.Empty;

        [Required]
        public string SenderCollegeId { get; set; } = string.Empty;

        [Required]
        public string SenderRole { get; set; } = string.Empty;

        [Required]
        public Guid GroupId { get; set; }

        public MessageGroup Group { get; set; } = null!;
    }
}
