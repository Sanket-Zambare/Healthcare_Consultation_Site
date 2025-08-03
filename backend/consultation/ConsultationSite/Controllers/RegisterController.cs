using ConsultationSite.Data;
using ConsultationSite.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace ConsultationSite.Controllers
{
    [ApiController]
    [Route("api/register")]
    public class RegisterController : ControllerBase
    {
        private readonly ConsultationContext _context;

        public RegisterController(ConsultationContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpPost("patient")]
        public async Task<IActionResult> RegisterPatient([FromBody] Patient patient)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _context.Patients.AddAsync(patient);
            await _context.SaveChangesAsync();

            return Ok("Patient registered successfully");
        }

        [AllowAnonymous]
        [HttpPost("doctor")]
        public async Task<IActionResult> RegisterDoctor([FromBody] Doctor doctor)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Ensure each availability links back to the doctor
            if (doctor.Availabilities != null && doctor.Availabilities.Count > 0)
            {
                foreach (var availability in doctor.Availabilities)
                {
                    availability.Doctor = doctor;
                }
            }

            await _context.Doctors.AddAsync(doctor);
            await _context.SaveChangesAsync();

            return Ok("Doctor registered successfully");
        }

        [AllowAnonymous]
        [HttpPost("admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] Admin admin)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _context.Admins.AddAsync(admin);
            await _context.SaveChangesAsync();

            return Ok("Admin registered successfully");
        }
    }
}
