namespace campus_connect.Server.Model.DTO.Faculty
{
    public class FacultyUpdateDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public bool IsApproved { get; set; }

    }
}
