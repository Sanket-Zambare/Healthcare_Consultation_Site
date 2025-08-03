using System.ComponentModel.DataAnnotations;

namespace ConsultationSite.Models
{
    public enum Gender
    {
        Male,
        Female,
        Other
    }

    public class Patient
    {

        [Key]
        public int PatientID { get; set; }

        [Required]
        public string? Name { get; set; }

        [Required, EmailAddress]
        public string? Email { get; set; }

        [Required]
        public string? Password { get; set; }

        [Required]
        public Gender Gender { get; set; }  // <- Updated here

        [Required]
        public DateTime DOB { get; set; }

        [Required, Phone]
        public string? ContactNumber { get; set; }

        public string? MedicalHistory { get; set; }

        public string? Patient_Image { get; set; }
    }
}
