using System.Text.Json.Serialization; 
namespace TodoApi.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum TaskStatus
{
    NotStarted,
    InProgress,
    Completed,
    Cancelled,
    Overdue
}
