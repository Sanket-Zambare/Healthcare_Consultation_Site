using ConsultationSite.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace ConsultationSite.Data
{
    public class ConsultationContext : DbContext
    {
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<DoctorAvailability> DoctorAvailabilities { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Message> Messages { get; set; }





        // Add DbSet<Patient> and others here when ready

        public ConsultationContext(DbContextOptions<ConsultationContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DoctorAvailability>()
                .HasOne(d => d.Doctor)
                .WithMany(a => a.Availabilities)
                .HasForeignKey(d => d.DoctorID);

            modelBuilder.Entity<Prescription>()
                .HasOne(p => p.Doctor)
                .WithMany()
                .HasForeignKey(p => p.DoctorID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Prescription>()
                .HasOne(p => p.Patient)
                .WithMany()
                .HasForeignKey(p => p.PatientID)
                .OnDelete(DeleteBehavior.Restrict); // This avoids cascade conflict

            modelBuilder.Entity<Prescription>()
                .HasOne(p => p.Appointment)
                .WithMany()
                .HasForeignKey(p => p.AppointmentID)
                .OnDelete(DeleteBehavior.Cascade); // Only ONE should cascade


            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Doctor)
                .WithMany()
                .HasForeignKey(a => a.DoctorID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Patient)
                .WithMany()
                .HasForeignKey(a => a.PatientID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Appointment>()
                .Property(a => a.Status)
                 .HasConversion<string>();

            modelBuilder.Entity<Appointment>()
                .Property(a => a.PaymentStatus)
                .HasConversion<string>();


            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Appointment)
                .WithMany()
                .HasForeignKey(p => p.AppointmentID)
                .OnDelete(DeleteBehavior.Cascade); // Allowed if not already used in conflicting paths

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Appointment)
                .WithMany()
                .HasForeignKey(m => m.AppointmentID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasPrecision(18, 2); // Or any precision/scale as needed



        }
    }
}
