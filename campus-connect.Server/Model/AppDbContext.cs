using campus_connect.Server.Model;
using CampusConnectAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CampusConnectAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        
        

        public DbSet<Student> Students { get; set; }
        public DbSet<Faculty> Faculties { get; set; }
        public DbSet<Admin> Admins { get; set; }

        

        public DbSet<Event> Events { get; set; }
        public DbSet<Notice> Notices { get; set; }
        public DbSet<Announcement> Announcements { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<MessageGroup> MessageGroups { get; set; }
        public DbSet<Message> Messages { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Student>().HasIndex(s => s.Email).IsUnique();
            modelBuilder.Entity<Faculty>().HasIndex(f => f.Email).IsUnique();
            modelBuilder.Entity<Admin>().HasIndex(a => a.Email).IsUnique();

            modelBuilder.Entity<Student>().HasIndex(s => s.CollegeId).IsUnique();
            modelBuilder.Entity<Faculty>().HasIndex(f => f.CollegeId).IsUnique();
            modelBuilder.Entity<Admin>().HasIndex(a => a.CollegeId).IsUnique();

            modelBuilder.Entity<Student>().HasQueryFilter(s => !s.IsDeleted);
            modelBuilder.Entity<Faculty>().HasQueryFilter(f => !f.IsDeleted);
            modelBuilder.Entity<Admin>().HasQueryFilter(a => !a.IsDeleted);
        }
    }
}
