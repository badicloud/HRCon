using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Abp.Application.Services.Dto;

namespace HRConcourse.Documents
{
    public class GetDocumentsInput : IInputDto
    {
        public bool OnlyWithWorkingRevision { get; set; }
        public string SearchString { get; set; }
    }
}
