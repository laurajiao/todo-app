using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models;

public class CreateTaskDto
{
    [Required, MinLength(1), MaxLength(20)]
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TaskStatus? Status { get; set; }
    public DateTime? DueDate { get; set; }
}

public class UpdateTaskDto
{
    [MinLength(1), MaxLength(20)]
    public string? Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TaskStatus? Status { get; set; }
    public DateTime? DueDate { get; set; }
}
