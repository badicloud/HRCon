using Abp.Authorization;
using HRConcourse.Authorization.Roles;
using HRConcourse.MultiTenancy;
using HRConcourse.Users;

namespace HRConcourse.Authorization
{
    public class PermissionChecker : PermissionChecker<Tenant, Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {

        }
    }
}
