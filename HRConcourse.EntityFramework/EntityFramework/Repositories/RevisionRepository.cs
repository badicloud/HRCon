using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.EntityFramework;
using HRConcourse.Documents;
using HRConcourse.Users;

namespace HRConcourse.EntityFramework.Repositories
{
    public class RevisionRepository : HRConcourseRepositoryBase<Revision>, IRevisionRepository
    {

        public RevisionRepository(IDbContextProvider<HRConcourseDbContext> dbContextProvider)
            : base(dbContextProvider)
        {

        }


        public override Revision Get(int id)
        {
            return base.GetAll().Include(p => p.Pages).Include(d => d.Pages.Select(p => p.Fields)).FirstOrDefault(p => p.Id == id);
        }
    }
}
