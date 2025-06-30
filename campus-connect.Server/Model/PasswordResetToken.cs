using System.ComponentModel.DataAnnotations;

namespace campus_connect.Server.Model
{
    public class PasswordResetToken
    {
        public int Id { get; set; }
        public required string Email { get; set; }
        public required string Otp { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime ExpiresAt { get; set; }
        public bool IsUsed { get; set; } = false;
    }

}
