using System.Threading.Tasks;
using Abp.Application.Services;
using HRConcourse.Users.Dto;

namespace HRConcourse.Users
{
    public interface IUserAppService : IApplicationService
    {
        Task ProhibitPermission(ProhibitPermissionInput input);
        Task CreateUser(CreateUserInput input);
        Task RemoveFromRole(long userId, string roleName);
        Task<GetApiKeysOutput> GetApiKeys();
    }
}