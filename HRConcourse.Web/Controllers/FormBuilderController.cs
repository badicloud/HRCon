using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace HRConcourse.Web.Controllers
{
    public class FormBuilderController : HRConcourseControllerBase
    {
        // GET: FormBuilder
        public ActionResult Index(bool isReadOnly = false)
        {
            this.ViewBag.IsReadOnly = isReadOnly;
            return View();
        }
    }
}
