using Abp.Authorization.Roles;
using HRConcourse.MultiTenancy;
using HRConcourse.Users;

namespace HRConcourse.Authorization.Roles
{
    public class Role : AbpRole<Tenant, User>
    {

    }
}