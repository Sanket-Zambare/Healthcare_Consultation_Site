// Mock data for API simulation
let mockData = {
  appointments: [
    {
      AppointmentID: 1,
      DoctorID: 1,
      PatientID: 1,
      Date: "2024-01-15",
      TimeSlot: "10:00 AM - 11:00 AM",
      Status: "Booked",
      PaymentStatus: "Paid"
    }
  ],
  messages: [
    {
      MessageID: 1,
      SenderID: 1,
      ReceiverID: 1,
      AppointmentID: 1,
      Timestamp: new Date().toISOString(),
      Content: "Hello, how are you feeling today?"
    }
  ],
  prescriptions: [
    {
      PrescriptionID: 1,
      AppointmentID: 1,
      DoctorID: 1,
      PatientID: 1,
      DateIssued: "2024-01-15",
      MedicationDetails: "Paracetamol 500mg - Take twice daily",
      FilePath: "/prescriptions/prescription_1.pdf"
    }
  ],
  payments: [
    {
      PaymentID: 1,
      AppointmentID: 1,
      Amount: 500,
      PaymentDate: "2024-01-15",
      Status: "Completed",
      EndDate: "2024-01-15",
      PaymentMode: "RazorPay",
      RazorPayOrderID: "order_123",
      RazorPaymentID: "pay_123",
      RazorPaysignature: "signature_123",
      PatientID: 1
    }
  ],
  doctorAvailability: [
    {
      DoctorAvailabilityID: 1,
      DoctorID: 1,
      Day: "Monday",
      From: "09:00",
      To: "17:00",
      Status: "Available"
    },
    {
      DoctorAvailabilityID: 2,
      DoctorID: 1,
      Day: "Tuesday",
      From: "09:00",
      To: "17:00",
      Status: "Available"
    }
  ]
};

// Mock doctors data (will be accessed from authService mockUsers)
const getDoctorsFromAuth = () => {
  return [
    {
      DoctorID: 1,
      Name: "Dr. Sarah Smith",
      Email: "doctor@test.com",
      Specialization: "Cardiology",
      Experience: "10 years",
      Availability: "Mon-Fri 9AM-5PM",
      ProfileStatus: "Approved",
      ContactNumber: "0987654321",
      DoctorImage: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=200"
    },
    {
      DoctorID: 2,
      Name: "Dr. Michael Johnson",
      Email: "michael@test.com",
      Specialization: "Neurology",
      Experience: "8 years",
      Availability: "Mon-Wed 10AM-4PM",
      ProfileStatus: "Approved",
      ContactNumber: "1122334455",
      DoctorImage: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=200"
    },
    {
      DoctorID: 3,
      Name: "Dr. Emily Davis",
      Email: "emily@test.com",
      Specialization: "Pediatrics",
      Experience: "12 years",
      Availability: "Tue-Thu 9AM-3PM",
      ProfileStatus: "Approved",
      ContactNumber: "5566778899",
      DoctorImage: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=200"
    }
  ];
};

class ApiService {
  // Simulate API delay
  delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Appointments
  async getAppointments(patientId = null, doctorId = null) {
    await this.delay();
    let appointments = [...mockData.appointments];
    
    if (patientId) {
      appointments = appointments.filter(apt => apt.PatientID === patientId);
    }
    if (doctorId) {
      appointments = appointments.filter(apt => apt.DoctorID === doctorId);
    }
    
    return appointments;
  }

  async createAppointment(appointmentData) {
    await this.delay();
    const newAppointment = {
      AppointmentID: mockData.appointments.length + 1,
      ...appointmentData,
      Status: "Booked",
      PaymentStatus: "Unpaid"
    };
    
    mockData.appointments.push(newAppointment);
    return newAppointment;
  }

