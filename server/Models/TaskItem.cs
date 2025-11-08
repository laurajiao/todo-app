using System.ComponentModel.DataAnnotations;
namespace TodoApi.Models;

public class TaskItem
{
    public int Id { get; set; }
    [Required, MinLength(1), MaxLength(20)]
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TaskStatus Status { get; set; } = TaskStatus.NotStarted;
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
