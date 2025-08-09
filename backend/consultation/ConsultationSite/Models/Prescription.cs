using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConsultationSite.Models
{
    public class Prescription
    {
        [Key]
        public int PrescriptionID { get; set; }

        [Required]
        public int AppointmentID { get; set; }

        [ForeignKey("AppointmentID")]
        public Appointment? Appointment { get; set; }

        [Required]
        public int DoctorID { get; set; }

        [ForeignKey("DoctorID")]
        public Doctor? Doctor { get; set; }

        [Required]
        public int PatientID { get; set; }

        [ForeignKey("PatientID")]
        public Patient? Patient { get; set; }

        [Required]
        public DateTime DateIssued { get; set; }

        [Required]
        public string? MedicationDetails { get; set; }

    }
}