using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace HRConcourse.Web.Models
{
    public class PrintPageModel
    {
        public int PageNumber { get; set; }
        public int PageInstanceId { get; set; }
        public string Html { get; set; }
        public int? ImageId { get; set; }

        public string MetadataJSON { get; set; }
        public string SubmittedDataJson { get; set; }

        public Dictionary<int, List<SelectListItem>> SelectPrefixedValues { get; private set; }

        public PrintPageModel()
        {
            SelectPrefixedValues = new Dictionary<int, List<SelectListItem>>();
        }
    }


}
