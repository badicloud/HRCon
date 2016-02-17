using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using HRConcourse.Users;

namespace HRConcourse.Web.Models.Account
{
    public class LoginViewModel : IInputDto
    {
        public string TenancyName { get; set; }

        [Required]
        [StringLength(User.MaxEmailAddressLength)]
        public string UsernameOrEmailAddress { get; set; }

        [Required]
        [StringLength(User.MaxPlainPasswordLength)]
        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }
}