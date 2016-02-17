using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;

namespace HRConcourse.Documents
{
    public class SearchEntriesOutput
    {
        public int Skip { get; set; }
        public int Take { get; set; }
        public int TotalCount { get; set; }

        //
        public List<ExpandoObject> Entries { get; set; }

    }
}
