using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using TaskManagementSystem.API.DTOs;
using TaskManagementSystem.API.Models;

namespace TaskManagementSystem.API.Services
{
    public class AuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;

        public AuthService(UserManager<User> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task<UserResponseDTO> Register(UserDTO userDto)
        {
            var user = new User
            {
                UserName = userDto.Username,
                Email = userDto.Email
            };

            var result = await _userManager.CreateAsync(user, userDto.Password);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception($"User registration failed: {errors}");
            }

            var token = GenerateJwtToken(user);
            return new UserResponseDTO
            {
                Username = user.UserName,
                Email = user.Email,
                Token = token
            };
        }

        public async Task<UserResponseDTO> Login(LoginDTO loginDto)
        {
            Console.WriteLine($"Login attempt for email: {loginDto.Email}");
            
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            Console.WriteLine($"User found: {user != null}");

            if (user == null)
            {
                Console.WriteLine("User not found");
                throw new Exception("Invalid email or password");
            }

            var passwordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            Console.WriteLine($"Password valid: {passwordValid}");

            if (!passwordValid)
            {
                Console.WriteLine("Invalid password");
                throw new Exception("Invalid email or password");
            }

            var token = GenerateJwtToken(user);
            Console.WriteLine("Login successful, token generated");
            return new UserResponseDTO
            {
                Username = user.UserName,
                Email = user.Email,
                Token = token
            };
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(Convert.ToDouble(_configuration["Jwt:ExpireDays"]));

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
} 