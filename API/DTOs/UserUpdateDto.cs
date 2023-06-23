using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class UserUpdateDto
    {
        public string Username{get; set;}
        public string VoterIdNumber {get;set;}

        public string UserEmailId {get;set;}
    }
}