using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class CandidateDto
    {
        public int Id {get;set;}

        public string CandidateName {get;set;}

         public string PhotoUrl { get; set; }

         public string PartyName {get;set;}

        public string District {get;set;}

        public string GramPanchayat {get;set;}

        //new-added
        public string RegionCode {get;set;}

        //new-added
        public int VoteCount{get;set;}

        public List<PhotoDto> Photos {get;set;}
    }
}