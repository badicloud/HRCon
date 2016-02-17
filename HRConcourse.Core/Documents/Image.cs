using System;
using Abp.Domain.Entities;

namespace HRConcourse.Documents
{
    public class Image : Entity
    {
        public byte[] Data { get; set; }
    }
}