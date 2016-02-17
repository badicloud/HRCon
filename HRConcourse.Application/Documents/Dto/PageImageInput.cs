using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Abp.Application.Services.Dto;

namespace HRConcourse.Documents.Dto
{
    public class PageImageInput: IInputDto
    {
        public int PageNumber { get; set; }
        public int ImageId { get; set; }
    }
}
