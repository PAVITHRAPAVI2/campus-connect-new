namespace campus_connect.Server.Model.DTO.Message
{
    public class MessageGroupDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsCommon { get; set; }
        public string? Department { get; set; }
    }
}
