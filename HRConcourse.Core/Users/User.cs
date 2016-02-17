using System;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.Extensions;
using HRConcourse.MultiTenancy;

namespace HRConcourse.Users
{

    public class User : AbpUser<Tenant, User>
    {
        public string ClientSecret { get; set; }
        public string ClientId { get; set; }
        public static string CreateRandomPassword()
        {
            return Guid.NewGuid().ToString("N").Truncate(16);
        }
        public User()
        {
            
        }
    }
}