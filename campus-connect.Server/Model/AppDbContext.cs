using Microsoft.EntityFrameworkCore;
using CampusConnectAPI.Models;
using campus_connect.Server.Model;

namespace CampusConnectAPI.Data  // ✅ Use consistent namespace like in Startup
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // ✅ DbSets for all user types
        public DbSet<Student> Students { get; set; }
        public DbSet<Faculty> Faculties { get; set; }
        public DbSet<Admin> Admins { get; set; }
        

        public DbSet<Event> Events { get; set; }
        public DbSet<Announcement> Announcements { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }




        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ✅ Unique Email constraints
            modelBuilder.Entity<Student>()
                .HasIndex(s => s.Email)
                .IsUnique();

            modelBuilder.Entity<Faculty>()
                .HasIndex(f => f.Email)
                .IsUnique();

            modelBuilder.Entity<Admin>()
                .HasIndex(a => a.Email)
                .IsUnique();

            // ✅ Unique CollegeId constraints
            modelBuilder.Entity<Student>()
                .HasIndex(s => s.CollegeId)
                .IsUnique();

            modelBuilder.Entity<Faculty>()
                .HasIndex(f => f.CollegeId)
                .IsUnique();

            modelBuilder.Entity<Admin>()
                .HasIndex(a => a.CollegeId)
                .IsUnique();

            // ✅ Soft delete global filters
            modelBuilder.Entity<Student>().HasQueryFilter(s => !s.IsDeleted);
            modelBuilder.Entity<Faculty>().HasQueryFilter(f => !f.IsDeleted);
            modelBuilder.Entity<Admin>().HasQueryFilter(a => !a.IsDeleted);
        }
        public DbSet<campus_connect.Server.Model.Event> Event { get; set; } = default!;
        public DbSet<campus_connect.Server.Model.Announcement> Announcement { get; set; } = default!;
    }
}
