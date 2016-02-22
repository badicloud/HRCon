using HRConcourse.Documents.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;
using Abp.AutoMapper;
using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Runtime.Validation;
using Abp.UI;
using HRConcourse.EntityFramework.Repositories;
using HRConcourse.Exception;
using HRConcourse.PdfRendering;
using HRConcourse.ReadModels;
using HRConcourse.Entries;

namespace HRConcourse.Documents
{
    [AbpAuthorize()]
    public class DocumentsAppService : HRConcourseAppServiceBase, IDocumentsAppService
    {

        IDocumentRepository _documentRepository;
        private PdfToImageService _pdfToImageService;
        private IRepository<Image> _imageRepository;
        private IDocumentEntryRepository _entryRepository;
        private IRevisionRepository _revisionRepository;

        public DocumentsAppService(IDocumentRepository documentRepository,
            PdfToImageService pdfToImageService,
            IRepository<Image> imageRepository,
            IDocumentEntryRepository entryRepository,
            IRevisionRepository revisionRepository
            )
        {
            _revisionRepository = revisionRepository;
            _imageRepository = imageRepository;
            _pdfToImageService = pdfToImageService;
            _documentRepository = documentRepository;
            _entryRepository = entryRepository;
        }

        public  CreateDocumentOutput CreateDocument(CreateDocumentInput input)
        {
            if (_documentRepository.GetAll().Any(p => p.Name == input.Name))
                throw new AbpSingleMemberValidationException("Document already exists", "Name");
            var document = AutoMapper.Mapper.Map<Document>(input);
            document.CreateDraft();
            document.DraftRevision.AddBlankPage();
            var documentId = _documentRepository.InsertAndGetId(document);

            return new CreateDocumentOutput() { DocumentId = documentId };
        }

        public  CreateDocumentWithImagesOutput CreateDocumentWithImages(CreateDocumentWithImagesInput input)
        {
            if (_documentRepository.GetAll().Any(p => p.Name == input.Name))
                throw new AbpSingleMemberValidationException("Document already exists", "Name");
            var document = AutoMapper.Mapper.Map<Document>(input);
            document.CreateDraft();
            foreach (var image in input.PageImages.OrderBy(p => p.PageNumber))
            {
                var page = document.DraftRevision.AddBlankPage();
                page.ImageId = image.ImageId;
            }

            var documentId = _documentRepository.InsertAndGetId(document);
            return new CreateDocumentWithImagesOutput() { DocumentId = documentId };
        }

        public  void AddPage(AddPageInput input)
        {
            var document = _documentRepository.Get(input.DocumentId);
            document.DraftRevision.AddBlankPage();
        }

        public  void AddDocumentPagesFromPdf(AddDocumentPagesFromPdfInput input)
        {
            var document = _documentRepository.Get(input.DocumentId);

            var images = _pdfToImageService.ConvertPdfToImages(input.PdBytes);

            foreach (var image in images.OrderBy(p => p.Key))
            {
                var imageId = _imageRepository.InsertAndGetId(image.Value);
                var page = document.DraftRevision.AddBlankPage();
                page.ImageId = imageId;
            }

        }

        public  void UpdateDocument(UpdateDocumentInput input)
        {
          var document = _documentRepository.FirstOrDefault(p => p.Id == input.Id);
          document.Name = input.Name;
        }

        public GetDocumentsOutput GetDocuments(GetDocumentsInput input)
        {
            var docsBaseQuery = _documentRepository.GetAll();

            if (!string.IsNullOrWhiteSpace(input.SearchString))
            {
                docsBaseQuery = docsBaseQuery.Where(p => p.Name.Contains(input.SearchString));
            }
            if (input.OnlyWithWorkingRevision)
            {
                docsBaseQuery = docsBaseQuery.Where(p => p.DraftRevision != null);
            }


            var documents = docsBaseQuery.Select(p => new DocumentReadModelDto
            {
                DocumentId = p.Id,
                Name = p.Name
            });
            var auxResult = new GetDocumentsOutput
            {
                Documents = documents.ToList()
            };
            return auxResult;
        }

