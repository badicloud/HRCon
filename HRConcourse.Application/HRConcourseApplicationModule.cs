using System.Reflection;
using Abp.AutoMapper;
using Abp.Modules;

namespace HRConcourse
{
    [DependsOn(typeof(HRConcourseCoreModule), typeof(AbpAutoMapperModule))]
    public class HRConcourseApplicationModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());
        }
    }
}
