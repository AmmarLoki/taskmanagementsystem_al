using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using TaskManagementSystem_AL_Backend_10Pearls.Data;
using TaskManagementSystem_AL_Backend_10Pearls.Models;
using TaskManagementSystem_AL_Backend_10Pearls.Utilities;
using Microsoft.EntityFrameworkCore;

namespace TaskManagementSystem_AL_Backend_10Pearls.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if the email is already registered.
            bool emailExists = await _context.Users.AnyAsync(u => u.Email == model.Email);
            if (emailExists)
            {
                return BadRequest("The email provided is already registered.");
            }

            // Hash the password.
            var (salt, hash) = PasswordHasher.HashPassword(model.Password);

            // Create the new user.
            var user = new User
            {
                Email = model.Email,
                Salt = salt,
                Password = hash,
                RoleId = model.RoleId, // Ensure the role provided exists in the Roles table.
                IsActive = true,
                CreatedOn = System.DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("User registered successfully.");
        }


        // Login endpoint
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find the user by email, including the related Role.
            var user = await _context.Users.Include(u => u.Role)
                                           .FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null)
            {
                return Unauthorized("Invalid credentials.");
            }

            // Verify the password using the stored salt and hash.
            bool isPasswordValid = PasswordHasher.VerifyPassword(model.Password, user.Salt, user.Password);
            if (!isPasswordValid)
            {
                return Unauthorized("Invalid credentials.");
            }

            // Prepare a response with the user's details.
            var response = new
            {
                userId = user.UserId,
                email = user.Email,
                roleId = user.RoleId,
                roleName = user.Role.RoleName,
                message = user.Role.RoleName.Equals("Admin", System.StringComparison.OrdinalIgnoreCase)
                            ? "Redirect to Dashboard"
                            : "Redirect to Task List"
            };

            // Here, you might consider setting a session or cookie if needed.
            // For now, we're simply returning the user details for the frontend to handle redirection.
            return Ok(response);
        }
    }
}
