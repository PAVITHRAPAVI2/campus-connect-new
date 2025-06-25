namespace campus_connect.Server.Model
{
    public class Announcement
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string PostedBy { get; set; }
        public DateTime PostedOn { get; set; }

        // Optional: image or file attachment
        public required string AttachmentUrl { get; set; }
    }


}
