using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.EntityFramework;
using HRConcourse.Documents;
using HRConcourse.Entries;
using HRConcourse.Recipients;

namespace HRConcourse.EntityFramework.Repositories
{
    public class DocumentEntryRepository : HRConcourseRepositoryBase<DocumentEntry>, IDocumentEntryRepository
    {
        public DocumentEntryRepository(IDbContextProvider<HRConcourseDbContext> dbContextProvider)
            : base(dbContextProvider)
        {

        }


    }
}
