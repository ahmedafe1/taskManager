using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TaskManagementSystem.API.DTOs;
using TaskManagementSystem.API.Services;

namespace TaskManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserResponseDTO>> Register(UserDTO userDto)
        {
            try
            {
                if (string.IsNullOrEmpty(userDto.Username) || string.IsNullOrEmpty(userDto.Email) || string.IsNullOrEmpty(userDto.Password))
                {
                    return BadRequest("Username, email, and password are required");
                }

                var result = await _authService.Register(userDto);
                return Ok(result);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserResponseDTO>> Login(LoginDTO loginDto)
        {
            try
            {
                Console.WriteLine($"Received login request for email: {loginDto.Email}");
                if (string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
                {
                    Console.WriteLine("Email or password is empty");
                    return BadRequest("Email and password are required");
                }

                var result = await _authService.Login(loginDto);
                Console.WriteLine("Login successful");
                return Ok(result);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Login error: {ex.Message}");
                return Unauthorized(ex.Message);
            }
        }
    }
} 