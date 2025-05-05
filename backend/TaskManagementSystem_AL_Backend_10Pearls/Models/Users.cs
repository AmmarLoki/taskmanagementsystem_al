using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManagementSystem_AL_Backend_10Pearls.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Salt { get; set; }

        [ForeignKey("Role")]
        public int RoleId { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedOn { get; set; } 

        public Role Role { get; set; }
    }
}
