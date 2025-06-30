namespace campus_connect.Server.Model.DTO.Events
{
    public class EventResponseDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string PosterUrl { get; set; } = string.Empty;

        public DateTime EventDate { get; set; }

        public string CreatedBy { get; set; } = string.Empty;

        public string? Department { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public bool IsDeleted { get; set; }
    }
}