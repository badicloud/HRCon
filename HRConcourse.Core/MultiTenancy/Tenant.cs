using Abp.MultiTenancy;
using HRConcourse.Users;

namespace HRConcourse.MultiTenancy
{
    public class Tenant : AbpTenant<Tenant, User>
    {
      
    }
}