using Abp.Application.Editions;
using Abp.Domain.Repositories;
using Abp.MultiTenancy;
using HRConcourse.Authorization.Roles;
using HRConcourse.Users;

namespace HRConcourse.MultiTenancy
{
    public class TenantManager : AbpTenantManager<Tenant, Role, User>
    {
        public TenantManager(EditionManager editionManager)
            : base(editionManager)
        {

        }
    }

    public class EditionManager : AbpEditionManager
    {

    }
}