using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ConsultationSite.Models
{
    public enum AppointmentStatus
    {
        Booked,
        Cancelled,
        Completed
    }

    public enum PaymentStatus
    {
        Paid,
        Unpaid
    }

    public class Appointment
    {

        [Key]
        public int AppointmentID { get; set; }

        [Required]
        public int DoctorID { get; set; }

        [JsonIgnore]
        [ForeignKey("DoctorID")]
        public Doctor? Doctor { get; set; }

        [Required]
        public int PatientID { get; set; }

        [JsonIgnore]
        [ForeignKey("PatientID")]
        public Patient? Patient { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string? TimeSlot { get; set; }

        [Required]
        public AppointmentStatus Status { get; set; }

        [Required]
        public PaymentStatus PaymentStatus { get; set; }


    }
}
