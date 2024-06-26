using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Documents")]
    public class Document
    {
         public int Id {get;set;}
        public string Url {get; set;}

        public string PublicId {get;set;}
         public int AppUserId {get;set;}

        public AppUser AppUser { get; set; }
    }
}