namespace campus_connect.Server.Model.DTO
{
    namespace CampusConnectAPI.DTOs
    {
        public class LoginResponseDto
        {
            public string Message { get; set; } = "Login successful";
            public string Token { get; set; } = string.Empty;
            public string Role { get; set; } = string.Empty;
            public string UserId { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public DateTime Expiration { get; set; }
        }
    }

}