        public  void DeleteDocument(DeleteDocumentDto input)
        {
            _documentRepository.Delete(input.documentId);
        }



        public void UpdatePageImage(UpdatePageImageDto input)
        {
            var document = _documentRepository.Get(input.DocumentId);
            var currentPage = document?.DraftRevision.Pages.FirstOrDefault(p => p.Id == input.PageId);

            if (currentPage != null) currentPage.ImageId = input.ImageId;
        }



        public GetDocumentInfoOutput GetDocumentInfo(GetDocumentInfoInput input)
        {
          var document = _documentRepository.Get(input.DocumentId);
          return new GetDocumentInfoOutput() { Name = document.Name };
        }

        public  GetDocumentDesignOutput GetDocumentDesign(GetDocumentDesignInput input)
        {
            var output = new GetDocumentDesignOutput() { DocumentId = input.DocumentId };


            var document = _documentRepository.Get(input.DocumentId);
            output.Name = document.Name;

            var revision = document.DraftRevision;


            if (revision == null)
            {
                revision = document.ActiveRevision;
                output.IsDraft = false;
            }
            else
            {
                output.IsDraft = true;
            }


            foreach (var page in revision.Pages)
            {

                var fields = page.Fields.MapTo<IEnumerable<FieldMetadata>>();


                var serializer = new DataContractJsonSerializer(typeof(List<FieldMetadata>));
                using (MemoryStream ms = new MemoryStream())
                {
                    serializer.WriteObject(ms, fields);
                    ms.Position = 0;
                    using (StreamReader reader = new StreamReader(ms))
                    {
                        string json = reader.ReadToEnd();
                        output.Pages.Add(new PagesOut() { Number = page.Number, Fields = json, ImageId = page.ImageId, PageId = page.Id });
                    }
                };

            }


            return output;
        }


        public  SaveDocumentDesignOutput SaveDocumentDesign(SaveDocumentDesignInput input)
        {
            var document = _documentRepository.Get(input.DocumentId);
            if (document.DraftRevision == null)
                document.CreateDraft();

            // Iterate over each page
            foreach (var pageDesign in input.PagesDesign)
            {
              var page = document.DraftRevision.Pages.First(p => p.Number == pageDesign.PageNumber);

              // Parse fields
              var serializer = new DataContractJsonSerializer(typeof(List<FieldMetadata>));
              using (var ms = new MemoryStream(Encoding.UTF8.GetBytes(pageDesign.Fields)))
              {
                var updatedFields = (List<FieldMetadata>)serializer.ReadObject(ms);
                //Update or Create Fields for the page
                foreach (var updatedField in updatedFields)
                {

                  var field = page.Fields.FirstOrDefault(p => p.FieldId == updatedField.FieldId);
                  //Existing field update
                  if (field != null)
                  {
                    //keep original id
                    var id = field.Id;
                    updatedField.MapTo(field);
                    field.Id = id;

                  }
                  //Create fields for the page
                  else
                  {
                    var newField = updatedField.MapTo<Field>();
                    page.Fields.Add(newField);
                  }
                }

                //Delete unexisting fields
                var deletedFields = (from field in page.Fields where updatedFields.FirstOrDefault(p => p.FieldId == field.FieldId) == null select field).ToList();

                foreach (var deletedField in deletedFields)
                {
                  page.Fields.Remove(deletedField);
                }
              }
            }
            
            return new SaveDocumentDesignOutput { Success = true };
        }

        public  void PublishDraft(PublishDraftInput input)
        {
            var document = _documentRepository.Get(input.DocumentId);
            document.PublishDraft();
        }

        public GetEntryFieldValuesOutput GetEntryFieldValues(GetEntryFieldValuesInput input)
        {
            var entry = _entryRepository.FirstOrDefault(p => p.Id == input.EntryId);

            var fields = _revisionRepository.Get(entry.RevisionId).Pages.SelectMany(p => p.Fields).ToList();

            var fieldValues = new List<FieldValueDto>();

            foreach (var fieldValue in entry.FieldValues)
            {
                var field = fields.First(p => p.Id == fieldValue.FieldId);
                fieldValues.Add(new FieldValueDto()
                {
                    Value = fieldValue.Value,
                    FieldName = field.FieldName
                });
            }
            return new GetEntryFieldValuesOutput() { FieldValues = fieldValues };
        }

