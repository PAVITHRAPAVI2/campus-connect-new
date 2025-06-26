using System;
using System.ComponentModel.DataAnnotations;




namespace campus_connect.Server.Model
{

    public class Notice
    {
        public int Id { get; set; }

        [Required]
        public required string Title { get; set; }

        public required string Category { get; set; }

        public required string Priority { get; set; }

        public required string Department { get; set; }

        public required string Author { get; set; }

        public required string Content { get; set; }

        public DateTime Date { get; set; } = DateTime.Now;

        public int Views { get; set; } = 0;

        public int Comments { get; set; } = 0;

        public bool Pin { get; set; } = false;
    }
}

