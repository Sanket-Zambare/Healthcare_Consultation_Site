﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConsultationSite.Data;
using ConsultationSite.Models;
using Microsoft.AspNetCore.Authorization;

namespace ConsultationSite.Controllers
{
    [Authorize(Roles = "patient,doctor,Admin")]
    [Route("api/payments")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly ConsultationContext _context;

        public PaymentsController(ConsultationContext context)
        {
            _context = context;
        }

        // GET: api/Payments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPayments()
        {
            return await _context.Payments
                .Include(p => p.Appointment)
                .Include(p => p.Patient)
                .ToListAsync();
        }

        // GET: api/Payments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetPayment(int id)
        {
            var payment = await _context.Payments
                .Include(p => p.Appointment)
                .Include(p => p.Patient)
                .FirstOrDefaultAsync(p => p.PaymentID == id);

            if (payment == null)
            {
                return NotFound();
            }

            return payment;
        }

        // GET: api/Payments/patient/{patientId}
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPaymentsByPatient(int patientId)
        {
            var payments = await _context.Payments
                .Where(p => p.PatientID == patientId)
                .Include(p => p.Appointment)
                .ToListAsync();

            return payments;
        }

        // PUT: api/Payments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPayment(int id, Payment payment)
        {
            if (id != payment.PaymentID)
            {
                return BadRequest();
            }

            _context.Entry(payment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentExists(id))
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

        [HttpPost("create")]
        public async Task<ActionResult<Payment>> CreatePayment(Payment payment)
        {
            if (payment.AppointmentID == 0 || payment.Amount == null)
            {
                return BadRequest("Invalid payment data.");
            }

            var appointment = await _context.Appointments.FindAsync(payment.AppointmentID);
            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }

            // Automatically populate PatientID from the appointment
            payment.PatientID = appointment.PatientID;
            payment.PaymentDate = DateTime.UtcNow;
            payment.Status = payment.Status ?? "Pending";

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPayment), new { id = payment.PaymentID }, payment);
        }


        // DELETE: api/Payments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
            {
                return NotFound();
            }

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/Payments/update-patient-ids
        [HttpPut("update-patient-ids")]
        public async Task<IActionResult> UpdatePaymentPatientIds()
        {
            try
            {
                var paymentsWithoutPatientId = await _context.Payments
                    .Where(p => p.PatientID == null)
                    .Include(p => p.Appointment)
                    .ToListAsync();

                foreach (var payment in paymentsWithoutPatientId)
                {
                    if (payment.Appointment != null)
                    {
                        payment.PatientID = payment.Appointment.PatientID;
                    }
                }

                await _context.SaveChangesAsync();
                return Ok($"Updated {paymentsWithoutPatientId.Count} payments with PatientID");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error updating payments: {ex.Message}");
            }
        }

        private bool PaymentExists(int id)
        {
            return _context.Payments.Any(e => e.PaymentID == id);
        }
    }
}
