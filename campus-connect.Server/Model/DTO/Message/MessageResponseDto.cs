namespace campus_connect.Server.Model.DTO.Message
{
    public class MessageResponseDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public string SenderCollegeId { get; set; } = string.Empty;
        public string SenderRole { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
    }
}
