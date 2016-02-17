using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace HRConcourse.Web
{
    public static class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            //ASP.NET Web API Route Config
            routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
                );

            routes.MapRoute(
              name: "KioskRedirect",
              url: "{hierarchy}/doccenter/kiosk",
              defaults: new { controller = "AidaRedirect", action = "Index" }
          );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );


          

        }
    }
}
