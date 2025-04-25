using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
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
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(ApplicationDbContext context, IConfiguration configuration, ILogger<AuthController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {

            _logger.LogInformation("Registration attempt for email: {Email}", request.Email);

            // Ensure the user is always registering as a User (RoleId = 2)
            if (request.RoleId != 2)
            {
                _logger.LogWarning("Invalid role ID {RoleId} provided during registration for email: {Email}", request.RoleId, request.Email);
                return BadRequest("Invalid role selected.");
            }

            // Proceed with the registration (hash password, save to DB, etc.)
            var (salt, hash) = PasswordHasher.HashPassword(request.Password);
            var user = new User
            {
                Email = request.Email,
                Password = hash,
                Salt = salt,
                RoleId = 2, // Hardcoded for User role
                IsActive = true,
                CreatedOn = DateTime.UtcNow
            };

            try
            {
                // Add the user to the database
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                _logger.LogInformation("User registered successfully with email: {Email}", request.Email);
                return Ok("User registered successfully.");
            }
            catch (Exception ex) {
                _logger.LogError(ex, "Error occurred while registering user with email: {Email}", request.Email);
                return StatusCode(500, "Internal server error. Please try again later.");
            }
        }



        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest model)
        {
            _logger.LogInformation("Login attempt for email: {Email}", model.Email);
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for login attempt with email: {Email}", model.Email);
                return BadRequest(ModelState);
            }

            var user = await _context.Users.Include(u => u.Role)
                                           .FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null)
            {
                _logger.LogWarning("Login failed: User not found for email: {Email}", model.Email);
                return Unauthorized("Invalid credentials.");
            }

            bool isPasswordValid = PasswordHasher.VerifyPassword(model.Password, user.Salt, user.Password);
            if (!isPasswordValid)
            {
                _logger.LogWarning("Login failed: Invalid password for email: {Email}", model.Email);
                return Unauthorized("Invalid credentials.");
            }

            // Generate JWT Token
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"];
            var issuer = jwtSettings["Issuer"];
            var audience = jwtSettings["Audience"];

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(secretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Email),
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Role, user.Role.RoleName)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = tokenHandler.WriteToken(token);

            _logger.LogInformation("User logged in successfully with email: {Email}", model.Email);

            var response = new
            {
                userId = user.UserId,
                email = user.Email,
                roleId = user.RoleId,
                roleName = user.Role.RoleName,
                token = jwtToken,
                message = user.Role.RoleName.Equals("Admin", StringComparison.OrdinalIgnoreCase)
                            ? "Redirect to Dashboard"
                            : "Redirect to Task List"
            };

            return Ok(response);
        }


        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                _logger.LogWarning("Unauthorized access attempt to 'me' endpoint.");
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);

            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
            {
                _logger.LogWarning("User not found for ID: {UserId}", userId);
                return NotFound();
            }

            _logger.LogInformation("Retrieved current user info for ID: {UserId}", userId);

            return Ok(new
            {
                user.UserId,
                user.Email,
                Role = user.Role.RoleName,
                CreatedOn = user.CreatedOn
            });
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var userId = userIdClaim != null ? userIdClaim.Value : "Unknown";
            _logger.LogInformation("User with ID {UserId} logged out.", userId);

            return Ok(new { message = "Logout successful." });
        }


    }
}
