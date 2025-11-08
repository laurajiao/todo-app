using AutoMapper;
using TodoApi.Models;
using TaskStatus = TodoApi.Models.TaskStatus;

namespace TodoApi.Features.Tasks;

public class TaskMappingProfile : Profile
{
    public TaskMappingProfile()
    {
        CreateMap<CreateTaskDto, TaskItem>()
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Status ?? TaskStatus.NotStarted))
            .ForMember(d => d.Title, o => o.MapFrom(s => s.Title.Trim()))
            .ForMember(d => d.CreatedAt, o => o.Ignore())
            .ForMember(d => d.Id, o => o.Ignore());

        CreateMap<UpdateTaskDto, TaskItem>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}
