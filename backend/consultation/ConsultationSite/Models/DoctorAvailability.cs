using System.Text.Json.Serialization;

namespace ConsultationSite.Models
{
    public enum AvailabilityStatus
    {
        Available,
        Unavailable,
        Busy
    }
    public class DoctorAvailability
    {
        public int DoctorAvailabilityID { get; set; }

        public int DoctorID { get; set; }
        public Doctor? Doctor { get; set; }

       // [JsonConverter(typeof(JsonStringEnumConverter))]
        public DayOfWeek Day { get; set; }

        public TimeSpan From { get; set; }
        public TimeSpan To { get; set; }

        public AvailabilityStatus Status { get; set; }
    }
}
