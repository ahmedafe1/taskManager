using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagementSystem.API.DTOs;
using TaskManagementSystem.API.Services;

namespace TaskManagementSystem.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly TaskService _taskService;

        public TasksController(TaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskResponseDTO>>> GetTasks([FromQuery] bool? isComplete)
        {
            var userId = GetUserId();
            var tasks = await _taskService.GetTasks(userId, isComplete);
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskResponseDTO>> GetTask(Guid id)
        {
            var userId = GetUserId();
            try
            {
                var task = await _taskService.GetTask(id, userId);
                return Ok(task);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<TaskResponseDTO>> CreateTask(TaskDTO taskDto)
        {
            var userId = GetUserId();
            try
            {
                var task = await _taskService.CreateTask(taskDto, userId);
                return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TaskResponseDTO>> UpdateTask(Guid id, TaskUpdateDTO taskDto)
        {
            var userId = GetUserId();
            try
            {
                var task = await _taskService.UpdateTask(id, taskDto, userId);
                return Ok(task);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(Guid id)
        {
            var userId = GetUserId();
            try
            {
                await _taskService.DeleteTask(id, userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                throw new Exception("User ID not found in token");
            }
            return Guid.Parse(userIdClaim);
        }
    }
} 