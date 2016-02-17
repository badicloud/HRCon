using System.Reflection;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Abp.Localization;
using Abp.Localization.Sources;
using Abp.Localization.Sources.Xml;
using Abp.Modules;

namespace HRConcourse.Web
{
    [DependsOn(typeof(HRConcourseDataModule), typeof(HRConcourseApplicationModule), typeof(HRConcourseWebApiModule))]
    public class HRConcourseWebModule : AbpModule
    {
        public override void PreInitialize()
        {
            //Add/remove languages for your application
            Configuration.Localization.Languages.Add(new LanguageInfo("en", "English", "famfamfam-flag-england", true));
            Configuration.Localization.Languages.Add(new LanguageInfo("tr", "Türkçe", "famfamfam-flag-tr"));
            Configuration.Localization.Languages.Add(new LanguageInfo("zh-CN", "简体中文", "famfamfam-flag-cn"));

   
            //Configure navigation/menu
            Configuration.Navigation.Providers.Add<HRConcourseNavigationProvider>();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());
            var area = new FillerAreaRegistration();
            var rc = new AreaRegistrationContext(area.AreaName, RouteTable.Routes);
            area.RegisterArea(rc);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
    }
}
