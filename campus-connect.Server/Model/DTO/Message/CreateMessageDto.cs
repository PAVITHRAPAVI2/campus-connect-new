using System.ComponentModel.DataAnnotations;

namespace campus_connect.Server.Model.DTO.Message
{
    public class CreateMessageDto
    {
        [Required]
        [MinLength(1, ErrorMessage = "Message content cannot be empty.")]
        public string Content { get; set; } = string.Empty;

        [Required]
        public Guid GroupId { get; set; }
    }
}
