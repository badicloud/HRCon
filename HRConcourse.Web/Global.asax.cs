using System;
using System.Web.Mvc;
using Abp.Dependency;
using Abp.Web;
using Castle.Facilities.Logging;

namespace HRConcourse.Web
{
    public class MvcApplication : AbpWebApplication
    {
        protected override void Application_Start(object sender, EventArgs e)
        {
            //Register EO.Pdf MVCToPDF filters
   
            IocManager.Instance.IocContainer.AddFacility<LoggingFacility>(f => f.UseLog4Net().WithConfig("log4net.config"));
            base.Application_Start(sender, e);

        }
    }
}
