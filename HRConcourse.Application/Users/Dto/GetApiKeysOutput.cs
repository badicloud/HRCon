using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.AutoMapper;

namespace HRConcourse.Users.Dto
{
    [AutoMapFrom(typeof(User))]
    public class GetApiKeysOutput
    {
        public string ClientSecret { get; set; }
        public string ClientId { get; set; }
    }
}
