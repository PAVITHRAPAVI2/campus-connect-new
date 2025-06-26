namespace campus_connect.Server.Model.DTO.Faculty
{
    public class RegisterFacultyDto
    {

        public required string CollegeId { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string FullName { get; set; }
        public required string Department { get; set; }

    }
}
