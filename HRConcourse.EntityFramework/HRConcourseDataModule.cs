using System.Data.Entity;
using System.Reflection;
using Abp.Modules;
using Abp.Zero.EntityFramework;
using HRConcourse.EntityFramework;
using HRConcourse.Migrations;

namespace HRConcourse
{
    [DependsOn(typeof(AbpZeroEntityFrameworkModule), typeof(HRConcourseCoreModule))]
    public class HRConcourseDataModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.DefaultNameOrConnectionString = "Default";
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());
            Database.SetInitializer<HRConcourseDbContext>(new MigrateDatabaseToLatestVersion<HRConcourseDbContext, Configuration>());
        }
    }
}
