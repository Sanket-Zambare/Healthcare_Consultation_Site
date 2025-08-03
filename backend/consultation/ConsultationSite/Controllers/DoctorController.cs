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

        [Authorize(Roles = "Doctor")]
        [HttpDelete("deleteProfile/{doctorId}")]
        public async Task<IActionResult> DeleteDoctorProfile(int doctorId)
        {
            var doctor = await _context.Doctors.FindAsync(doctorId);
            if (doctor == null)
                return NotFound("Doctor not found");

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Doctor profile deleted successfully." });
        }

        // ===================== GENERAL DOCTOR LOOKUP =====================

        [Authorize(Roles = "Admin,Patient,Doctor")]
        [HttpGet("getAllDoctors")]
        public async Task<IActionResult> GetAllDoctors()
        {
            var doctors = await _context.Doctors.ToListAsync();
            return Ok(doctors);
        }

        [Authorize(Roles = "Admin,Patient,Doctor")]
        [HttpGet("doctorByName/{name}")]
        public async Task<IActionResult> GetDoctorByName(string name)
        {
            var doctors = await _context.Doctors
                .Where(d => d.Name.ToLower().Contains(name.ToLower()))
                .ToListAsync();

            return Ok(doctors);
        }
    }
}
