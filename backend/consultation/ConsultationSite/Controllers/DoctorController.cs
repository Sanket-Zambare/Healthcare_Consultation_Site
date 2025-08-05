using ConsultationSite.Data;
using ConsultationSite.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ConsultationSite.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/doctor")]
    public class DoctorController : ControllerBase
    {
        private readonly ConsultationContext _context;

        public DoctorController(ConsultationContext context)
        {
            _context = context;
        }

        // ===================== APPOINTMENTS =====================

        [Authorize(Roles = "Doctor")]
        [HttpGet("appointments/{doctorId}")]
        public async Task<IActionResult> GetAppointments(int doctorId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.DoctorID == doctorId)
                .ToListAsync();

            return Ok(appointments);
        }

        [Authorize(Roles = "Doctor")]
        [HttpGet("appointmentById/{appointmentId}")]
        public async Task<IActionResult> GetAppointmentById(int appointmentId)
        {
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.AppointmentID == appointmentId);

            if (appointment == null)
                return NotFound("Appointment not found");

            return Ok(appointment);
        }

        [Authorize(Roles = "Doctor")]
        [HttpPut("updateAppointment/{appointmentId}")]
        public async Task<IActionResult> UpdateAppointment(int appointmentId, [FromBody] Appointment updated)
        {
            var appointment = await _context.Appointments.FindAsync(appointmentId);
            if (appointment == null)
                return NotFound("Appointment not found");

            appointment.Date = updated.Date;
            appointment.TimeSlot = updated.TimeSlot;
            appointment.Status = updated.Status;
            appointment.PaymentStatus = updated.PaymentStatus;

            await _context.SaveChangesAsync();
            return Ok(appointment);
        }

        [Authorize(Roles = "Doctor")]
        [HttpDelete("cancelAppointment/{appointmentId}")]
        public async Task<IActionResult> CancelAppointment(int appointmentId)
        {
            var appointment = await _context.Appointments.FindAsync(appointmentId);
            if (appointment == null)
                return NotFound("Appointment not found");

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Appointment cancelled." });
        }

        // ===================== DOCTOR PROFILE =====================

        [Authorize(Roles = "Doctor")]
        [HttpGet("profile/{doctorId}")]
        public async Task<IActionResult> GetDoctorProfile(int doctorId)
        {
            var doctor = await _context.Doctors.FindAsync(doctorId);
            if (doctor == null)
                return NotFound("Doctor not found");

            return Ok(doctor);
        }

        [Authorize(Roles = "Doctor")]
        [HttpPut("updateProfile/{doctorId}")]
        public async Task<IActionResult> UpdateDoctorProfile(int doctorId, [FromBody] Doctor updatedDoctor)
        {
            var doctor = await _context.Doctors.FindAsync(doctorId);
            if (doctor == null)
                return NotFound("Doctor not found");

            doctor.Name = updatedDoctor.Name;
            doctor.Email = updatedDoctor.Email;
            doctor.Password = updatedDoctor.Password;
            doctor.Specialization = updatedDoctor.Specialization;
            doctor.Experience = updatedDoctor.Experience;
            doctor.ContactNumber = updatedDoctor.ContactNumber;
            doctor.ProfileStatus = updatedDoctor.ProfileStatus;
            doctor.Doctor_Image = updatedDoctor.Doctor_Image;

            await _context.SaveChangesAsync();
            return Ok(doctor);
        }

        [AllowAnonymous]
        [HttpGet("getDoctorById/{doctorId}")]
        public async Task<IActionResult> GetDoctorById(int doctorId)
        {
            var doctor = await _context.Doctors
                .Include(d => d.Availabilities)
                .Where(d => d.DoctorID == doctorId && d.ProfileStatus == ProfileStatus.Approved)
                .FirstOrDefaultAsync();

            if (doctor == null)
                return NotFound("Doctor not found");

            var doctorDTO = new
            {
                doctor.DoctorID,
                doctor.Name,
                doctor.Specialization,
                Experience = doctor.Experience + " years experience",
                doctor.Doctor_Image,
                Availability = doctor.Availabilities!
                    .Where(a => a.Status == AvailabilityStatus.Available)
                    .Select(a => new
                    {
                        Day = a.Day.ToString(),
                        From = a.From.ToString(@"hh\:mm"),
                        To = a.To.ToString(@"hh\:mm"),
                        Status = a.Status.ToString()
                    })
            };

            return Ok(doctorDTO);
        }

        [AllowAnonymous]
        [HttpGet("check-email")]
        public async Task<IActionResult> CheckDoctorEmailExists([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest("Email is required");

            bool emailExists = await _context.Doctors.AnyAsync(d => d.Email == email);

            return Ok(new { exists = emailExists });
        }



        // ===================== GENERAL DOCTOR LOOKUP =====================

        [AllowAnonymous]
        [HttpGet("getAllDoctors")]
        public async Task<IActionResult> GetAllDoctors()
        {
            var doctors = await _context.Doctors
                .Include(d => d.Availabilities)
                .Where(d => d.ProfileStatus == ProfileStatus.Approved)
                .ToListAsync();

            var doctorDTOs = doctors.Select(d => new
            {
                d.DoctorID,
                d.Name,
                d.Specialization,
                Experience = d.Experience + " years experience",
                d.Doctor_Image,
                Availability = d.Availabilities!
                    .Where(a => a.Status == AvailabilityStatus.Available)
                    .Select(a => new
                    {
                        Day = a.Day.ToString(),
                        From = a.From.ToString(@"hh\:mm"),
                        To = a.To.ToString(@"hh\:mm"),
                        Status = a.Status.ToString()
                    })
            });

            return Ok(doctorDTOs);
        }

        [AllowAnonymous]
        [HttpGet("doctorByName/{name}")]
        public async Task<IActionResult> GetDoctorByName(string name)
        {
            var doctors = await _context.Doctors
                .Include(d => d.Availabilities)
                .Where(d => d.Name.ToLower().Contains(name.ToLower()) &&
                            d.ProfileStatus == ProfileStatus.Approved)
                .ToListAsync();

            var doctorDTOs = doctors.Select(d => new
            {
                d.DoctorID,
                d.Name,
                d.Specialization,
                Experience = d.Experience + " years experience",
                d.Doctor_Image,
                Availability = d.Availabilities!
                    .Where(a => a.Status == AvailabilityStatus.Available)
                    .Select(a => new
                    {
                        Day = a.Day.ToString(),
                        From = a.From.ToString(@"hh\:mm"),
                        To = a.To.ToString(@"hh\:mm"),
                        Status = a.Status.ToString()
                    })
            });

            return Ok(doctorDTOs);
        }
    }
}
