namespace API.DTOs
{
    public class MemberDto
    {
         public int Id { get; set; }

         // [Required] :- makes the nullable property of userName false
        public string UserName { get; set; }

        //this is the users main photo
        public string PhotoUrl { get; set; }

        public int Age {get; set;}

        public string KnowAs {get; set;}

        public DateTime Created {get; set;}

        public DateTime LastActive {get; set;} = DateTime.UtcNow;

        public string Gender {get; set;}

        public string Introduction {get; set;}

        public string LookingFor {get;set;}

        public string Interests {get; set;}

        public string City {get; set;}

        public string Country {get; set;}

        public List<PhotoDto> Photos {get;set;}

    }
}