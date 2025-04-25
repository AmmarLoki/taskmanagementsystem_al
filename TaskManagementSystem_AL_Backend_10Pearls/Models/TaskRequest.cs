using System;
using System.ComponentModel.DataAnnotations;

namespace TaskManagementSystem_AL_Backend_10Pearls.Models
{
    public class TaskRequest
    {
        [Required]
        public string TaskName { get; set; }

        [Required]
        public int TaskStatusId { get; set; }

        [Required]
        public int CreatedById { get; set; }

        // Optional, for task assignment.
        public int? AssignedToId { get; set; }

        // Optional, priority information.
        public string Priority { get; set; }

        // Optional, category information.
        public string Category { get; set; }

        // Optional: you already have TaskCompletionDate field in model.
        public DateTime? TaskCompletionDate { get; set; }
    }
}
