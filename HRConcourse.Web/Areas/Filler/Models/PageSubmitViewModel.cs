using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using HRConcourse.Documents;
using HRConcourse.Recipients;

namespace HRConcourse.Web.Areas.Filler.Models
{
    public class PageViewModel
    {
        public string SubmittedDataJson { get; set; }
        public string FormView { get; set; }
        public bool Denied { get; set; }
        public string NotApprovedReason { get; set; }
        public string UserComments { get; set; }
        //Fields in json
        public string MetadataJSON { get; set; }
        public int PageNumber { get; set; }
        public int? PageImageId { get; set; }
        public int PageId { get; set; }
        public int RevisionId { get; set; }


     

    }
}
