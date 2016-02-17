using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using Abp.Application.Services.Dto;

namespace HRConcourse.Recipients
{
    public class CreateRecipientInput : IInputDto
    {
        public Guid ExternalId { get; set; }
        [Required]
        public string EmailAddress { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Surname { get; set; }
    
        public string Password { get; set; }

        [Required]
        public string UserName { get; set; }
    }
}
