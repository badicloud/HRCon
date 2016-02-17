using Abp.Domain.Entities;

namespace HRConcourse.Entries
{
    public class FieldValue : Entity<long>
    {
        public long FieldId { get; set; }
        public string Value { get; set; }
    }
}