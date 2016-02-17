using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRConcourse.Documents
{
    public class MergeField : Entity ,IMustHaveTenant
    {
        public string Key { get; set; }

        public string TestValue { get; set; }

        public bool IsForPostback { get; set; }

        public MergeFieldType Type { get; set; }

        public int TenantId { get; set; }
    }

    public enum MergeFieldType
    {
    
        String = 1,

        Decimal = 2,

        Date = 3
    }
}
