using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HRConcourse.Web.Controllers
{
    public class AidaRedirectController : Controller
    {
        // GET: AidaRedirect
        public ActionResult Index(string hierarchy)
        {
            return RedirectPermanent("http://kiosk.aidacreative.com/" + hierarchy + "/Default");
        }
    }
}