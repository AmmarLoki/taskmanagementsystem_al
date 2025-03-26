using Microsoft.EntityFrameworkCore;
using TaskManagementSystem_AL_Backend_10Pearls.Models;

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

            //// Seed initial roles
            //modelBuilder.Entity<Role>().HasData(
            //    new Role { RoleId = 1, RoleName = "Admin", IsActive = true },
            //    new Role { RoleId = 2, RoleName = "User", IsActive = true }
            //);

            //// Seed task statuses
            //modelBuilder.Entity<Models.TaskStatus>().HasData(
            //    new Models.TaskStatus { TaskStatusId = 1, Status = "Pending", IsActive = true },
            //    new Models.TaskStatus { TaskStatusId = 2, Status = "Completed", IsActive = true }
            //);
        }
    }
}
