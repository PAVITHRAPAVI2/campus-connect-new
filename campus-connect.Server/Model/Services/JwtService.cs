using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CampusConnectAPI.Services
{
    public class JwtService
    {
        private readonly IConfiguration _config;

        public JwtService(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken(string collegeId, string email, string role)
        {
            var jwtKey = _config["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new ArgumentNullException(nameof(jwtKey), "Jwt:Key configuration value cannot be null or empty.");
            }

            var claims = new[]
            {
                    new Claim(ClaimTypes.NameIdentifier, collegeId),
                    new Claim(ClaimTypes.Email, email),
                    new Claim(ClaimTypes.Role, role)
                };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
