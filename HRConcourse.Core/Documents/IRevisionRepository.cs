using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Abp.Domain.Repositories;
using HRConcourse.Documents;

namespace HRConcourse.EntityFramework.Repositories
{
    public interface IRevisionRepository  : IRepository<Revision>
    {
    }
}
