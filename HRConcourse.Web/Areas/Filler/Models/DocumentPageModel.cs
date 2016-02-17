using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HRConcourse.Documents;

namespace HRConcourse.Web.Areas.Filler.Models
{
    public partial class DocumentPageModel
    {

        public DocumentPageModel()
        {
            this.PageFields = new List<Field>();
        }


        public short Number { get; set; }


        public bool Instantiate { get; set; }

        public Guid DocumentId { get; set; }




        public List<Field> PageFields { get; private set; }

        public int PageImageId { get; set; }


        public string Html
        {
            get
            {
                var auxHtml = "";

                foreach (var field in PageFields)
                {
                    auxHtml += field.Html;
                }
                return auxHtml;

            }
        }





    }
}
