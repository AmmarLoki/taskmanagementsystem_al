
using System.ComponentModel.DataAnnotations;

namespace TaskManagementSystem_AL_Backend_10Pearls.Models
{
    public class TaskStatus
    {
        [Key]
        public int TaskStatusId { get; set; }

        [Required]
        public string Status { get; set; } // e.g., "Pending", "Completed"

        public bool IsActive { get; set; } = true;

        public DateTime CreatedOn { get; set; } 
    }
}
