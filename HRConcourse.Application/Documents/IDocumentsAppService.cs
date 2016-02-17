using Abp.Application.Services;
using Abp.Authorization;
using Abp.Configuration;
using Abp.Domain.Uow;
using Abp.Localization;
using Abp.Runtime.Session;
using Castle.Core.Logging;
using HRConcourse.Documents.Dto;
using HRConcourse.MultiTenancy;
using HRConcourse.Users;

namespace HRConcourse.Documents
{

    public interface IDocumentsAppService : IApplicationService
    {
        CreateDocumentOutput CreateDocument(CreateDocumentInput input);
        CreateDocumentWithImagesOutput CreateDocumentWithImages(CreateDocumentWithImagesInput input);
        void AddPage(AddPageInput input);
        void DeletePage(DeletePageInput input);
        void UpdateDocument(UpdateDocumentInput input);
        GetDocumentsOutput GetDocuments(GetDocumentsInput input);
        void DeleteDocument(DeleteDocumentDto input);
        GetDocumentInfoOutput GetDocumentInfo(GetDocumentInfoInput input);
        GetDocumentDesignOutput GetDocumentDesign(GetDocumentDesignInput input);
        SaveDocumentDesignOutput SaveDocumentDesign(SaveDocumentDesignInput input);
        void PublishDraft(PublishDraftInput input);
        GetEntryFieldValuesOutput GetEntryFieldValues(GetEntryFieldValuesInput input);
        GetDocumentFieldsOutput GetDocumentFields(GetDocumentFieldsInput input);
        GetFieldNamesOutput GetFieldNames(GetFieldNamesInput input);
        GetEntryDisplayFieldNamesOutput GetEntryDisplayFieldNames(GetEntryDisplayFieldNamesInput input);
        void SetEntryDisplayFieldNames(SetEntryDisplayFieldNamesInput input);
        GetEntryWithNamesOutput GetEntryWithNames(GetEntryWithNamesInput input);
    }
}

