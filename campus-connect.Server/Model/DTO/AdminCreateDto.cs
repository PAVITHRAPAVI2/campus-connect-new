// File: DTOs/AdminCreateDto.cs
namespace CampusConnectAPI.DTOs
{
    public class AdminCreateDto
    {
        public required string CollegeId { get; set; }     // e.g., ADM2025001
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string FullName { get; set; }
    }
}
