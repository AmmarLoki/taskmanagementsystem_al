
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        [ForeignKey("CreatedBy")]
        public int CreatedById { get; set; }

        // New field: to assign the task to a user (can be null if unassigned)
        [ForeignKey("AssignedTo")]
        public int? AssignedToId { get; set; }

        // Navigation property for the assigned user
        public User AssignedTo { get; set; }

        // New fields: Priority and Category
        public string Priority { get; set; }   // e.g., "Low", "Medium", "High"
        public string Category { get; set; }   // e.g., "Bug", "Feature", etc.

        public bool IsActive { get; set; } = true;
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
        public DateTime? TaskCompletionDate { get; set; }

        public TaskStatus TaskStatus { get; set; }
        public User CreatedBy { get; set; }
    }
}
