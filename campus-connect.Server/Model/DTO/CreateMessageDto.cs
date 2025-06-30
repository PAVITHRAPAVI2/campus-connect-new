namespace campus_connect.Server.Model.DTO.Message
{
    public class CreateMessageDto
    {
        public Guid GroupId { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}
