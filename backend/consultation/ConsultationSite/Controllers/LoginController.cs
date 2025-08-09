using ConsultationSite.Data;
using ConsultationSite.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace ConsultationSite.Controllers
{
    [ApiController]
    [Route("api/login")]
    public class LoginController : Controller
    {
        private readonly ConsultationContext _context;
        private readonly TokenService _tokenService;

        public LoginController(ConsultationContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] Login model)
        {
            object? user = null;

            switch (model.Role?.ToLower())
            {
                case "admin":
                    var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == model.Email);
                    if (admin != null && BCrypt.Net.BCrypt.Verify(model.Password, admin.Password))
                    {
                        user = admin;
                    }
                    break;

                case "doctor":
                    var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.Email == model.Email);
                    if (doctor != null && BCrypt.Net.BCrypt.Verify(model.Password, doctor.Password))
                    {
                        user = doctor;
                    }
                    break;

                case "patient":
                    var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Email == model.Email);
                    if (patient != null && BCrypt.Net.BCrypt.Verify(model.Password, patient.Password))
                    {
                        user = patient;
                    }
                    break;

            }

            if (user == null)
                return Unauthorized("Invalid credentials");

            var token = _tokenService.CreateToken(model.Email, model.Role);

            return Ok(new
            {
                token = token,
                user = user
            });
        }
    }
}
