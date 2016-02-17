using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Drawing.Drawing2D;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.Security;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.Domain.Uow;
using Abp.Web.Mvc.Authorization;
using EO.Pdf;
using HRConcourse.Documents;
using HRConcourse.Entries;
using HRConcourse.ReadModels;
using HRConcourse.Recipients;
using HRConcourse.Web.Areas.Filler.Models;
using HRConcourse.Web.Controllers;
using Page = System.Web.UI.Page;

namespace HRConcourse.Web.Areas.Filler.Controllers
{
    public class DocumentFillController : HRConcourseControllerBase
    {
        private IDocumentRepository _documentRepository;
        private IRepository<Revision> _revisionRepository;
        private IDocumentEntryRepository _entryRepository;

        public DocumentFillController(IDocumentRepository documentRepository,
            IRepository<Revision> revisionRepository, IDocumentEntryRepository entryRepository)
        {
            _revisionRepository = revisionRepository;
            _documentRepository = documentRepository;
            _entryRepository = entryRepository;
        }

        #region Private Methods

        public static string RenderPartialViewToString(ControllerContext context, ViewResultBase partialViewResult)
        {

            using (var sw = new System.IO.StringWriter())
            {
                if (string.IsNullOrEmpty(partialViewResult.ViewName))
                {
                    partialViewResult.ViewName = context.RouteData.GetRequiredString("action");
                }
                ViewEngineResult result = null;
                if (partialViewResult.View == null)
                {
                    result = partialViewResult.ViewEngineCollection.FindPartialView(context, partialViewResult.ViewName);
                    if (result.View == null)
                        throw new InvalidOperationException(
                                       "Unable to find view. Searched in: " +
                                       string.Join(",", result.SearchedLocations));
                    partialViewResult.View = result.View;
                }

                var view = partialViewResult.View;
                var viewContext = new ViewContext(context, view, partialViewResult.ViewData,
                                                  partialViewResult.TempData, sw);
                view.Render(viewContext, sw);
                if (result != null)
                {
                    result.ViewEngine.ReleaseView(context, view);
                }
                return sw.ToString();
            }
        }

        [UnitOfWork]
        public virtual ActionResult GetKioskDocument(int revisionId)
        {
            var revision = _revisionRepository.Get(revisionId);

            var model = new KioskDocumentPanelViewModel();

            model.RevisionId = revisionId;

            model.Pages =
              revision.Pages.Select(
                  p => new KioskPageFillViewModel() { Number = p.Number, PageId = p.Id }).ToList();


            var pv = PartialView("KioskDocumentPanelUserControl", model);

            string viewStr = RenderPartialViewToString(ControllerContext, pv);
            return Json(new { success = true, setup = true, content = viewStr });
        }


        #endregion
        [UnitOfWork()]

        public virtual ActionResult Index(int documentId)
        {
            CurrentUnitOfWork.DisableFilter("MustHaveTenant");
            var model = new KioskViewModel();

            var document = this._documentRepository.Get(documentId);
            model.DocumentId = documentId;
            model.PageCount = document.ActiveRevision.Pages.Count();
            model.RevisionId = document.ActiveRevision.Id;

            return View("Kiosk", model);
        }

        [UnitOfWork]
        public virtual ActionResult GetKioskPage(int revisionId, int pageId)
        {

            CurrentUnitOfWork.DisableFilter("MustHaveTenant");
            var model = new KioskPageSubmitViewModel();

            var revision = _revisionRepository.Get(revisionId);
            var dict = new Dictionary<long, string>();


            model.SubmittedDataJson = new JavaScriptSerializer().Serialize(dict);
            var page = revision.Pages.First(p => p.Id == pageId);
            var fields = page.Fields;
            foreach (var field in fields)
            {
                model.FormView += field.Html;
            }
            model.NotApprovedReason = "TBD ";
            model.MetadataJSON = new JavaScriptSerializer().Serialize(fields);
            model.PageNumber = page.Number;
            model.PageImageId = page.ImageId;
            string viewStr = RenderPartialViewToString(ControllerContext, PartialView("KioskDocumentSubmitUserControl", model));
            return Json(new { success = true, content = viewStr });

        }


        [ValidateInput(false)]
        [UnitOfWork]
        public virtual ActionResult SubmitForm([FromUri]int revisionId, [FromBody] FormCollection values)
        {

            CurrentUnitOfWork.DisableFilter("MustHaveTenant");
            var revision = this._revisionRepository.Get(revisionId);
            var aux = new List<FieldValue>();

            var fields = revision.Pages.SelectMany(p => p.Fields);

            foreach (string dictKey in values)
            {
                if (dictKey == null) continue;
                var value = values[dictKey];
                foreach (var field in fields.Where(p => p.FieldId == dictKey))
                {
                    aux.Add(new FieldValue() { FieldId = field.Id, Value = value });
                }
            }

            var entry = new DocumentEntry();
            entry.FieldValues = aux;
            entry.RevisionId = revisionId;
            var id = _entryRepository.InsertAndGetId(entry);
            return Json(new { success = true, entryId = id });
        }


        public virtual ActionResult KioskFinish()
        {
            return View("KioskFinish");
        }
    }
}
