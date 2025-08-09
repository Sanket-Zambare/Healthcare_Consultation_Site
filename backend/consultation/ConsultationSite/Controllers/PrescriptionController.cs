using ConsultationSite.Data;
using ConsultationSite.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ConsultationSite.Controllers
{
    [Authorize(Roles = "patient,doctor,Admin")]
    [ApiController]
    [Route("api/prescription")]
    public class PrescriptionController : ControllerBase
    {
        private readonly ConsultationContext _context;

        public PrescriptionController(ConsultationContext context)
        {
            _context = context;
        }

        // GET: api/Prescription
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Prescription>>> GetPrescriptions()
        {
            return await _context.Prescriptions
                .Include(p => p.Appointment)
                .Include(p => p.Doctor)
                .Include(p => p.Patient)
                .ToListAsync();
        }

        // GET: api/Prescription/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Prescription>> GetPrescription(int id)
        {
            var prescription = await _context.Prescriptions
                .Include(p => p.Appointment)
                .Include(p => p.Doctor)
                .Include(p => p.Patient)
                .FirstOrDefaultAsync(p => p.PrescriptionID == id);

            if (prescription == null)
            {
                return NotFound();
            }

            return prescription;
        }

        // GET: api/Prescription/appointment/5
        [HttpGet("appointment/{appointmentId}")]
        public async Task<ActionResult<IEnumerable<Prescription>>> GetPrescriptionsByAppointment(int appointmentId)
        {
            var prescriptions = await _context.Prescriptions
                .Include(p => p.Appointment)
                .Include(p => p.Doctor)
                .Include(p => p.Patient)
                .Where(p => p.AppointmentID == appointmentId)
                .ToListAsync();

            return prescriptions;
        }

        // GET: api/Prescription/patient/5
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<Prescription>>> GetPrescriptionsByPatient(int patientId)
        {
            var prescriptions = await _context.Prescriptions
                .Include(p => p.Appointment)
                .Include(p => p.Doctor)
                .Include(p => p.Patient)
                .Where(p => p.PatientID == patientId)
                .OrderByDescending(p => p.DateIssued)
                .ToListAsync();

            return prescriptions;
        }

        // GET: api/Prescription/doctor/5
        [HttpGet("doctor/{doctorId}")]
        public async Task<ActionResult<IEnumerable<Prescription>>> GetPrescriptionsByDoctor(int doctorId)
        {
            var prescriptions = await _context.Prescriptions
                .Include(p => p.Appointment)
                .Include(p => p.Doctor)
                .Include(p => p.Patient)
                .Where(p => p.DoctorID == doctorId)
                .OrderByDescending(p => p.DateIssued)
                .ToListAsync();

            return prescriptions;
        }

        // POST: api/Prescription
        [HttpPost]
        public async Task<ActionResult<Prescription>> CreatePrescription([FromBody] Prescription prescription)
        {
            try
            {
                // Validate appointment exists and is completed
                var appointment = await _context.Appointments
                    .FirstOrDefaultAsync(a => a.AppointmentID == prescription.AppointmentID);

                if (appointment == null)
                {
                    return BadRequest("Appointment not found");
                }

                if (appointment.Status != AppointmentStatus.Completed)
                {
                    return BadRequest("Prescriptions can only be created for completed appointments");
                }

                // Set the date issued
                prescription.DateIssued = DateTime.Now;

                _context.Prescriptions.Add(prescription);
                await _context.SaveChangesAsync();

                // Return the created prescription with related data
                var createdPrescription = await _context.Prescriptions
                    .Include(p => p.Appointment)
                    .Include(p => p.Doctor)
                    .Include(p => p.Patient)
                    .FirstOrDefaultAsync(p => p.PrescriptionID == prescription.PrescriptionID);

                return CreatedAtAction(nameof(GetPrescription), new { id = prescription.PrescriptionID }, createdPrescription);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error creating prescription: {ex.Message}");
            }
        }

        // PUT: api/Prescription/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePrescription(int id, [FromBody] Prescription updatedPrescription)
        {
            var prescription = await _context.Prescriptions.FindAsync(id);
            if (prescription == null)
            {
                return NotFound();
            }

            prescription.MedicationDetails = updatedPrescription.MedicationDetails;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PrescriptionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Prescription/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePrescription(int id)
        {
            var prescription = await _context.Prescriptions.FindAsync(id);
            if (prescription == null)
            {
                return NotFound();
            }

            _context.Prescriptions.Remove(prescription);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //// GET: api/Prescription/5/pdf
        //[HttpGet("{id}/pdf")]
        //public async Task<IActionResult> DownloadPrescriptionPDF(int id)
        //{
        //    try
        //    {
        //        var prescription = await _context.Prescriptions
        //            .Include(p => p.Appointment)
        //            .Include(p => p.Doctor)
        //            .Include(p => p.Patient)
        //            .FirstOrDefaultAsync(p => p.PrescriptionID == id);

        //        if (prescription == null)
        //        {
        //            return NotFound("Prescription not found");
        //        }

        //        // Generate PDF content
        //        var pdfContent = GeneratePrescriptionPDF(prescription);

        //        // Return PDF as file
        //        return File(pdfContent, "application/pdf", $"prescription-{id}.pdf");
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest($"Error generating PDF: {ex.Message}");
        //    }
        //}

        //private byte[] GeneratePrescriptionPDF(Prescription prescription)
        //{
        //    try
        //    {
        //        using (MemoryStream ms = new MemoryStream())
        //        {
        //            using (iTextSharp.text.Document document = new iTextSharp.text.Document())
        //            {
        //                iTextSharp.text.pdf.PdfWriter writer = iTextSharp.text.pdf.PdfWriter.GetInstance(document, ms);
        //                document.Open();

        //                // Add title
        //                iTextSharp.text.Font titleFont = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 18, iTextSharp.text.Font.BOLD);
        //                iTextSharp.text.Paragraph title = new iTextSharp.text.Paragraph("PRESCRIPTION", titleFont);
        //                title.Alignment = iTextSharp.text.Element.ALIGN_CENTER;
        //                document.Add(title);
        //                document.Add(new iTextSharp.text.Paragraph("\n"));

        //                // Add prescription details
        //                iTextSharp.text.Font normalFont = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 12, iTextSharp.text.Font.NORMAL);
        //                iTextSharp.text.Font boldFont = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 12, iTextSharp.text.Font.BOLD);

        //                document.Add(new iTextSharp.text.Paragraph($"Prescription ID: {prescription.PrescriptionID}", normalFont));
        //                document.Add(new iTextSharp.text.Paragraph($"Date Issued: {prescription.DateIssued:MM/dd/yyyy}", normalFont));
        //                document.Add(new iTextSharp.text.Paragraph($"Doctor: Dr. {prescription.Doctor?.Name ?? "Unknown"}", normalFont));
        //                document.Add(new iTextSharp.text.Paragraph($"Patient ID: {prescription.PatientID}", normalFont));
        //                document.Add(new iTextSharp.text.Paragraph($"Appointment ID: {prescription.AppointmentID}", normalFont));
        //                document.Add(new iTextSharp.text.Paragraph("\n"));

        //                // Add medication details
        //                document.Add(new iTextSharp.text.Paragraph("MEDICATION DETAILS:", boldFont));
        //                document.Add(new iTextSharp.text.Paragraph("\n"));
        //                document.Add(new iTextSharp.text.Paragraph(prescription.MedicationDetails ?? "No medication details provided", normalFont));
        //                document.Add(new iTextSharp.text.Paragraph("\n"));

        //                // Add footer
        //                iTextSharp.text.Font footerFont = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 10, iTextSharp.text.Font.ITALIC);
        //                iTextSharp.text.Paragraph footer = new iTextSharp.text.Paragraph("Generated by TeleMed System", footerFont);
        //                footer.Alignment = iTextSharp.text.Element.ALIGN_CENTER;
        //                document.Add(footer);

        //                document.Close();
        //            }
        //            return ms.ToArray();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception($"Error generating PDF: {ex.Message}");
        //    }
        //}

        private bool PrescriptionExists(int id)
        {
            return _context.Prescriptions.Any(e => e.PrescriptionID == id);
        }
    }
}
