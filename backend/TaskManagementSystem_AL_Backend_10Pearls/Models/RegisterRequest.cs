using System.ComponentModel.DataAnnotations;

namespace TaskManagementSystem_AL_Backend_10Pearls.Models
{
    public class RegisterRequest
    {
        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        // You can pass the role from the registration form.
        // Alternatively, if you want to enforce a default role, you could omit this and hardcode the RoleId.
        [Required]
        public int RoleId { get; set; }
    }
}
