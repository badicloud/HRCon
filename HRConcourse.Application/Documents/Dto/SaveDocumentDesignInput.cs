using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Abp.Application.Services.Dto;

namespace HRConcourse.Documents
{
    public class SaveDocumentDesignInput : IInputDto
    {
        public int DocumentId { get; set; }
        public IEnumerable<PageDesignInput> PagesDesign { get; set; }
    }

    public class PageDesignInput
    {
      public int PageNumber { get; set; }
      public string Fields { get; set; }
    }
}
