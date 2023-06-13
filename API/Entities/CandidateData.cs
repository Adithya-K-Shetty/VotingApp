using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class CandidateData
    {
        public int Id {get;set;}
        public string CandidateName {get;set;}

        public string PartyName {get;set;}

        public string District {get;set;}

        public string GramPanchayat {get;set;}

        public string RegionCode {get;set;}

        public int VoteCount {get;set;}

         public List<Photo> Photos {get;set;} = new();
    }
}