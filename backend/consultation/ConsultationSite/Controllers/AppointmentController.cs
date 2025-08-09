using ConsultationSite.Data;
using ConsultationSite.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace ConsultationSite.Controllers
{
    [Authorize(Roles = "patient,doctor,Admin")]
    [ApiController]
    [Route("api/appointment")]
    public class AppointmentController : ControllerBase
    {
        private readonly ConsultationContext _context;
        private readonly ILogger<AppointmentController> _logger;

        public AppointmentController(ConsultationContext context, ILogger<AppointmentController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/appointment
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
        {
            return await _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .ToListAsync();
        }

        // PATCH: api/appointment/{id}/payment-status
        [HttpPatch("{id}/payment-status")]
        public async Task<IActionResult> UpdatePaymentStatus(int id, [FromBody] string status)
        {
            var appointment = await _context.Appointments.FindAsync(id);

            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }

            if (!Enum.TryParse<PaymentStatus>(status, out var parsedStatus))
            {
                return BadRequest("Invalid payment status.");
            }

            appointment.PaymentStatus = parsedStatus;
            _context.Entry(appointment).Property(a => a.PaymentStatus).IsModified = true;

            await _context.SaveChangesAsync();
            return Ok(appointment);
        }


        // GET: api/appointment/patient/5
        [HttpGet("patient/{patientId}")]
        public async Task<IActionResult> GetAppointmentsByPatient(int patientId)
        {
            var appointments = await _context.Appointments
                .Include(a => a.Doctor)
                .Where(a => a.PatientID == patientId)
                .ToListAsync();

            return Ok(appointments);
        }

        [HttpGet("patientDocterName/{patientId}")]
        public async Task<IActionResult> GetAppointmentsByPatientAndDocterName(int patientId)
        {
            var appointments = await _context.Appointments
                .Include(a => a.Doctor)
                .Where(a => a.PatientID == patientId)
                .Select(a => new
                {
                    a.AppointmentID,
                    a.DoctorID,
                    DoctorName = a.Doctor.Name,
                    a.PatientID,
                    a.Date,
                    a.TimeSlot,
                    Status = a.Status.ToString(),
                    PaymentStatus = a.PaymentStatus.ToString()
                })
                .ToListAsync();

            return Ok(appointments);
        }




        //get appointment by docterid
        [Authorize(Roles = "patient,doctor,Admin")]
        [HttpGet("doctor/{doctorId}")]
        public async Task<IActionResult> GetAppointmentsForDoctor(int doctorId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.DoctorID == doctorId)
                .Include(a => a.Patient)
                .OrderBy(a => a.Date)
                .Select(a => new
                {
                    appointmentID = a.AppointmentID,
                    date = a.Date,
                    timeSlot = a.TimeSlot,
                    status = a.Status,
                    patientName = a.Patient.Name
                })
                .ToListAsync();

            if (appointments == null || !appointments.Any())
            {
                return NotFound($"No appointments found for DoctorID {doctorId}");
            }

            return Ok(appointments);
        }
    

        // GET: api/appointment/{id}
        [HttpGet("{appointmentId}")]
        public async Task<IActionResult> GetAppointment(int appointmentId)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .Where(a => a.AppointmentID == appointmentId)
                .Select(a => new
                {
                    a.AppointmentID,
                    a.Date,
                    a.TimeSlot,
                    a.Status,
                    a.PaymentStatus,
                    a.PatientID,
                    a.DoctorID,
                    DoctorName = a.Doctor.Name,     // ✅ Doctor's name
                    PatientName = a.Patient.Name    // ✅ Patient's name
                })
                .FirstOrDefaultAsync();

            if (appointment == null)
                return NotFound();

            return Ok(appointment);
        }


        [Authorize(Roles = "patient")]
        [HttpGet("by-details")]
        public async Task<IActionResult> GetAppointmentByDetails([FromQuery] int patientId, [FromQuery] int doctorId, [FromQuery] DateTime date, [FromQuery] string timeSlot)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .FirstOrDefaultAsync(a =>
                    a.PatientID == patientId &&
                    a.DoctorID == doctorId &&
                    a.Date.Date == date.Date &&
                    a.TimeSlot == timeSlot
                );

            if (appointment == null)
                return NotFound("No appointment found with the given details.");

            return Ok(appointment);
        }


        [Authorize(Roles = "patient,doctor,Admin")]
        [HttpGet("by-slot")]
        public async Task<IActionResult> GetAppointmentBySlot(
            [FromQuery] int patientId,
            [FromQuery] int doctorId,
            [FromQuery] DateTime date,
            [FromQuery] string timeSlot)
        {
            // Normalize and log
            date = date.Date;
            timeSlot = timeSlot?.Trim();

            _logger.LogInformation("Looking for appointment => PatientID: {0}, DoctorID: {1}, Date: {2}, TimeSlot: '{3}'",
                patientId, doctorId, date, timeSlot);

            var appointment = await _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .FirstOrDefaultAsync(a =>
                    a.PatientID == patientId &&
                    a.DoctorID == doctorId &&
                    a.Date.Date == date &&
                    a.TimeSlot.Trim() == timeSlot);

            if (appointment == null)
                return NotFound("No appointment found for the specified slot.");

            return Ok(appointment);
        }





        // POST: api/appointment
        [HttpPost]
        public async Task<IActionResult> PostAppointment([FromBody] Appointment appointment)
        {
            try
            {
                // Validate doctor and patient exist
                var doctor = await _context.Doctors
                    .Include(d => d.Availabilities)
                    .FirstOrDefaultAsync(d => d.DoctorID == appointment.DoctorID);

                if (doctor == null)
                    return BadRequest("Doctor not found.");

                var patient = await _context.Patients
                    .FirstOrDefaultAsync(p => p.PatientID == appointment.PatientID);

                if (patient == null)
                    return BadRequest("Patient not found.");

                // Check doctor availability
                var appointmentDay = appointment.Date.DayOfWeek;
                var availability = doctor.Availabilities?
                    .FirstOrDefault(a =>
                        a.Day == appointmentDay &&
                        a.Status == AvailabilityStatus.Available);

                if (availability == null)
                    return BadRequest($"Doctor is not available on {appointmentDay}.");

                // Assign doctor and patient navigation properties
                appointment.Doctor = doctor;
                appointment.Patient = patient;

                _context.Appointments.Add(appointment);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetAppointment), new { id = appointment.AppointmentID }, appointment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating appointment.");
                return StatusCode(500, "An error occurred while creating the appointment.");
            }
        }

        // PATCH: api/appointment/{id}/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateAppointmentStatus(int id, [FromBody] string status)
        {
            var appointment = await _context.Appointments.FindAsync(id);

            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }

            if (!Enum.TryParse<AppointmentStatus>(status, out var parsedStatus))
            {
                return BadRequest("Invalid appointment status.");
            }

            appointment.Status = parsedStatus;
            _context.Entry(appointment).Property(a => a.Status).IsModified = true;

            await _context.SaveChangesAsync();
            return Ok(appointment);
        }


        // PUT: api/appointment/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppointment(int id, [FromBody] Appointment appointment)
        {
            if (id != appointment.AppointmentID)
                return BadRequest("ID mismatch.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Entry(appointment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Appointment updated with ID: {Id}", id);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Appointments.Any(a => a.AppointmentID == id))
                {
                    _logger.LogWarning("Appointment not found for update. ID: {Id}", id);
                    return NotFound();
                }

                throw;
            }

            return NoContent();
        }

        // DELETE: api/appointment/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                _logger.LogWarning("Attempt to delete non-existent appointment ID: {Id}", id);
                return NotFound();
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Appointment deleted with ID: {Id}", id);
            return NoContent();
        }
    }
}
