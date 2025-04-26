using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using TaskManagementSystem_AL_Backend_10Pearls.Controllers;
using TaskManagementSystem_AL_Backend_10Pearls.Data;
using TaskManagementSystem_AL_Backend_10Pearls.Models;
using TaskManagementSystem_AL_Backend_10Pearls.Utilities;
using System.Reflection;

namespace TaskManagementSystem.Tests
{
    public class AuthControllerTests
    {
        private ApplicationDbContext CreateInMemoryDb()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            var context = new ApplicationDbContext(options);
            // Seed roles
            context.Roles.Add(new Role { RoleId = 1, RoleName = "Admin" });
            context.Roles.Add(new Role { RoleId = 2, RoleName = "User" });
            context.SaveChanges();
            return context;
        }

        private IConfiguration CreateConfiguration()
        {
            var inMemorySettings = new Dictionary<string, string> {
                {"JwtSettings:SecretKey", "ThisIsAVerySecureAndLongSecretKeyThatIsAtLeastSixtyFourCharacters!"},
                {"JwtSettings:Issuer", "TestIssuer"},
                {"JwtSettings:Audience", "TestAudience"}
            };
            return new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();
        }

        [Fact]
        public async void Register_ValidRequest_ReturnsOk()
        {
            // Arrange
            var db = CreateInMemoryDb();
            var config = CreateConfiguration();
            var logger = new Mock<ILogger<AuthController>>().Object;
            var controller = new AuthController(db, config, logger);
            var request = new RegisterRequest
            {
                Email = "test@x.com",
                Password = "Password123!",
                RoleId = 2
            };

            // Act
            var result = await controller.Register(request);

            // Assert
            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("User registered successfully.", ok.Value);
            // Verify user is in database
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            Assert.NotNull(user);
            Assert.Equal(2, user.RoleId);
            Assert.True(user.IsActive);
        }

        [Fact]
        public async void Register_InvalidRole_ReturnsBadRequest()
        {
            // Arrange
            var db = CreateInMemoryDb();
            var config = CreateConfiguration();
            var logger = new Mock<ILogger<AuthController>>().Object;
            var controller = new AuthController(db, config, logger);
            var request = new RegisterRequest
            {
                Email = "test@x.com",
                Password = "Password123!",
                RoleId = 1 // Admin not allowed
            };

            // Act
            var result = await controller.Register(request);

            // Assert
            var bad = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid role selected.", bad.Value);
        }

        [Fact]
        public async void Login_ValidCredentials_ReturnsOkWithToken()
        {
            // Arrange
            var db = CreateInMemoryDb();
            var config = CreateConfiguration();
            var logger = new Mock<ILogger<AuthController>>().Object;
            // Seed a user
            var (salt, hash) = PasswordHasher.HashPassword("Password123!");
            var user = new User
            {
                Email = "user@x.com",
                Salt = salt,
                Password = hash,
                RoleId = 2,
                IsActive = true,
                CreatedOn = DateTime.UtcNow
            };
            db.Users.Add(user);
            db.SaveChanges();

            var controller = new AuthController(db, config, logger);
            var loginReq = new LoginRequest
            {
                Email = "user@x.com",
                Password = "Password123!"
            };

            // Act
            var result = await controller.Login(loginReq);

            // Assert
            var ok = Assert.IsType<OkObjectResult>(result);
            var payload = ok.Value;

            // Login test
            Assert.Equal("user@x.com", GetProp<string>(payload, "email"));
            Assert.Equal(2, GetProp<int>(payload, "roleId"));
            Assert.False(string.IsNullOrWhiteSpace(
                              GetProp<string>(payload, "token")));
        }

        [Fact]
        public async void Login_InvalidCredentials_ReturnsUnauthorized()
        {
            // Arrange
            var db = CreateInMemoryDb();
            var config = CreateConfiguration();
            var logger = new Mock<ILogger<AuthController>>().Object;
            var controller = new AuthController(db, config, logger);
            var loginReq = new LoginRequest
            {
                Email = "nonexistent@x.com",
                Password = "WrongPassword"
            };

            // Act
            var result = await controller.Login(loginReq);

            // Assert
            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        [Fact]
        public async void GetCurrentUser_Authorized_ReturnsUserInfo()
        {
            // Arrange
            var db = CreateInMemoryDb();
            // Seed user
            var user = new User { UserId = 5, Email = "me@x.com", RoleId = 2, Salt = "s", Password = "h", CreatedOn = DateTime.UtcNow };
            db.Users.Add(user);
            await db.SaveChangesAsync();

            var config = CreateConfiguration();
            var logger = new Mock<ILogger<AuthController>>().Object;
            var controller = new AuthController(db, config, logger);

            // Simulate authenticated user
            var claims = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, "5") }, "TestAuth"));
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claims }
            };

            // Act
            var result = await controller.GetCurrentUser();

            // Assert
            var ok = Assert.IsType<OkObjectResult>(result);
            var payload = ok.Value; 
            Assert.Equal("me@x.com", GetProp<string>(payload, "Email"));
            Assert.Equal("User", GetProp<string>(payload, "Role"));
        }

        [Fact]
        public void Logout_ReturnsOk()
        {
            // Arrange
            var db = CreateInMemoryDb();
            var config = CreateConfiguration();
            var logger = new Mock<ILogger<AuthController>>().Object;
            var controller = new AuthController(db, config, logger);
            var claims = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, "5") }, "TestAuth"));
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claims }
            };

            // Act
            var result = controller.Logout();

            // Assert
            var ok = Assert.IsType<OkObjectResult>(result);      
            var payload = ok.Value;
            Assert.Equal("Logout successful.",
             GetProp<string>(payload, "message"));
        }


        private T GetProp<T>(object obj, string name)
        {
            var prop = obj.GetType()
                          .GetProperty(name,
                               BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
            Assert.NotNull(prop);      // catches typos
            return (T)prop.GetValue(obj);
        }

    }




}
