using System;
using Abp.Domain.Entities.Auditing;

namespace HRConcourse.Recipients
{
    public class File : AuditedEntity
    {
   
        public byte[] Data { get; set; }
       
        public String Name { get; set; }
    
        public String Extension { get; set; }
    
        public string MimeType { get; set; }
    }
}