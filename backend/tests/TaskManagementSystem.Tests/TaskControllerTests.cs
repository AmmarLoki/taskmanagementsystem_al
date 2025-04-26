using Xunit;
using Microsoft.EntityFrameworkCore;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;
using ILogger = Microsoft.Extensions.Logging.ILogger;
using HubContext = Microsoft.AspNetCore.SignalR.IHubContext<TaskManagementSystem_AL_Backend_10Pearls.Utilities.TaskHub>;
using Microsoft.Extensions.Logging;
using TaskManagementSystem_AL_Backend_10Pearls.Controllers;
using TaskManagementSystem_AL_Backend_10Pearls.Data;
using TaskManagementSystem_AL_Backend_10Pearls.Models;
using System;
using Microsoft.AspNetCore.SignalR;
using TaskManagementSystem_AL_Backend_10Pearls.Utilities;

namespace TaskManagementSystem.Tests
{
    public class TaskControllerTests
    {
        private ApplicationDbContext CreateInMemoryDb()
        {
            var opts = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // use in-memory provider :contentReference[oaicite:8]{index=8}
                .Options;
            var db = new ApplicationDbContext(opts);
            // seed minimal data
            db.Roles.Add(new Role { RoleId = 1, RoleName = "Admin" });
            db.Roles.Add(new Role { RoleId = 2, RoleName = "User" });
            db.Users.Add(new User { UserId = 10, Email = "user@x.com", Password = "p", Salt = "s", RoleId = 2 });
            db.Users.Add(new User { UserId = 20, Email = "admin@x.com", Password = "p", Salt = "s", RoleId = 1 });
            db.TaskStatuses.Add(new TaskStatus { TaskStatusId = 1, Status = "Pending" });
            db.Tasks.Add(new Task { TaskId = 100, TaskName = "UserTask", TaskStatusId = 1, CreatedById = 10 , Category = "Gen",Priority = "High"});
            db.Tasks.Add(new Task { TaskId = 200, TaskName = "AdminTask", TaskStatusId = 1, CreatedById = 20 , Category = "Gen", Priority = "High"});
            db.SaveChanges();
            return db;
        }

        [Fact]
        public async void GetTasks_AsRegularUser_ReturnsOnlyTheirTasks()
        {
            // Arrange
            var db = CreateInMemoryDb();
            var logger = new Mock<ILogger<TaskController>>().Object;    // Moq ILogger :contentReference[oaicite:9]{index=9}
            var hub = new Mock<HubContext>().Object;                 // Moq IHubContext :contentReference[oaicite:10]{index=10}
            var ctrl = new TaskController(db, logger, hub);
            // simulate user id=10, role=User
            var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, "10"),
                new Claim(ClaimTypes.Role, "User")
            }, "TestAuth"));                                       // ClaimsPrincipal injection :contentReference[oaicite:11]{index=11}
            ctrl.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            // Act
            var result = await ctrl.GetTasks(search: null, statusId: null);

            // Assert
            var okObject = Assert.IsType<OkObjectResult>(result.Result);
            var tasks = Assert.IsAssignableFrom<IEnumerable<Task>>(okObject.Value);
            Assert.Single(tasks);
            Assert.Equal(100, tasks.First().TaskId);

            
        }

        [Fact]
        public async void GetTasks_AsAdminUser_ReturnsAllTasks()
        {
            // Arrange (similar setup)
            var db = CreateInMemoryDb();
            var ctrl = new TaskController(db,
                new Mock<ILogger<TaskController>>().Object,
                new Mock<HubContext>().Object);
            var admin = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, "20"),
                new Claim(ClaimTypes.Role, "Admin")
            }, "TestAuth"));
            ctrl.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = admin }
            };

            // Act
            var result = await ctrl.GetTasks(null, null);

            // Assert
            var okObject = Assert.IsType<OkObjectResult>(result.Result);
            var tasks = Assert.IsAssignableFrom<IEnumerable<Task>>(okObject.Value);
            Assert.Equal(2, tasks.Count());
        }

        [Fact]
        public async void CreateTask_ValidModel_ReturnsCreatedAtAction()
        {
            // Arrange
            var db = CreateInMemoryDb();
            var mockLogger = new Mock<ILogger<TaskController>>().Object;

            // set up a dummy IHubContext<TaskHub> that won't be null
            var mockClientProxy = new Mock<IClientProxy>();
            var mockClients = new Mock<IHubClients>();
            mockClients.Setup(c => c.All).Returns(mockClientProxy.Object);
            var mockHubContext = new Mock<IHubContext<TaskHub>>();
            mockHubContext.Setup(h => h.Clients).Returns(mockClients.Object);

            // now create your controller
            var ctrl = new TaskController(db, mockLogger, mockHubContext.Object);

            // Simulate a user (userId 10, role "User")
            var user = new ClaimsPrincipal(new ClaimsIdentity(new[] {
            new Claim(ClaimTypes.NameIdentifier, "10"), // Ensure this user exists
            new Claim(ClaimTypes.Role, "User")
            }, "TestAuth"));

            ctrl.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            var request = new TaskRequest
            {
                TaskName = "NewTask", // Required field
                TaskStatusId = 1,     // Should match a valid TaskStatusId in the seeded data
                AssignedToId = 10,    // Should match a valid userId in the seeded data
                Priority = "High",
                Category = "Gen",
                TaskCompletionDate = DateTime.UtcNow
            };

            // Act
            var result = await ctrl.CreateTask(request);

            // Assert
            var created = Assert.IsType<CreatedAtActionResult>(result.Result);
            var createdTask = Assert.IsType<Task>(created.Value);
            Assert.Equal("NewTask", createdTask.TaskName);
            Assert.Equal(1, createdTask.TaskStatusId); // Ensure TaskStatusId is correct
            Assert.Equal(10, createdTask.AssignedToId); // Ensure AssignedToId is correct
        }


        [Fact]
        public async void UpdateTask_InvalidId_ReturnsNotFound()
        {
            // Arrange
            var db = CreateInMemoryDb();
            var ctrl = new TaskController(db,
                new Mock<ILogger<TaskController>>().Object,
                new Mock<HubContext>().Object);

            // Act
            var result = await ctrl.UpdateTask(999, new TaskRequest
            {
                TaskName = "X",
                TaskStatusId = 1,
                AssignedToId = 10
            });

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async void DeleteTask_InvalidId_ReturnsNotFound()
        {
            // Arrange
            var db = CreateInMemoryDb();
            var ctrl = new TaskController(db,
                new Mock<ILogger<TaskController>>().Object,
                new Mock<HubContext>().Object);

            // Act
            var result = await ctrl.DeleteTask(999);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
    }
}
