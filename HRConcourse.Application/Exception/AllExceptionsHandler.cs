using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.Events.Bus.Exceptions;
using Abp.Events.Bus.Handlers;

namespace HRConcourse.Exception
{
    public class AllExceptionsHandler : IEventHandler<AbpHandledExceptionData>, ITransientDependency
    {
        public void HandleEvent(AbpHandledExceptionData eventData)
        {
        
        }
    }
}
