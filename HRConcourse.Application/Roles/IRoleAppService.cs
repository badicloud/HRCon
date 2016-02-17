using System.Threading.Tasks;
using Abp.Application.Services;
using HRConcourse.Roles.Dto;

namespace HRConcourse.Roles
{
    public interface IRoleAppService : IApplicationService
    {
        Task UpdateRolePermissions(UpdateRolePermissionsInput input);
    }
}
