using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using HRConcourse.Documents.Dto;

namespace HRConcourse.Documents
{
    [AutoMapTo(typeof(Document))]
    public class CreateDocumentWithImagesInput: IInputDto
    {
        public string Name { get; set; }
        public bool IsReadOnly { get; set; }
        public bool RequiresHardSignature { get; set; }
        public IEnumerable<PageImageInput> PageImages { get; set; }
    }
}
