using ConsultationSite.Data;
using ConsultationSite.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ConsultationSite.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/admin")]
    public class AdminController : Controller
    {
        private readonly ConsultationContext _context;

        public AdminController(ConsultationContext context)
        {
            _context = context;
        }

        // ===================== DOCTOR CRUD =====================

        [HttpGet("doctors")]
        public async Task<IActionResult> GetAllDoctors()
        {
            var doctors = await _context.Doctors.ToListAsync();
            return Ok(doctors);
        }

        [HttpGet("doctor/{id}")]
        public async Task<IActionResult> GetDoctorById(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null) return NotFound();
            return Ok(doctor);
        }

        [HttpPost("doctor")]
        public async Task<IActionResult> CreateDoctor([FromBody] Doctor doctor)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            await _context.Doctors.AddAsync(doctor);
            await _context.SaveChangesAsync();
            return Ok(doctor);
        }

        [HttpPut("doctor/{id}")]
        public async Task<IActionResult> UpdateDoctor(int id, [FromBody] Doctor updatedDoctor)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null) return NotFound();

            doctor.Name = updatedDoctor.Name;
            doctor.Email = updatedDoctor.Email;
            doctor.Password = updatedDoctor.Password;
            doctor.Specialization = updatedDoctor.Specialization;
            doctor.Experience = updatedDoctor.Experience;
            doctor.ProfileStatus = updatedDoctor.ProfileStatus;
            doctor.ContactNumber = updatedDoctor.ContactNumber;
            doctor.Doctor_Image = updatedDoctor.Doctor_Image;

            await _context.SaveChangesAsync();
            return Ok(doctor);
        }

        [HttpDelete("doctor/{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null) return NotFound();

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Doctor deleted successfully." });
        }

        // ===================== PATIENT CRUD =====================

        [HttpGet("patients")]
        public async Task<IActionResult> GetAllPatients()
        {
            var patients = await _context.Patients.ToListAsync();
            return Ok(patients);
        }

        [HttpGet("patient/{id}")]
        public async Task<IActionResult> GetPatientById(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null) return NotFound();
            return Ok(patient);
        }

        [HttpPost("patient")]
        public async Task<IActionResult> CreatePatient([FromBody] Patient patient)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            await _context.Patients.AddAsync(patient);
            await _context.SaveChangesAsync();
            return Ok(patient);
        }

        [HttpPut("patient/{id}")]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] Patient updatedPatient)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null) return NotFound();

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

        [HttpDelete("patient/{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null) return NotFound();

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Patient deleted successfully." });
        }
    }
}
