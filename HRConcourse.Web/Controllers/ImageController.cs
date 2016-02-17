using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using HRConcourse.Documents;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using System.Web;
using System.IO;
using Abp.Web.Mvc.Authorization;

namespace HRConcourse.Web.Controllers
{

    public class ImageController : HRConcourseControllerBase
    {
        private IRepository<Image> _imageRepository;

        public ImageController(IRepository<Image> imageRepository )
        {
            _imageRepository = imageRepository;
        }


        public ActionResult Index(int pageImageId)
        {
            var image = _imageRepository.Get(pageImageId);
            if (image != null)
            {
                return File(image.Data, "image");
            }

            return View("Error");
        }

   

    }
}
