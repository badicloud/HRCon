using Abp.EntityFramework;
using HRConcourse.Documents;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRConcourse.EntityFramework.Repositories
{
    public class DocumentRepository : HRConcourseRepositoryBase<Document>, IDocumentRepository
    {
        public DocumentRepository(IDbContextProvider<HRConcourseDbContext> dbContextProvider)
            : base(dbContextProvider)
        {

        }

        public override Document Get(int id)
        {
            return base.GetAll().Include(p => p.DraftRevision).Include(p => p.ActiveRevision).FirstOrDefault(p => p.Id == id);
        }
    }
}
