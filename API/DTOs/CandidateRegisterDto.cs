using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class CandidateRegisterDto
    {
        public string CandidateName {get;set;}
        public string PartyName {get;set;}

        public string District {get;set;}

        public string GramPanchayat {get;set;}

        //new-added
        public string RegionCode {get;set;}

         public int VoteCount{get;set;}
    }
}