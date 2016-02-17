using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities;
using Abp.MultiTenancy;

namespace HRConcourse.ReadModels
{
    public class DocumentReadModel : Entity, IMustHaveTenant
    {
        public int DocumentId { get; set; }

        public int TenantId { get; set; }

        public string Name { get; set; }
   
        public DateTime CreationDate { get; set; }

        public string Packages { get; set; }
   
        public bool RequiresHardSignature { get; set; }
   
        public bool IsReadOnly { get; set; }
   
        public int? ActiveRevisionId { get; set; }

        public int WorkingRevisionId { get; set; }

        public int WorkingRevisionNumber { get; set; }

        public int InstanceCount { get; set; }
   
        public int  ActiveRevisionNumber { get; set; }
        
        public int? DocumentTypeId { get; set; }
   
        public string DocumentTypeName { get; set; }
    }
}
