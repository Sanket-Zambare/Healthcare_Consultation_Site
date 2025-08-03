using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

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

        public string? Name { get; set; }

        public string? Email { get; set; }

        public string? Password { get; set; }

        public string? Specialization { get; set; }

        public int Experience { get; set; }  // years of experience

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ProfileStatus? ProfileStatus { get; set; }

        public string  ContactNumber { get; set; }

        // Navigation property
        public ICollection<DoctorAvailability>? Availabilities { get; set; }

        public string? Doctor_Image { get; set; }
    }
}

