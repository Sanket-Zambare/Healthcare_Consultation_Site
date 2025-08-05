using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConsultationSite.Models
{
    public enum UserType
    {
        Patient,
        Doctor
    }
    public class Message
    {
        [Key]
        public int MessageID { get; set; }

        [Required]
        public int SenderID { get; set; }

        [Required]
        public UserType SenderType { get; set; }

        [Required]
        public int ReceiverID { get; set; }

        [Required]
        public UserType ReceiverType { get; set; }

        [Required]
        public int AppointmentID { get; set; }

        [ForeignKey("AppointmentID")]
        public Appointment? Appointment { get; set; }

        [Required]
        public DateTime Timestamp { get; set; } = DateTime.Now;

        [Required]
        [MaxLength(1000)]
        public string? Content { get; set; }
    }
}
