using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nito.AsyncEx;

namespace HRConcourse.Documents
{
    public class GetDocumentDesignOutput
    {
        public int DocumentId { get; set; }
        public String Name { get; set; }
        public IList<PagesOut> Pages { get; set; }
        public bool IsDraft { get; set; }
      
      public GetDocumentDesignOutput()
        {
            Pages = new List<PagesOut>();
        }
    }
    public class PagesOut
    {
        public Int32 Number { get; set; }
        public String Fields { get; set; }
        public Int32? ImageId { get; set; }
        public Int32 PageId { get; set; }
        public Int32 RevistionId { get; set; }
    }
}
