using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Auditing;
using Abp.Authorization;
using Abp.AutoMapper;
using HRConcourse.Sessions.Dto;

namespace HRConcourse.Sessions
{
    [AbpAuthorize]
    public class SessionAppService : HRConcourseAppServiceBase, ISessionAppService
    {
        [DisableAuditing]
        public async Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations()
        {
            var output = new GetCurrentLoginInformationsOutput
            {
                User = (await GetCurrentUserAsync()).MapTo<UserLoginInfoDto>()
            };

            if (AbpSession.TenantId.HasValue)
            {
                output.Tenant = (await GetCurrentTenantAsync()).MapTo<TenantLoginInfoDto>();
            }

            return output;
        }
    }
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }



}