using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.AutoMapper;
using HRConcourse.Users.Dto;
using Microsoft.AspNet.Identity;

namespace HRConcourse.Users
{
    /* THIS IS JUST A SAMPLE. */
    public class UserAppService : HRConcourseAppServiceBase, IUserAppService
    {
        private readonly UserManager _userManager;
        private readonly IPermissionManager _permissionManager;

        public UserAppService(UserManager userManager, IPermissionManager permissionManager)
        {
            _userManager = userManager;
            _permissionManager = permissionManager;
        }

        public async Task ProhibitPermission(ProhibitPermissionInput input)
        {
            var user = await _userManager.GetUserByIdAsync(input.UserId);
            var permission = _permissionManager.GetPermission(input.PermissionName);

            await _userManager.ProhibitPermissionAsync(user, permission);
        }

        //Example for primitive method parameters.
        public async Task RemoveFromRole(long userId, string roleName)
        {
            CheckErrors(await _userManager.RemoveFromRoleAsync(userId, roleName));
        }


        public async Task CreateUser(CreateUserInput input)
        {

            var user = new User
            {
                Name = input.Name,
                Surname = input.Surname,
                Password = new PasswordHasher().HashPassword(input.Password),
                UserName = input.Email,
                EmailAddress = input.Email,
                TenantId = AbpSession.TenantId
            };
            CheckErrors(await _userManager.CreateAsync(user));
        }

        public async Task<GetApiKeysOutput> GetApiKeys()
        {
            var user = await this.GetCurrentUserAsync();
            return user.MapTo<GetApiKeysOutput>();
        }
    }
}