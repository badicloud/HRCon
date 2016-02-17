using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.DynamicData;
using System.Web.Mvc;
using Abp.Domain.Repositories;
using Abp.Web.Mvc.Authorization;
using HRConcourse.Documents;
using HRConcourse.Documents.Dto;
using HRConcourse.EntityFramework.Repositories;
using HRConcourse.Recipients;
using System.Data.Entity;
using System.Runtime.InteropServices;
using System.Web;
using Abp.Domain.Uow;
using HRConcourse.PdfRendering;
using HRConcourse.Web.cor;

namespace HRConcourse.Web.Controllers
{
    [AbpMvcAuthorize]
    public class HomeController : HRConcourseControllerBase
    {
        private IDocumentRepository _documentRepository;
        private IRepository<Image> _imageRepository;
        private PdfToImageService _pdfToImageService;


        public HomeController(IDocumentRepository documentRepository, IRepository<Image> imageRepository,PdfToImageService pdfToImageService)
        {
            _pdfToImageService = pdfToImageService;
            _imageRepository = imageRepository;
            _documentRepository = documentRepository;
        }
        public ActionResult Index()
        {
            return View("~/App/Main/hrconcourse.cshtml"); //Layout of the durandal application.
        }
        [UnitOfWork]
        public virtual ActionResult Import(string hierName)
        {


            var w4s = _documentRepository.GetAll().ToList().Where(p => p.Name.ToUpper().Contains("W4"));

            foreach (var w4 in w4s)
            {
                w4.CreateDraft();
                var w4pdf = System.IO.File.ReadAllBytes(HttpRuntime.AppDomainAppPath + "SamplePdf/fw4.pdf");
                var images = _pdfToImageService.ConvertPdfToImages(w4pdf);
                var im1 = _imageRepository.InsertAndGetId(images[0]);
                var im2 = _imageRepository.InsertAndGetId(images[1]);
                    
                    w4.DraftRevision.Pages[0].ImageId = im1;
                w4.DraftRevision.Pages[1].ImageId = im2;
                w4.PublishDraft();
                
                _documentRepository.Update(w4);
               


            }

            return Content("Done");
        }

     
    }
}