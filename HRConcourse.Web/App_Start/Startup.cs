using System;
using System.Security.Claims;
using System.Threading.Tasks;
using HRConcourse.Api.Controllers;
using HRConcourse.Users;
using HRConcourse.Web;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Owin;

[assembly: OwinStartup(typeof(Startup))]

namespace HRConcourse.Web
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {

            // Enable the application to use a cookie to store information for the signed in user
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Account/Login")
            });

            // Use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            app.UseOAuthBearerAuthentication(AccountController.OAuthBearerOptions);

        }
     
    }



}