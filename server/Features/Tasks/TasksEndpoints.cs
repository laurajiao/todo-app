using Microsoft.EntityFrameworkCore;
using AutoMapper;
using TodoApi.Data;
using TodoApi.Models;
using TaskStatus = TodoApi.Models.TaskStatus;

namespace TodoApi.Features.Tasks;

public static class TasksEndpoints 
{
    public static RouteGroupBuilder MapTasksEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/tasks");

        // GET /tasks  
        group.MapGet("/", async (TodoDb db) =>
        {
            var tasks = await db.Tasks
                .OrderByDescending(t => t.Id)
                .ToListAsync();

            return Results.Ok(tasks);
        });

        // POST/tasks/{id}  
        group.MapPost("/", async (CreateTaskDto dto, TodoDb db, IMapper mapper) =>
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                return Results.BadRequest("Title is required.");
            dto.Title = dto.Title.Trim();
            var task = mapper.Map<TaskItem>(dto);
            db.Tasks.Add(task);
            await db.SaveChangesAsync();
            return Results.Created($"/tasks/{task.Id}", task);
        });

        // PUT /tasks/{id}  
        group.MapPut("/{id:int}", async (int id, UpdateTaskDto dto, TodoDb db, IMapper mapper) =>
        {
            var task = await db.Tasks.FindAsync(id);
            if (task is null)
                return Results.NotFound();
            if (dto.Title is not null)
            {
                if (string.IsNullOrWhiteSpace(dto.Title))
                    return Results.BadRequest("Title cannot be empty.");
                dto.Title = dto.Title.Trim();
            }
            mapper.Map(dto, task);
            await db.SaveChangesAsync();
            return Results.Ok(task);
        });

        // DELETE /tasks/{id}  
        group.MapDelete("/{id:int}", async (int id, TodoDb db) =>
        {
            var task = await db.Tasks.FindAsync(id);
            if (task is null)
                return Results.NotFound();
            db.Tasks.Remove(task);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        return group;
    }
}

