using Abp.Domain.Entities;
using Abp.EntityFramework;
using Abp.EntityFramework.Repositories;

namespace HRConcourse.EntityFramework.Repositories
{
    public abstract class HRConcourseRepositoryBase<TEntity, TPrimaryKey> : EfRepositoryBase<HRConcourseDbContext, TEntity, TPrimaryKey>
        where TEntity : class, IEntity<TPrimaryKey>
    {
        protected HRConcourseRepositoryBase(IDbContextProvider<HRConcourseDbContext> dbContextProvider)
            : base(dbContextProvider)
        {

        }

        //add common methods for all repositories
    }

    public abstract class HRConcourseRepositoryBase<TEntity> : HRConcourseRepositoryBase<TEntity, int>
        where TEntity : class, IEntity<int>
    {
        protected HRConcourseRepositoryBase(IDbContextProvider<HRConcourseDbContext> dbContextProvider)
            : base(dbContextProvider)
        {

        }

        //do not add any method here, add to the class above (since this inherits it)
    }
}
