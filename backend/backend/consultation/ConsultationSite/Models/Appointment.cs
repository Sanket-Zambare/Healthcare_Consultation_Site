using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        [ForeignKey("DoctorID")]
        public Doctor? Doctor { get; set; }

        [Required]
        public int PatientID { get; set; }

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
