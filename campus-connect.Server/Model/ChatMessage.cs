      
namespace campus_connect.Server.Model
{
    public class ChatMessage
    {
        public int Id { get; set; }

        public required string SenderName { get; set; } // e.g., "John (Student)"
        public required string Role { get; set; }       // "Student", "Faculty", "Admin"
        public required string Department { get; set; } // e.g., "CS", "BCA"
        public required string Message { get; set; }

        public int Likes { get; set; } = 0;
        public bool IsCommonChat { get; set; } = true;

        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}
