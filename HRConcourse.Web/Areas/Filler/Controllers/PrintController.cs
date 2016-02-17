using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using HRConcourse.Documents;
using HRConcourse.EntityFramework.Repositories;
using HRConcourse.Entries;
using HRConcourse.Web.Controllers;
using HRConcourse.Web.Models;
using System.Threading;

namespace HRConcourse.Web.Areas.Filler.Controllers
{

    public class PrintController : HRConcourseControllerBase
    {
        private readonly IRepository<DocumentEntry> _documentEntryRepository;
        private readonly IRevisionRepository _revisionRepository;

        public PrintController(IDocumentEntryRepository documentEntryRepository, IRevisionRepository revisionRepository)
        {
            _revisionRepository = revisionRepository;
            _documentEntryRepository = documentEntryRepository;
        }


        [UnitOfWork]
        public virtual  ActionResult Index(int documentEntryId, string printCode)
        {
            var systemPrintCode = System.Configuration.ConfigurationManager.AppSettings["PrintCode"];
            if (systemPrintCode != printCode)
                throw new UnauthorizedAccessException("Error");
            var documentEntry = _documentEntryRepository.GetAll().Include("FieldValues").Single(p=>p.Id == documentEntryId);

            var revision = _revisionRepository.Get(documentEntry.RevisionId);
            var documentPagesHtml = new List<Tuple<int, PrintPageModel>>();
            var dictionary = new Dictionary<string, string>();
            foreach (var page in revision.Pages)
            {

     
                var fieldValues = documentEntry.FieldValues;
                foreach (var field in fieldValues)
                {
                    var firstOrDefault = revision.Pages.SelectMany(p => p.Fields).FirstOrDefault(p => p.Id == field.FieldId);
                    if (firstOrDefault != null)
                    {
                        var fieldName = firstOrDefault.FieldName;
                        var fieldValue = field.Value;
                        if (!dictionary.ContainsKey(fieldName))
                            dictionary.Add(fieldName, fieldValue);
                    }
                }

                var json = new JavaScriptSerializer().Serialize(dictionary);
                string html = string.Empty;
                if (page.Fields.Count > 0)
                    html = page.Fields.Select(p => p.Html).Aggregate((current, next) => current + "" + next);
                var fieldsJson = new JavaScriptSerializer().Serialize(page.Fields);
                var printPageModel = new PrintPageModel { PageInstanceId = page.Id, Html = html, ImageId = page.ImageId, MetadataJSON = fieldsJson, SubmittedDataJson = json };
                lock (documentPagesHtml)
                {
                    // generate the HTML from the page model
                    documentPagesHtml.Add(new Tuple<int, PrintPageModel>(page.Number, printPageModel));
                }
            }

            ViewBag.ForcePrint = false;
            ViewBag.MergeFieldValues = new List<object>();
            // set the model as the list of pages, order by number
            var model = documentPagesHtml.OrderBy(p => p.Item1).Select(p => p.Item2);
            return View("Index", model);
        }


    }
}
