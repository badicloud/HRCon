using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Abp.Application.Services.Dto;
using HRConcourse.Entries;
using HRConcourse.Documents.Dto;

namespace HRConcourse.Documents
{
  public class GetEntryFieldValuesOutput : IOutputDto
  {
    public IEnumerable<FieldValueDto> FieldValues { get; set; }
  }
}
