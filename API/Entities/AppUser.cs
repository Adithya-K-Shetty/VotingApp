using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    //so when we inherit IdentityUser
    //the id defined by us will overwrite the string id property that is being inherited
    //so we explicitly specify that id has to be integer
    //by using <int>
    public class AppUser : IdentityUser<int> 
    {
        
        public DateOnly DateOfBirth {get; set;}

        public string VoterIdNumber {get;set;}

        public string District {get; set;}

       public string GramPanchayat {get; set;}

       public bool HasVoted {get;set;}

        public List<Message> MessagesSent { get; set; }

        public List<Message> MessagesReceived { get; set; }

         public ICollection<AppUserRole> UserRoles {get;set;}
    }
}