using System.Reflection;
using System.Web.Http;
using Abp.Application.Services;
using Abp.Configuration.Startup;
using Abp.Modules;
using Abp.WebApi;
using Abp.WebApi.Controllers.Dynamic.Builders;
using HRConcourse.Documents;
using HRConcourse.Recipients;
using HRConcourse.Sessions;
using HRConcourse.Users;

namespace HRConcourse
{
    [DependsOn(typeof(AbpWebApiModule), typeof(HRConcourseApplicationModule))]
    public class HRConcourseWebApiModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());


            DynamicApiControllerBuilder
              .For<IDocumentsAppService>("hrconcourse/documents")
              .Build();
            DynamicApiControllerBuilder
            .For<IUserAppService>("hrconcourse/users")
            .Build();

            DynamicApiControllerBuilder
            .For<ISessionAppService>("hrconcourse/session")
            .Build();
            Configuration.Modules.AbpWebApi().HttpConfiguration.Filters.Add(new HostAuthenticationFilter("Bearer"));

        }
    }
}
