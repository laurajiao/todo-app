using TodoApi.Models;
using TaskStatus = TodoApi.Models.TaskStatus;

namespace TodoApi.Data;

public static class SeedData
{
    public static void Initialize(TodoDb db)
    {
        if (db.Tasks.Any()) return;
        db.Tasks.AddRange(
            new TaskItem
            {
                Title = "Buy groceries",
                Description = "Milk, Bread, Eggs, Butter",
                DueDate = DateTime.UtcNow.AddDays(2),
                Status = TaskStatus.NotStarted
            }
        );
        db.SaveChanges();
    }
}
