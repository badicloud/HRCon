using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Abp.Application.Services.Dto;

namespace HRConcourse.Documents
{
  public class GetFieldNamesOutput : IOutputDto
  {
    public ICollection<FieldNameDto> FieldNames { get; set; }
  }

  public class FieldNameDto
  {
    public string Name { get; set; }
  }
}
