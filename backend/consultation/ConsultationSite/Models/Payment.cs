    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    namespace ConsultationSite.Models
    {
        [Table("Payment")]
        public class Payment
        {
            [Key]
            public int PaymentID { get; set; }

            [Required]
            public int AppointmentID { get; set; }

            [ForeignKey("AppointmentID")]
            public Appointment? Appointment { get; set; }

            public int? PatientID { get; set; }

            [ForeignKey("PatientID")]
            public virtual Patient? Patient { get; set; }

            public decimal? Amount { get; set; }

            public DateTime? PaymentDate { get; set; }

            public DateOnly EndDate { get; set; }

            public string? PaymentMode { get; set; } // e.g. Razorpay, UPI, CreditCard

            public string? Status { get; set; } // e.g. Success, Failed, Pending

            public string? RazorpayOrderId { get; set; } // Useful for tracking

            public string? RazorpayPaymentId { get; set; }

            public string? RazorpaySignature { get; set; }
        }
    }
