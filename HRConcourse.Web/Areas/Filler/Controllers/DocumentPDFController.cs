using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.Web.Mvc.Authorization;
using HRConcourse.Documents;
using HRConcourse.PdfRendering;
using HRConcourse.Web.Controllers;

namespace XR2.Web.Areas.DocCenter.Controllers
{
    [AbpMvcAuthorize()]
    public class DocumentPDFController : HRConcourseControllerBase
    {

        private IRenderService _renderService;

        public DocumentPDFController(IRenderService renderService)
        {
            _renderService = renderService;
        }

       
        public  FileContentResult GetDocumentPDF(int entryId)
        {
    
            var pdf =   _renderService.GetPdf(entryId);
            return File(pdf, "application/pdf", string.Format(System.Globalization.CultureInfo.InvariantCulture, "Doc_{0}.pdf", entryId));
        }
       
    }
}