        public GetDocumentFieldsOutput GetDocumentFields(GetDocumentFieldsInput input)
        {

            var fields = _documentRepository.Get(input.DocumentId)
                   .ActiveRevision.Pages.SelectMany(p => p.Fields)
                   .MapTo<IEnumerable<FieldMetadata>>();
            return new GetDocumentFieldsOutput()
            {
                Fields = fields
            };
        }


        public void DeletePage(DeletePageInput input)
        {
            var revision = _documentRepository.Get(input.DocumentId).DraftRevision;
            var targetPage = revision.Pages.Single(p => p.Id == input.PageId);
            revision.RemovePage(targetPage);
        }


        public GetFieldNamesOutput GetFieldNames(GetFieldNamesInput input)
        {
          var output = new GetFieldNamesOutput() { FieldNames = new List<FieldNameDto>() };
          output.FieldNames.Add(new FieldNameDto() { Name = "FirstName" });
          output.FieldNames.Add(new FieldNameDto() { Name = "LastName" });
          output.FieldNames.Add(new FieldNameDto() { Name = "EmailAddress" });
          output.FieldNames.Add(new FieldNameDto() { Name = "AddressLine1" });
          output.FieldNames.Add(new FieldNameDto() { Name = "AddressLine2" });
          return output;
        }
        public GetEntryDisplayFieldNamesOutput GetEntryDisplayFieldNames(GetEntryDisplayFieldNamesInput input)
        {
          var output = new GetEntryDisplayFieldNamesOutput() { FieldNames = new List<FieldNameDto>() };
          output.FieldNames.Add(new FieldNameDto() { Name = "FirstName" });
          output.FieldNames.Add(new FieldNameDto() { Name = "LastName" });
          output.FieldNames.Add(new FieldNameDto() { Name = "EmailAddress" });
          return output;
        }
        public void SetEntryDisplayFieldNames(SetEntryDisplayFieldNamesInput input)
        {

         
          // TODO: Implement save
        }

        public GetEntryWithNamesOutput GetEntryWithNames(GetEntryWithNamesInput input)
        {
          var output = new GetEntryWithNamesOutput() { EntryValues = new List<EntryValuesDto>() };

          var entry1 = new EntryValuesDto() { FieldValues = new List<FieldValuesDto>() };
          entry1.FieldValues.Add(new FieldValuesDto() { Name = "FirstName", Value = "Jose" });
          entry1.FieldValues.Add(new FieldValuesDto() { Name = "LastName", Value = "Perez" });
          entry1.FieldValues.Add(new FieldValuesDto() { Name = "EmailAddress", Value = "jose@perez.com" });
          output.EntryValues.Add(entry1);

          var entry2 = new EntryValuesDto() { FieldValues = new List<FieldValuesDto>() };
          entry2.FieldValues.Add(new FieldValuesDto() { Name = "FirstName", Value = "Maria" });
          entry2.FieldValues.Add(new FieldValuesDto() { Name = "LastName", Value = "Gonzales" });
          entry2.FieldValues.Add(new FieldValuesDto() { Name = "EmailAddress", Value = "maria@gonzales.com" });
          output.EntryValues.Add(entry2);

          var entry3 = new EntryValuesDto() { FieldValues = new List<FieldValuesDto>() };
          entry3.FieldValues.Add(new FieldValuesDto() { Name = "FirstName", Value = "Pedro" });
          entry3.FieldValues.Add(new FieldValuesDto() { Name = "LastName", Value = "Rodriguez" });
          entry3.FieldValues.Add(new FieldValuesDto() { Name = "EmailAddress", Value = "pedro@rodriguez.com" });
          output.EntryValues.Add(entry3);

          return output;
        }
    }
}
