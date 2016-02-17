using System.Configuration;
using System.Drawing;
using System.IO;
using System.Net;
using System.Web;
using System.Web.Hosting;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using EO.Pdf;
using HRConcourse.EntityFramework.Repositories;
using HRConcourse.Entries;
using HRConcourse.Users;

namespace HRConcourse.PdfRendering
{
    public interface IRenderService
    {
        byte[] GetPdf(int documentEntry);
    }

    public class RenderService : ApplicationService, IRenderService,
        IEventHandler<EntityCreatedEventData<DocumentEntry>>
    {
        private readonly IDocumentEntryRepository _entryRepository;

        private readonly IRepository<EntryPdfRenderReadModel> _renderRepository;
        private IRevisionRepository _revisionRepository;
        private UserManager _userManager;

        public RenderService(IRepository<EntryPdfRenderReadModel> renderRepository,
            IRevisionRepository revisionRepository,
            IDocumentEntryRepository entryRepository,
            UserManager userManager)
        {
            _entryRepository = entryRepository;
            _revisionRepository = revisionRepository;
            _userManager = userManager;
            _renderRepository = renderRepository;
        }

        public virtual void HandleEvent(EntityCreatedEventData<DocumentEntry> eventData)
        {
            var entry = eventData.Entity;
            HostingEnvironment.QueueBackgroundWorkItem(ct => PreRender(entry));
        }


        public byte[] GetPdf(int entryId)
        {
            var entry = _entryRepository.Get(entryId);
            var preRender = _renderRepository.FirstOrDefault(p => p.EntryId == entryId);
            if (preRender != null)
               return preRender.PdfFile;
            else
            {
            return PreRender(entry);

             }
        }

        private static HtmlToPdfOptions GetPdfOptions()
        {
            var pageSize = PdfPageSizes.Letter;
            float marginLeft = 0;
            float marginTop = 0;
            float marginRight = 0;
            float marginBottom = 0;
            var pdfOptions = new HtmlToPdfOptions
            {
                PageSize = pageSize,
                OutputArea = new RectangleF(
                    marginLeft, marginTop,
                    pageSize.Width - marginLeft - marginRight,
                    pageSize.Height - marginTop - marginBottom
                    ),
                AutoFitX = HtmlToPdfAutoFitMode.ScaleToFit,
                MaxLoadWaitTime = 1000000,
                TriggerMode = HtmlToPdfTriggerMode.Auto,
                BaseUrl = ConfigurationManager.AppSettings["HostedUrl"]
            };
            return pdfOptions;
        }


        private byte[] RenderPDF(DocumentEntry entry)
        {
            var printCode = ConfigurationManager.AppSettings["PrintCode"];
            var resDoc = new PdfDocument {EmbedFont = true};
            var url = string.Format(ConfigurationManager.AppSettings["HostedUrl"] + "filler/print?documentEntryId={0}&printCode={1}",
                entry.Id, printCode);


            HtmlToPdf.ConvertUrl(url, resDoc, GetPdfOptions());
            using (var stream = new MemoryStream())
            {
                resDoc.Save(stream);
                return stream.ToArray();
            }
        }


        private static Cookie HttpCookieToCookie(HttpCookie cookie)
        {
            var oC = new Cookie
            {
                Name = cookie.Name,
                Value = cookie.Value,
                Domain = cookie.Domain,
                Path = cookie.Path,
                HttpOnly = cookie.HttpOnly,
                Secure = cookie.Secure,
                Expires = cookie.Expires
            };
            return oC;
        }

        private byte[] PreRender(DocumentEntry entry)
        {
            var currentRender = _renderRepository.FirstOrDefault(p => p.EntryId == entry.Id);
            if (currentRender == null)
            {
                currentRender = new EntryPdfRenderReadModel();
                currentRender.EntryId = entry.Id;
                currentRender.PdfFile = RenderPDF(entry);
                _renderRepository.InsertAndGetId(currentRender);
            }
            else
            {
                currentRender.PdfFile = RenderPDF(entry);
                _renderRepository.Update(currentRender);
            }
            return currentRender.PdfFile;
        }
    }
}