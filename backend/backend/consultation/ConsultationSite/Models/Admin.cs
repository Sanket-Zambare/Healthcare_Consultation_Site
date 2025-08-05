using System.ComponentModel.DataAnnotations;

namespace ConsultationSite.Models
{
    public class Admin
    {

        [Key]
        public int AdminID { get; set; }

        [Required]
        [MaxLength(100)]
        public string? Username { get; set; }

        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string? Password { get; set; }
    }
}
