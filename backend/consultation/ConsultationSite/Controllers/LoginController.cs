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
                    user = await _context.Admins
                        .FirstOrDefaultAsync(a => a.Email == model.Email && a.Password == model.Password);
                    break;

                case "doctor":
                    user = await _context.Doctors
                        .FirstOrDefaultAsync(d => d.Email == model.Email && d.Password == model.Password);
                    break;

                case "patient":
                    user = await _context.Patients
                        .FirstOrDefaultAsync(p => p.Email == model.Email && p.Password == model.Password);
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
