using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Abp.Application.Services.Dto;
using HRConcourse.Documents.Dto;

namespace HRConcourse.Documents
{
    public class GetDocumentsOutput : IOutputDto
    {
        public IEnumerable<DocumentReadModelDto> Documents { get; set; }
    }
}
