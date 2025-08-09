using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

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

        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$",
            ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, and one number")]
        public string? Password { get; set; }

        [Required(ErrorMessage = "Gender is required")]
        public Gender Gender { get; set; }

        [Required(ErrorMessage = "Date of Birth is required")]
        [DataType(DataType.Date)]
        [CustomValidation(typeof(Patient), nameof(ValidateDOB))]
        public DateTime DOB { get; set; }

        [Required(ErrorMessage = "Contact number is required")]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Contact number must be a 10-digit number")]
        public string? ContactNumber { get; set; }

        [StringLength(1000, ErrorMessage = "Medical history can't exceed 1000 characters")]
        public string? MedicalHistory { get; set; }

        [Url(ErrorMessage = "Patient image must be a valid URL")]
        public string? Patient_Image { get; set; }

        // Custom validator method for DOB
        public static ValidationResult? ValidateDOB(DateTime dob, ValidationContext context)
        {
            if (dob > DateTime.Today)
            {
                return new ValidationResult("Date of Birth cannot be in the future.");
            }
            return ValidationResult.Success;
        }
    }
}
