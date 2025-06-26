namespace campus_connect.Server.Model.DTO.Message
{
    public class CreateGroupDto
    {
        public string Name { get; set; } = string.Empty;
        public bool IsCommon { get; set; }
        public string? Department { get; set; } // Only for department-specific groups
    }
}
