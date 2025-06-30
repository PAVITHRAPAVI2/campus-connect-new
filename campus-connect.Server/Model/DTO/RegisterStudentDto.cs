namespace CampusConnectAPI.DTOs
{
    public class RegisterStudentDto
    {
        public required string CollegeId { get; set; }     // Custom student code like STU2025001
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string FullName { get; set; }
        public required string Department { get; set; }
        public required string Batch { get; set; }
    }
}
