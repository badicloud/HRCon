using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HRConcourse.Documents
{
    public class SearchEntriesInput
    {
        public int Skip { get; set; }
        public int Take { get; set; }
        public int DocumentId { get; set; }
        public string SearchString { get; set; }
    }
}
