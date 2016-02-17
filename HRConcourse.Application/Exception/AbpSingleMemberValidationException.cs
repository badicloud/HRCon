using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Runtime.Validation;

namespace HRConcourse.Exception
{
    public class AbpSingleMemberValidationException : AbpValidationException
    {
        public AbpSingleMemberValidationException(string error, string member)
            : base("Error ocurred", new List<ValidationResult>()
             {
                 new ValidationResult(error,new List<String>(){member})
             })
        {

        }
    }
}
