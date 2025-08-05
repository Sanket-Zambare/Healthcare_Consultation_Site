using ConsultationSite.Data;
using ConsultationSite.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ConsultationSite.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/patient")]
    public class PatientController : Controller
    {
        private readonly ConsultationContext _context;

        public PatientController(ConsultationContext context)
        {
            _context = context;
        }

        // ===================== PATIENT PROFILE =====================

        [Authorize(Roles = "Admin,Patient")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPatientById(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return NotFound("Patient not found");

            return Ok(patient);
        }

        [Authorize(Roles = "Admin,Patient")]
        [HttpGet("by-name/{name}")]
        public async Task<IActionResult> GetPatientByName(string name)
        {
            var patients = await _context.Patients
                .Where(p => p.Name.ToLower().Contains(name.ToLower()))
                .ToListAsync();

            return Ok(patients);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllPatients()
        {
            var patients = await _context.Patients.ToListAsync();
            return Ok(patients);
        }

        [Authorize(Roles = "Patient")]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] Patient updatedPatient)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return NotFound("Patient not found");

            patient.Name = updatedPatient.Name;
            patient.Email = updatedPatient.Email;
            patient.Password = updatedPatient.Password;
            patient.Gender = updatedPatient.Gender;
            patient.DOB = updatedPatient.DOB;
            patient.ContactNumber = updatedPatient.ContactNumber;
            patient.MedicalHistory = updatedPatient.MedicalHistory;
            patient.Patient_Image = updatedPatient.Patient_Image;

            await _context.SaveChangesAsync();
            return Ok(patient);
        }

        [Authorize(Roles = "Patient")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return NotFound("Patient not found");

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Patient profile deleted successfully." });
        }

        [AllowAnonymous]
        [HttpGet("check-email")]
        public async Task<IActionResult> CheckEmailExists([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest("Email is required");

            bool emailExists = await _context.Patients.AnyAsync(p => p.Email == email);

            return Ok(new { exists = emailExists });
        }



        // ===================== APPOINTMENTS =====================

        [Authorize(Roles = "Patient")]
        [HttpPost("book-appointment")]
        public async Task<IActionResult> BookAppointment([FromBody] Appointment appointment)
        {
            appointment.Status = AppointmentStatus.Booked;
            appointment.PaymentStatus = PaymentStatus.Unpaid;

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment booked successfully", appointment });
        }

        [Authorize(Roles = "Patient")]
        [HttpGet("appointments/{patientId}")]
        public async Task<IActionResult> GetAppointmentsByPatient(int patientId)
        {
            var appointments = await _context.Appointments
                .Include(a => a.Doctor)
                .Where(a => a.PatientID == patientId)
                .ToListAsync();

            return Ok(appointments);
        }

       

        [Authorize(Roles = "Patient")]
        [HttpPut("update-appointment/{appointmentId}")]
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

        [Authorize(Roles = "Patient")]
        [HttpDelete("cancel-appointment/{appointmentId}")]
        public async Task<IActionResult> CancelAppointment(int appointmentId)
        {
            var appointment = await _context.Appointments.FindAsync(appointmentId);
            if (appointment == null)
                return NotFound("Appointment not found");

            appointment.Status = AppointmentStatus.Cancelled;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment cancelled." });
        }
    }
}
