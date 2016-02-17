using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.Configuration;
using Abp.Configuration.Startup;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Runtime.Caching;
using Abp.Zero.Configuration;
using HRConcourse.Authorization.Roles;
using HRConcourse.MultiTenancy;
using Microsoft.AspNet.Identity;

namespace HRConcourse.Users
{
    public class UserManager : AbpUserManager<Tenant, Role, User>
    {
        private IUnitOfWorkManager _unitOfWorkManager;
        public UserManager(
            UserStore store,
            RoleManager roleManager,
            IRepository<Tenant> tenantRepository,
            IMultiTenancyConfig multiTenancyConfig,
            IPermissionManager permissionManager,
            IUnitOfWorkManager unitOfWorkManager,
            ISettingManager settingManager,
            IUserManagementConfig userManagementConfig,
            IIocResolver iocResolver,
            ICacheManager cacheManager)
            : base(
                store,
                roleManager,
                tenantRepository,
                multiTenancyConfig,
                permissionManager,
                unitOfWorkManager,
                settingManager,
                userManagementConfig,
                iocResolver,
                cacheManager
            )
        {
            _unitOfWorkManager = unitOfWorkManager;
        }


        public async Task<User> GetByClientIdAsnyc(string clientId, string clientSecret)
        {
            _unitOfWorkManager.Current.DisableFilter(AbpDataFilters.MayHaveTenant);
           return this.Users.FirstOrDefault(p => p.ClientId == clientId && p.ClientSecret == clientSecret);
        } 

        public override Task<IdentityResult> CreateAsync(User user, string password)
        {
            user.ClientId = RandomString.Generate(30);
            user.ClientSecret = RandomString.Generate(30);
            return base.CreateAsync(user, password);
        }

        public override Task<IdentityResult> CreateAsync(User user)
        {
            user.ClientId = RandomString.Generate(30);
            user.ClientSecret = RandomString.Generate(30);
            return base.CreateAsync(user);
        }

    }
}