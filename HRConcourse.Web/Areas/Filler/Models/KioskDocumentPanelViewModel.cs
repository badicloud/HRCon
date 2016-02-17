using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRConcourse.Web.Areas.Filler.Models
{
    public class KioskDocumentPanelViewModel
    {
        public int RevisionId { get; set; }
        public List<KioskPageFillViewModel> Pages { get; set; }

    }

    public class KioskPageFillViewModel
    {
        public int PageId { get; set; }
        public int Number { get; set; }

    }
}
