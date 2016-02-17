using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace HRConcourse.Documents
{
    public class GetDocumentFieldsInput
    {
        [Required]
        public int DocumentId { get; set; }
    }
}
