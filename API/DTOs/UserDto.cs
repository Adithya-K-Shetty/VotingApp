using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    //All these data gets stored at local persistent storage
    public class UserDto
    {
        public string Username{get; set;}
        public string Token{get; set;}

        public string DocumentUrl { get; set; }
        public string District {get;set;}

        public string GramPanchayat {get;set;}

        public bool HasVoted {get;set;}
        public string VoterIdNumber {get;set;}
        public List<PhotoDto> Documents {get;set;}
    }
}