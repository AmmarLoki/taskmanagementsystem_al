using Microsoft.EntityFrameworkCore;
using TaskManagementSystem_AL_Backend_10Pearls.Models;
using TaskManagementSystem_AL_Backend_10Pearls.Utilities;

namespace TaskManagementSystem_AL_Backend_10Pearls.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Models.Task> Tasks { get; set; }
        public DbSet<Models.TaskStatus> TaskStatuses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //modelBuilder.Entity<User>()
            //.Property(u => u.CreatedOn)
            //.HasDefaultValueSql("GETUTCDATE()");


            // Seed initial roles
            //modelBuilder.Entity<Role>().HasData(
            //    new Role { RoleId = 1, RoleName = "Admin", IsActive = true },
            //    new Role { RoleId = 2, RoleName = "User", IsActive = true }
            //);

            // Seed admin user with hashed password
            //var password = "admin"; // Example password for the admin user
            //var (salt, hash) = PasswordHasher.HashPassword(password);

            //// Seed admin user with hardcoded password hash and salt
            //modelBuilder.Entity<User>().HasData(
            //    new User
            //    {
            //        UserId = 1,
            //        Email = "admin@example.com",
            //        Password = "1pg2JnaWFax14kSpsJeUyJHFU8Sf33HEurPKzokeN7M=", // Precomputed hash of 'admin' password
            //        Salt = "B3WGC5bGcxD6f/pPslbXbQ==",     // Precomputed salt
            //        RoleId = 1, // Admin role
            //        IsActive = true,
            //        CreatedOn = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) // Hardcoded
            //    }
            //);

            //// Seed task statuses
            //modelBuilder.Entity<Models.TaskStatus>().HasData(
            //    new Models.TaskStatus { TaskStatusId = 1, Status = "Pending", IsActive = true , CreatedOn = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            //    new Models.TaskStatus { TaskStatusId = 2, Status = "Completed", IsActive = true , CreatedOn = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
            //    new Models.TaskStatus { TaskStatusId = 3, Status = "InProgress", IsActive = true , CreatedOn = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)},

            //);
        }

    }
}
