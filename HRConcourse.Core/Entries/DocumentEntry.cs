using System.Collections.Generic;
using Abp.Domain.Entities.Auditing;
using HRConcourse.Documents;
using HRConcourse.Recipients;
using HRConcourse.Users;

namespace HRConcourse.Entries
{
    public class DocumentEntry : FullAuditedEntity
    {
        public virtual List<FieldValue> FieldValues { get; set; }

        public int RevisionId { get; set; }
    }

}
