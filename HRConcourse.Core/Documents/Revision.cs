using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using HRConcourse.Entries;

namespace HRConcourse.Documents
{
    public class Revision : AuditedEntity,  ICloneable
    {

    

        public virtual List<Page> Pages { get;set;}


        public Revision()
        {
            Pages = new List<Page>();
        }
        public Page AddBlankPage()
        {

            var page = new Page { Number = Pages.Count() + 1 };
            Pages.Add(page);
            return page;
        }

        public void AddPage(Page page)
        {
            page.Number = Pages.Count() + 1 ;
            Pages.Add(page);
       
        }

        public void RemovePage(Page page)
        {
            Pages.Remove(page);
            var i = 1;
            foreach (var currentPage in Pages.OrderBy(p => p.Number))
            {
                currentPage.Number = i;
                i++;
            }
        }

        public object Clone()
        {
            var newRevision = new Revision() { };
            foreach (var page in this.Pages)
            {
                var newPage = page.Clone();
                newRevision.AddPage((Page)newPage);
            }
            return newRevision;
        }
    }
}
