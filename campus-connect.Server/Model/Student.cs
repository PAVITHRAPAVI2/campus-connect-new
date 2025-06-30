using campus_connect.Server.Model;
using System.ComponentModel.DataAnnotations;

namespace CampusConnectAPI.Models
{
    public class Student : AuditableEntity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public required string CollegeId { get; set; }  // Unique student ID like STU2025001

        [Required, EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string PasswordHash { get; set; }

        [Required]
        public required string FullName { get; set; }

        [Required]
        public required string Department { get; set; }

        public string? Batch { get; set; }

        public string Role { get; set; } = "student";

        public bool IsApproved { get; set; } = false;

        public string? Avatar { get; set; }

        public string? ApprovedByCollegeId { get; set; } // CollegeId of approving faculty
        public DateTime? ApprovedOn { get; set; }

    }
}
