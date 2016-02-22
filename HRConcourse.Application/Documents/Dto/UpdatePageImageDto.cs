using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRConcourse.Documents.Dto
{
    public class UpdatePageImageDto
    {
        public int DocumentId { get; set; }
        public int PageId { get; set; }
        public int ImageId { get; set; }
    }
}
