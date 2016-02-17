using System.Web.Mvc;

namespace HRConcourse.Web
{
    public class FillerAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Filler";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Filler_default",
                "Filler/{controller}/{action}/{id}",
                new { controller = "DocumentFill", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}