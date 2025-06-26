namespace campus_connect.Server.Model.DTO.Message
{
    public class CreateMessageDto
    {
        public required string Content { get; set; }
        public required Guid GroupId { get; set; }
    }
}
