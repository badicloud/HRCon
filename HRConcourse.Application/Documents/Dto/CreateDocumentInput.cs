using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using HRConcourse.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRConcourse.Documents.Dto
{
    [AutoMapTo(typeof(Document))]
    public class CreateDocumentInput : IInputDto
    {
        public string Name { get; set; }
        public bool IsReadOnly { get; set; }
        public bool RequiresHardSignature { get; set; }
    }
}
