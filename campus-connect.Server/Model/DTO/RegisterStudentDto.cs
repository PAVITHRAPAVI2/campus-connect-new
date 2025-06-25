namespace campus_connect.Server.Model.DTO
{
    public class RegisterStudentDto
    {
        public required string CollegeId { get; set; }     // Custom student code like 2025CS001
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string FullName { get; set; }
        public required string Department { get; set; }
        public required string Batch { get; set; }

    }
}
