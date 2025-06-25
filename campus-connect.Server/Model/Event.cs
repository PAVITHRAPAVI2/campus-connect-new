namespace campus_connect.Server.Model
{
    public class Event
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string PosterUrl { get; set; }
        public DateTime EventDate { get; set; }

        // Metadata
        public required string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
    }

}
