using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.API.Data;
using TaskManagementSystem.API.DTOs;
using TaskManagementSystem.API.Models;

namespace TaskManagementSystem.API.Services
{
    public class TaskService
    {
        private readonly ApplicationDbContext _context;

        public TaskService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async System.Threading.Tasks.Task<TaskResponseDTO> CreateTask(TaskDTO taskDto, Guid userId)
        {
            var task = new Models.Task
            {
                Title = taskDto.Title,
                Description = taskDto.Description,
                DueDate = taskDto.DueDate,
                IsComplete = false,
                UserId = userId
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return MapToTaskResponseDTO(task);
        }

        public async System.Threading.Tasks.Task<IEnumerable<TaskResponseDTO>> GetTasks(Guid userId, bool? isComplete = null)
        {
            var query = _context.Tasks.Where(t => t.UserId == userId);

            if (isComplete.HasValue)
            {
                query = query.Where(t => t.IsComplete == isComplete.Value);
            }

            var tasks = await query.ToListAsync();
            return tasks.Select(MapToTaskResponseDTO);
        }

        public async System.Threading.Tasks.Task<TaskResponseDTO> GetTask(Guid taskId, Guid userId)
        {
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);

            if (task == null)
            {
                throw new Exception("Task not found");
            }

            return MapToTaskResponseDTO(task);
        }

        public async System.Threading.Tasks.Task<TaskResponseDTO> UpdateTask(Guid taskId, TaskUpdateDTO taskDto, Guid userId)
        {
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);

            if (task == null)
            {
                throw new Exception("Task not found");
            }

            // Only update fields that are provided in the DTO
            if (taskDto.Title != null)
                task.Title = taskDto.Title;
                
            if (taskDto.Description != null)
                task.Description = taskDto.Description;
                
            if (taskDto.DueDate.HasValue)
                task.DueDate = taskDto.DueDate.Value;
                
            if (taskDto.IsComplete.HasValue)
                task.IsComplete = taskDto.IsComplete.Value;

            await _context.SaveChangesAsync();

            return MapToTaskResponseDTO(task);
        }

        public async System.Threading.Tasks.Task DeleteTask(Guid taskId, Guid userId)
        {
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);

            if (task == null)
            {
                throw new Exception("Task not found");
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
        }

        private static TaskResponseDTO MapToTaskResponseDTO(Models.Task task)
        {
            return new TaskResponseDTO
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                DueDate = task.DueDate,
                IsComplete = task.IsComplete
            };
        }
    }
} 