using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.UI.WebControls;

namespace HRConcourse.Documents
{
    public class AddDocumentPagesFromPdfInput
    {
        public byte[] PdBytes{ get; set; }
        public int DocumentId { get; set; }
    }
}
