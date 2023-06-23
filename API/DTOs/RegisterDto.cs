using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string UserName{get; set;}

        [Required]
        public string UserEmailId {get;set;}

        [Required]
        public string VoterIdNumber {get;set;}

        [Required]
        public DateOnly? DateOfBirth { get; set; } //optional to make required work

        [Required]
        public string District { get; set; }

        [Required]
         public string GramPanchayat {get; set;}

       
        [Required]
        [StringLength(8,MinimumLength =4)]
        public string Pass{get; set;}
    }
}