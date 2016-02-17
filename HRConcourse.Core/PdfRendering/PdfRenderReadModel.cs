using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace HRConcourse.PdfRendering
{
    public class EntryPdfRenderReadModel : AuditedEntity
    {
        public int EntryId { get; set; }
        public byte[] PdfFile { get; set; }
    }
}
