using ConsultationSite.Data;
using ConsultationSite.Models;
using Microsoft.AspNetCore.Mvc;


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

        [HttpPost("patient")]
        public async Task<IActionResult> RegisterPatient([FromBody] Patient patient)
        {
            await _context.Patients.AddAsync(patient);
            await _context.SaveChangesAsync();
            return Ok("Patient registered successfully");
        }

        [HttpPost("doctor")]
        public async Task<IActionResult> RegisterDoctor([FromBody] Doctor doctor)
        {
            await _context.Doctors.AddAsync(doctor);
            await _context.SaveChangesAsync();
            return Ok("Doctor registered successfully");
        }

        [HttpPost("admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] Admin admin)
        {
            await _context.Admins.AddAsync(admin);
            await _context.SaveChangesAsync();
            return Ok("Admin registered successfully");
        }
    }
}
