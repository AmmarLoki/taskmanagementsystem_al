using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using TaskManagementSystem_AL_Backend_10Pearls.Data;
using TaskManagementSystem_AL_Backend_10Pearls.Models;
using TaskManagementSystem_AL_Backend_10Pearls.Utilities;

namespace TaskManagementSystem_AL_Backend_10Pearls.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TaskController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<TaskController> _logger;
        private readonly IHubContext<TaskHub> _hubContext;


        public TaskController(ApplicationDbContext context, ILogger<TaskController> logger, IHubContext<TaskHub> hubContext)
        {
            _context = context;
            _logger = logger;
            _hubContext = hubContext;
        }

        //// GET: api/task
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<Models.Task>>> GetTasks()
        //{
        //    // Retrieve the current user's ID from the claims
        //    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        //    if (userIdClaim == null)
        //    {
        //        _logger.LogWarning("GetTasks: Unauthorized access attempt.");
        //        return Unauthorized();
        //    }
        //    var userId = int.Parse(userIdClaim.Value);
        //    _logger.LogInformation("GetTasks: Fetching tasks for UserId {UserId}", userId);

        //    // Fetch tasks where the user is either the creator or the assignee
        //    var tasks = await _context.Tasks
        //        .Include(t => t.TaskStatus)
        //        .Include(t => t.CreatedBy)
        //        .Include(t => t.AssignedTo)
        //        .Where(t => t.CreatedById == userId || t.AssignedToId == userId)
        //        .ToListAsync();

        //    _logger.LogInformation("GetTasks: Retrieved {TaskCount} tasks for UserId {UserId}", tasks.Count, userId);
        //    return Ok(tasks);
        //}

        // GET: api/task?search=foo&statusId=1
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Models.Task>>> GetTasks(
            [FromQuery] string search = null,
            [FromQuery] int? statusId = null)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var query = _context.Tasks
                .Include(t => t.TaskStatus)
                .Include(t => t.AssignedTo)
                .Include(t => t.CreatedBy)
                .Where(t => t.CreatedById == userId || t.AssignedToId == userId)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(t => t.TaskName.Contains(search));

            if (statusId.HasValue)
                query = query.Where(t => t.TaskStatusId == statusId.Value);

            var tasks = await query.ToListAsync();
            return Ok(tasks);
        }


        // GET: api/task/export
        [HttpGet("export")]
        public async Task<IActionResult> ExportTasks(
            [FromQuery] string search = null,
            [FromQuery] int? statusId = null)
        {
            // reuse filtering logic
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var query = _context.Tasks
                .Include(t => t.TaskStatus)
                .Include(t => t.AssignedTo)
                .Include(t => t.CreatedBy)
                .Where(t => t.CreatedById == userId || t.AssignedToId == userId)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(t => t.TaskName.Contains(search));
            if (statusId.HasValue)
                query = query.Where(t => t.TaskStatusId == statusId.Value);

            var tasks = await query.ToListAsync();

            var csv = new StringBuilder();
            csv.AppendLine("TaskId,TaskName,Status,AssignedTo,Priority,Category,CreatedOn");
            foreach (var t in tasks)
            {
                var assigned = t.AssignedTo?.Email ?? "";
                csv.AppendLine($"{t.TaskId},\"{t.TaskName}\",{t.TaskStatus.Status},\"{assigned}\",{t.Priority},{t.Category},{t.CreatedOn:O}");
            }

            var bytes = Encoding.UTF8.GetBytes(csv.ToString());
            return File(bytes, "text/csv", "tasks.csv");
        }

        // POST: api/task/import
        [HttpPost("import")]
        public async Task<IActionResult> ImportTasks(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            using var reader = new StreamReader(file.OpenReadStream());
            string line;
            var imported = new List<Models.Task>();
            // skip header
            await reader.ReadLineAsync();
            while ((line = await reader.ReadLineAsync()) != null)
            {
                var parts = line.Split(',');
                if (parts.Length < 7) continue;
                var task = new Models.Task
                {
                    TaskName = parts[1].Trim('"'),
                    TaskStatusId = await _context.TaskStatuses
                        .Where(s => s.Status == parts[2]).Select(s => s.TaskStatusId)
                        .FirstOrDefaultAsync(),
                    AssignedToId = null, // skip assignment on import
                    Priority = parts[4],
                    Category = parts[5],
                    CreatedById = userId,
                    CreatedOn = System.DateTime.UtcNow
                };
                _context.Tasks.Add(task);
                imported.Add(task);
            }
            await _context.SaveChangesAsync();
            await _hubContext.Clients.All.SendAsync("TasksImported", imported.Count);
            return Ok(new { ImportedCount = imported.Count });
        }


        // GET: api/task/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Models.Task>> GetTask(int id)
        {
            _logger.LogInformation("GetTask: Fetching task with TaskId {TaskId}", id);

            var task = await _context.Tasks
                .Include(t => t.TaskStatus)
                .Include(t => t.CreatedBy)
                .Include(t => t.AssignedTo)
                .FirstOrDefaultAsync(t => t.TaskId == id);
            if (task == null)
            {
                _logger.LogWarning("GetTask: Task with TaskId {TaskId} not found.", id);
                return NotFound();
            }

            _logger.LogInformation("GetTask: Retrieved task with TaskId {TaskId}", id);
            return Ok(task);
        }

        // POST: api/task
        [HttpPost]
        public async Task<ActionResult<Models.Task>> CreateTask([FromBody] TaskRequest model)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("CreateTask: Invalid model state.");
                return BadRequest(ModelState);
            }

            // Extract user ID from JWT token claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                _logger.LogWarning("CreateTask: Unauthorized access attempt.");
                return Unauthorized("User ID not found in token.");
            }

            int userId = int.Parse(userIdClaim.Value);
            _logger.LogInformation("CreateTask: Creating task for UserId {UserId}", userId);

            var task = new Models.Task
            {
                TaskName = model.TaskName,
                TaskStatusId = model.TaskStatusId,
                CreatedById = userId,
                AssignedToId = model.AssignedToId,
                Priority = model.Priority,
                Category = model.Category,
                TaskCompletionDate = model.TaskCompletionDate,
                IsActive = true,
                CreatedOn = System.DateTime.UtcNow
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            _logger.LogInformation("CreateTask: Task created with TaskId {TaskId} by UserId {UserId}", task.TaskId, userId);
            await _hubContext.Clients.All.SendAsync("TaskCreated", task);
            return CreatedAtAction(nameof(GetTask), new { id = task.TaskId }, task);
        }

        // PUT: api/task/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskRequest model)
        {
            _logger.LogInformation("UpdateTask: Updating task with TaskId {TaskId}", id);

            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                _logger.LogWarning("UpdateTask: Task with TaskId {TaskId} not found.", id);
                return NotFound();
            }

            // Update properties
            task.TaskName = model.TaskName;
            task.TaskStatusId = model.TaskStatusId;
            task.CreatedById = model.CreatedById;
            task.AssignedToId = model.AssignedToId;
            task.Priority = model.Priority;
            task.Category = model.Category;
            task.TaskCompletionDate = model.TaskCompletionDate;

            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();

            _logger.LogInformation("UpdateTask: Task with TaskId {TaskId} updated successfully.", id);
            await _hubContext.Clients.All.SendAsync("TaskUpdated", task);
            return NoContent();
        }

        // DELETE: api/task/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            _logger.LogInformation("DeleteTask: Deleting task with TaskId {TaskId}", id);

            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                _logger.LogWarning("DeleteTask: Task with TaskId {TaskId} not found.", id);
                return NotFound();
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            _logger.LogInformation("DeleteTask: Task with TaskId {TaskId} deleted successfully.", id);
            await _hubContext.Clients.All.SendAsync("TaskDeleted", id);
            return NoContent();
        }

        // GET: api/taskstatus
        [HttpGet("taskstatuses")]
        public async Task<ActionResult<IEnumerable<Models.TaskStatus>>> GetTaskStatuses()
        {
            _logger.LogInformation("GetTaskStatuses: Fetching all task statuses.");

            var taskStatuses = await _context.TaskStatuses.ToListAsync();

            _logger.LogInformation("GetTaskStatuses: Retrieved {Count} task statuses.", taskStatuses.Count);
            return Ok(taskStatuses);
        }

        // GET: api/users
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            _logger.LogInformation("GetUsers: Fetching all users.");

            var users = await _context.Users.ToListAsync();

            _logger.LogInformation("GetUsers: Retrieved {Count} users.", users.Count);
            return Ok(users);
        }


        //[HttpGet("taskcounts")]
        //public async Task<ActionResult<TaskStatusCountsDto>> GetTaskCounts()
        //{
        //    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        //    if (userIdClaim == null)
        //        return Unauthorized("User ID not found in token.");

        //    int userId = int.Parse(userIdClaim.Value);
        //    var userRoles = User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();
        //    bool isAdmin = userRoles.Contains("admin");

        //    var tasksQuery = _context.Tasks.AsQueryable();

        //    if (!isAdmin)
        //    {
        //        tasksQuery = tasksQuery.Where(t => t.AssignedToId == userId);
        //    }

        //    var taskCounts = await tasksQuery
        //        .Join(_context.TaskStatuses,
        //              task => task.TaskStatusId,
        //              status => status.TaskStatusId,
        //              (task, status) => new { task, status })
        //        .GroupBy(ts => ts.status.Status)
        //        .Select(g => new { Status = g.Key, Count = g.Count() })
        //        .ToListAsync();

        //    var result = new TaskStatusCountsDto
        //    {
        //        CompletedCount = taskCounts.FirstOrDefault(tc => tc.Status == "Completed")?.Count ?? 0,
        //        InProgressCount = taskCounts.FirstOrDefault(tc => tc.Status == "InProgress")?.Count ?? 0,
        //        PendingCount = taskCounts.FirstOrDefault(tc => tc.Status == "Pending")?.Count ?? 0
        //    };

        //    return Ok(result);
        //}

        [HttpGet("overall-taskcounts")]
        public async Task<ActionResult<TaskStatusCountsDto>> GetOverallTaskCounts()
        {
            _logger.LogInformation("GetOverallTaskCounts: Calculating overall task counts.");

            var taskCounts = await _context.Tasks
                .GroupBy(t => t.TaskStatus.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync();

            var result = new TaskStatusCountsDto
            {

                CompletedCount = taskCounts.FirstOrDefault(tc => tc.Status == "Completed")?.Count ?? 0,
                InProgressCount = taskCounts.FirstOrDefault(tc => tc.Status == "InProgress")?.Count ?? 0,
                PendingCount = taskCounts.FirstOrDefault(tc => tc.Status == "Pending")?.Count ?? 0
            };

            _logger.LogInformation("Task counts fetched successfully: {@Result}", result);

            return Ok(result);
        }

        [HttpGet("user-taskcounts")]
        public async Task<ActionResult<IEnumerable<UserTaskCountsDto>>> GetUserTaskCounts()
        {
            _logger.LogInformation("Fetching task counts for all users grouped by status.");

            var userTaskCounts = await _context.Tasks
                .GroupBy(t => new { t.AssignedToId, t.TaskStatus.Status })
                .Select(g => new
                {
                    UserId = g.Key.AssignedToId,
                    Status = g.Key.Status,
                    Count = g.Count()
                })
                .ToListAsync();

            _logger.LogInformation("Raw grouped task data retrieved. Total records: {RecordCount}", userTaskCounts.Count);

            var userTaskCountsDto = userTaskCounts
                .GroupBy(utc => utc.UserId)
                .Select(g => new UserTaskCountsDto
                {
                    UserId = g.Key,
                    CompletedCount = g.FirstOrDefault(tc => tc.Status == "Completed")?.Count ?? 0,
                    InProgressCount = g.FirstOrDefault(tc => tc.Status == "InProgress")?.Count ?? 0,
                    PendingCount = g.FirstOrDefault(tc => tc.Status == "Pending")?.Count ?? 0
                })
                .ToList();

            _logger.LogInformation("Transformed grouped task data into DTOs. Total users: {UserCount}", userTaskCountsDto.Count);


            return Ok(userTaskCountsDto);
        }




    }


}
