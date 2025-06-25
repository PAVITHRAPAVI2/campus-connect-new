using campus_connect.Server.Model;
using System.ComponentModel.DataAnnotations;

namespace CampusConnectAPI.Models
{
    public class Admin : AuditableEntity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public required string CollegeId { get; set; }  // e.g., ADM2025001

        [Required, EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string PasswordHash { get; set; }

        [Required]
        public required string FullName { get; set; }

        public string Role { get; set; } = "admin";

        public bool IsApproved { get; set; } = false ;
    }
}
