namespace CampusConnectAPI.DTOs
{
    public class LoginDto
    {
        public required string CollegeId { get; set; }   // Accepts: STU2025001 / FAC2025001 / ADM2025001
        public required string Password { get; set; }
    }
}
