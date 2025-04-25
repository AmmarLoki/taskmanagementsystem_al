using System;
using System.ComponentModel.DataAnnotations;

namespace TaskManagementSystem_AL_Backend_10Pearls.Models
{
    public class Role
    {
        [Key]
        public int RoleId { get; set; }

        [Required]
        public string RoleName { get; set; } // e.g., "Admin", "User"

        public bool IsActive { get; set; } = true;

        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    }
}
