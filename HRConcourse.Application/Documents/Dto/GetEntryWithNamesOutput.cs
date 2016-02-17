using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Abp.Application.Services.Dto;

namespace HRConcourse.Documents
{
    public class GetEntryWithNamesOutput : IOutputDto
    {
        public ICollection<EntryValuesDto> EntryValues { get; set; }
    }
    public class EntryValuesDto
    {
        public int EntryId { get; set; }
        public ICollection<FieldValuesDto> FieldValues { get; set; }
    }

    public class FieldValuesDto
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }
}
