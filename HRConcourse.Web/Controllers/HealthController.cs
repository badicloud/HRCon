using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http.Results;
using System.Web.Mvc;
using Abp.Domain.Repositories;
using Abp.Web.Mvc.Authorization;
using HRConcourse.Documents;
using HRConcourse.Documents.Dto;
using HRConcourse.EntityFramework.Repositories;
using HRConcourse.Recipients;

namespace HRConcourse.Web.Controllers
{
   
    public class HealthController : HRConcourseControllerBase
    {


        public ActionResult Index()
        {
            return Content("Hi there!");
        }
    }
}