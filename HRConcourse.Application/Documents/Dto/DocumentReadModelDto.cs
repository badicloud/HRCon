using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HRConcourse.ReadModels;

namespace HRConcourse.Documents.Dto
{
  
        [AutoMapFrom(typeof(DocumentReadModel))]
        public class DocumentReadModelDto : EntityDto
        {
            public int TenantId { get; set; }

            public int DocumentId { get; set; }

            public string Name { get; set; }

            public DateTime CreationDate { get; set; }

            public string Packages { get; set; }

            public bool RequiresHardSignature { get; set; }

            public bool IsReadOnly { get; set; }

            public int ActiveRevisionId { get; set; }

            public int WorkingRevisionId { get; set; }

            public int WorkingRevisionNumber { get; set; }

            public int InstanceCount { get; set; }

            public int ActiveRevisionNumber { get; set; }

            public int? DocumentTypeId { get; set; }

            public string DocumentTypeName { get; set; }

            public IEnumerable<string> Languages { get; set; }
        }
    
}
