using ConsultationSite.Data;
using ConsultationSite.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ConsultationSite.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly ConsultationContext _context;

        public AdminController(ConsultationContext context)
        {
            _context = context;
        }

        // ✅ GET: api/admin/dashboard-stats
        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                var totalPatients = await _context.Patients.CountAsync();
                var totalDoctors = await _context.Doctors.CountAsync();
                var pendingApprovals = await _context.Doctors
                    .CountAsync(d => d.ProfileStatus == ProfileStatus.Pending);
                var totalAppointments = await _context.Appointments.CountAsync();
                var completedAppointments = await _context.Appointments
                    .CountAsync(a => a.Status == AppointmentStatus.Completed);

                return Ok(new
                {
                    totalPatients,
                    totalDoctors,
                    pendingApprovals,
                    totalAppointments,
                    completedAppointments
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Failed to load dashboard stats.",
                    error = ex.Message
                });
            }
        }

        // ✅ GET: api/admin/pending-doctors
        [HttpGet("pending-doctors")]
        public async Task<IActionResult> GetPendingDoctors()
        {
            try
            {
                var pendingDoctors = await _context.Doctors
                    .Where(d => d.ProfileStatus == ProfileStatus.Pending)
                    .Select(d => new
                    {
                        d.DoctorID,
                        d.Name,
                        d.Email,
                        d.Specialization,
                        ProfileStatus = d.ProfileStatus.ToString()
                    })
                    .ToListAsync();

                return Ok(pendingDoctors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Failed to load pending doctors.",
                    error = ex.Message
                });
            }
        }

        // ✅ PUT: api/admin/approve-doctor/{id}
        [HttpPut("approve-doctor/{id}")]
        public async Task<IActionResult> ApproveDoctor(int id)
        {
            try
            {
                var doctor = await _context.Doctors.FindAsync(id);
                if (doctor == null)
                {
                    return NotFound(new { message = "Doctor not found." });
                }

                doctor.ProfileStatus = ProfileStatus.Approved;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Doctor approved successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Failed to approve doctor.",
                    error = ex.Message
                });
            }
        }
    }
}
