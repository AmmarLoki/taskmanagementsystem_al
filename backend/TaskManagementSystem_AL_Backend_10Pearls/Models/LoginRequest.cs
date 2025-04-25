using System.ComponentModel.DataAnnotations;

namespace TaskManagementSystem_AL_Backend_10Pearls.Models
{
    public class LoginRequest
    {
        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
