using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

namespace ConsultationSite.Models
{
    public enum ProfileStatus
    {
        Approved,
        Pending
    }

    [Table("Doctor")]
    public class Doctor
    {
        [Key]
        public int DoctorID { get; set; }

        [Required(ErrorMessage = "Name is required")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$",
            ErrorMessage = "Password must contain at least one lowercase, one uppercase, and one number")]
        public string? Password { get; set; }

        public string? Specialization { get; set; }

        [Required(ErrorMessage = "Medical degree is required")]
        [RegularExpression(@"^(MD|MBBS)$", ErrorMessage = "Only MD or MBBS degrees are accepted")]
        public string? Degree { get; set; }

        [Range(5, 50, ErrorMessage = "Experience must be between 5 and 50 years")]
        public int Experience { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ProfileStatus? ProfileStatus { get; set; }

        [Required(ErrorMessage = "Contact number is required")]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Contact number must be a 10-digit number")]
        public string ContactNumber { get; set; }

        public ICollection<DoctorAvailability>? Availabilities { get; set; }

        public string? Doctor_Image { get; set; }
    }
}
