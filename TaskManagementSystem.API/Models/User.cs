using System;
using Microsoft.AspNetCore.Identity;

namespace TaskManagementSystem.API.Models
{
    public class User : IdentityUser<Guid>
    {
        public ICollection<Task> Tasks { get; set; }
    }
} 