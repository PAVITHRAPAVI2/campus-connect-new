namespace campus_connect.Server.Model
{
    public abstract class AuditableEntity
    {
        public DateTime CreatedAt { get; set; } = GetIndianTime();
        public DateTime UpdatedAt { get; set; } = GetIndianTime();

        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }

        public bool IsDeleted { get; set; } = false;

        public static DateTime GetIndianTime()
        {
            string timeZoneId = OperatingSystem.IsWindows() ? "India Standard Time" : "Asia/Kolkata";
            TimeZoneInfo indianZone = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, indianZone);
        }
    }

}