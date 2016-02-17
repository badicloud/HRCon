using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.UI.WebControls;
using Abp;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.Runtime.Validation;
using HRConcourse.Documents;
using HRConcourse.Entries;
using HRConcourse.ReadModels;
using HRConcourse.Recipients.Dto;
using HRConcourse.Users;
using Microsoft.AspNet.Identity;

namespace HRConcourse.Recipients
{
    [AbpAuthorize()]
    public class EntriesAppService : HRConcourseAppServiceBase, IRecipientsAppService
    {
        private IRecipientRepository _recipientRepository;
        private IDocumentRepository _documentRepository;
        private IRepository<MergeField> _mergeFieldsRepository;
        private IRepository<FillRequestReadModel> _fillRequestReadModelRepository;

        public EntriesAppService(IRecipientRepository recipientRepository,
            IDocumentRepository documentRepository, 
            IRepository<MergeField> mergeFieldsRepository, 
            IRepository<FillRequestReadModel> fillRequestReadModelRepository)
        {
            _mergeFieldsRepository = mergeFieldsRepository;
            _documentRepository = documentRepository;
            _recipientRepository = recipientRepository;
            _fillRequestReadModelRepository = fillRequestReadModelRepository;
        }

        public void CreateRecipient(CreateRecipientInput input)
        {
            var recipient = new Recipient
            {
                ExternalId = input.ExternalId,
                EmailAddress = input.EmailAddress,
                UserName = input.UserName,
                Name = input.Name,
                Surname = input.Surname
            };
            if (string.IsNullOrEmpty(input.Password))
                recipient.Password = new PasswordHasher().HashPassword(RandomString.Generate(20));
            else
            {
                recipient.Password = new PasswordHasher().HashPassword(input.Password);
            }

            _recipientRepository.InsertAndGetId(recipient);
        }

        public GetRecipientsOutput GetRecipients()
        {
            var res = _recipientRepository.GetAllList().MapTo<IEnumerable<RecipientDto>>();
            return new GetRecipientsOutput() { Recipients = res };
        }

        public RecipientDto GetRecipient(GetRecipientInput input)
        {
            return _recipientRepository.FirstOrDefault(p => p.Id == input.RecipientId).MapTo<RecipientDto>();
        }

        public void UpdateRecipient(UpdateRecipientInput input)
        {
            var recipient = _recipientRepository.FirstOrDefault(p => p.Id == input.RecipientId);
            if (recipient != null)
            {
                recipient.EmailAddress = input.EmailAddress;
                recipient.Name = input.Name;
                recipient.Surname = input.Surname;
            }
        }

        public void DeleteRecipient(DeleteRecipientInput input)
        {
            _recipientRepository.Delete(p => p.Id == input.RecipientId);
        }

        public void SendFillRequest(SentDocumentInput input)
        {
            var document = _documentRepository.Get(input.documentId);
            var recipient = _recipientRepository.Get(input.recipientId);
            var mergeFields = _mergeFieldsRepository.GetAllList();

            if (input.MergeFieldValues != null)
            {
                var mergeFieldValues = new List<MergeFieldValue>();

                foreach (var mergeFieldValueDto in input.MergeFieldValues)
                {
                    var mergeField = mergeFields.FirstOrDefault(p => p.Key == mergeFieldValueDto.MergeFieldKey);
                    if (mergeField == null)
                        throw new AbpValidationException(string.Format(
                            "Provided merge field with key {0} doesnt exist", mergeFieldValueDto.MergeFieldKey));
                    mergeFieldValues.Add(new MergeFieldValue()
                    {
                        MergeFieldId = mergeField.Id,
                        Value = mergeFieldValueDto.Value
                    });
                }
                recipient.RequestFill(document, mergeFieldValues);
            }
            else
            {

                recipient.RequestFill(document);
            }
        }


        public GetFillRequestsOutput GetFillRequests(GetFillRequestsInput input)
        {
          var auxResult = new GetFillRequestsOutput
          {
            Documents = _fillRequestReadModelRepository.GetAll().Where(p => p.RecipientId == input.RecipientId).ToList().MapTo<IEnumerable<FillRequestReadModelDto>>()
          };
          return auxResult;
        }

    }
}
