using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Threading.Tasks;

namespace TaskManagementSystem_AL_Backend_10Pearls.Models
{ 
    public class Task
    {
        [Key]
        public int TaskId { get; set; }

        [Required]
        public string TaskName { get; set; }

        [ForeignKey("TaskStatus")]
        public int TaskStatusId { get; set; }

        [ForeignKey("User")]
        public int CreatedById { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        public DateTime? TaskCompletionDate { get; set; }

        public TaskStatus TaskStatus { get; set; }
        public User CreatedBy { get; set; }
    }
}