  async updateAppointment(appointmentId, updateData) {
    await this.delay();
    const index = mockData.appointments.findIndex(apt => apt.AppointmentID === appointmentId);
    if (index !== -1) {
      mockData.appointments[index] = { ...mockData.appointments[index], ...updateData };
      return mockData.appointments[index];
    }
    throw new Error('Appointment not found');
  }

  // Doctors
  async getDoctors(filters = {}) {
    await this.delay();
    let doctors = getDoctorsFromAuth();
    
    if (filters.name) {
      doctors = doctors.filter(doc => 
        doc.Name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    
    if (filters.specialization) {
      doctors = doctors.filter(doc => 
        doc.Specialization.toLowerCase().includes(filters.specialization.toLowerCase())
      );
    }
    
    return doctors;
  }

  async getDoctorById(doctorId) {
    await this.delay();
    const doctors = getDoctorsFromAuth();
    const doctor = doctors.find(doc => doc.DoctorID === doctorId);
    if (!doctor) throw new Error('Doctor not found');
    return doctor;
  }

  // Doctor Availability
  async getDoctorAvailability(doctorId) {
    await this.delay();
    return mockData.doctorAvailability.filter(avail => avail.DoctorID === doctorId);
  }

  async updateDoctorAvailability(doctorId, availabilityData) {
    await this.delay();
    // Remove existing availability for this doctor
    mockData.doctorAvailability = mockData.doctorAvailability.filter(
      avail => avail.DoctorID !== doctorId
    );
    
    // Add new availability slots
    const newAvailability = availabilityData.map((slot, index) => ({
      DoctorAvailabilityID: mockData.doctorAvailability.length + index + 1,
      DoctorID: doctorId,
      ...slot
    }));
    
    mockData.doctorAvailability.push(...newAvailability);
    return newAvailability;
  }

  // Messages
  async getMessages(appointmentId) {
    await this.delay();
    return mockData.messages.filter(msg => msg.AppointmentID === appointmentId);
  }

  async sendMessage(messageData) {
    await this.delay();
    const newMessage = {
      MessageID: mockData.messages.length + 1,
      Timestamp: new Date().toISOString(),
      ...messageData
    };
    
    mockData.messages.push(newMessage);
    return newMessage;
  }

  // Prescriptions
  async getPrescriptions(patientId = null, doctorId = null) {
    await this.delay();
    let prescriptions = [...mockData.prescriptions];
    
    if (patientId) {
      prescriptions = prescriptions.filter(pres => pres.PatientID === patientId);
    }
    if (doctorId) {
      prescriptions = prescriptions.filter(pres => pres.DoctorID === doctorId);
    }
    
    return prescriptions;
  }

  async createPrescription(prescriptionData) {
    await this.delay();
    const newPrescription = {
      PrescriptionID: mockData.prescriptions.length + 1,
      DateIssued: new Date().toISOString().split('T')[0],
      FilePath: `/prescriptions/prescription_${mockData.prescriptions.length + 1}.pdf`,
      ...prescriptionData
    };
    
    mockData.prescriptions.push(newPrescription);
    return newPrescription;
  }

  // Payments
  async getPayments(patientId = null) {
    await this.delay();
    let payments = [...mockData.payments];
    
    if (patientId) {
      payments = payments.filter(payment => payment.PatientID === patientId);
    }
    
    return payments;
  }

  async createPayment(paymentData) {
    await this.delay();
    const newPayment = {
      PaymentID: mockData.payments.length + 1,
      PaymentDate: new Date().toISOString().split('T')[0],
      Status: "Completed",
      ...paymentData
    };
    
    mockData.payments.push(newPayment);
    return newPayment;
  }

  // Dashboard Stats
  async getDashboardStats() {
    await this.delay();
    const doctors = getDoctorsFromAuth();
    
    return {
      totalPatients: 150,
      totalDoctors: doctors.length,
      totalAppointments: mockData.appointments.length,
      totalPayments: mockData.payments.length,
      pendingApprovals: doctors.filter(d => d.ProfileStatus === "Pending").length
    };
  }
}

export default new ApiService();