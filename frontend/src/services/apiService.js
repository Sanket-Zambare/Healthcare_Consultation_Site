import axiosInstance from './axiosInstance';

class ApiService {
  // ================= Appointments =================

  async getAppointments(patientId = null, doctorId = null) {
    try {
      if (doctorId) {
        const res = await axiosInstance.get(`/doctor/appointments/${doctorId}`);
        return res.data;
      }
      if (patientId) {
        const res = await axiosInstance.get(`/patient/appointments/${patientId}`);
        return res.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  }

  async createAppointment(appointmentData) {
    try {
      const {
        doctorID,
        patientID,
        date,
        timeSlot,
        status = 'Booked',
        paymentStatus = 'Unpaid'
      } = appointmentData;

      const payload = {
        appointmentID: 0,
        doctorID,
        patientID,
        date,
        timeSlot,
        status,
        paymentStatus
      };

      const res = await axiosInstance.post('/appointment', payload);
      return res.data;
    } catch (error) {
      console.error('Error creating appointment:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateAppointment(appointmentId, updateData) {
    try {
      const res = await axiosInstance.put(`/doctor/updateAppointment/${appointmentId}`, updateData);
      return res.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  }

  async getAppointmentBySlot(patientId, doctorId, date, timeSlot) {
    try {
      const trimmedTimeSlot = timeSlot?.trim();

      const response = await axiosInstance.get('/appointment/by-slot', {
        params: {
          patientId,
          doctorId,
          date,
          timeSlot: trimmedTimeSlot
        }
      });

      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data || error.message || 'Unknown error';
      console.error('❌ Error fetching appointment by slot:', errorMsg);
      throw new Error(
        typeof errorMsg === 'string'
          ? errorMsg
          : JSON.stringify(errorMsg)
      );
    }
  }

  async getBookedAppointmentsByDoctor(doctorId) {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.warn("⚠️ No token found — user may not be authenticated");
        return [];
      }

      const res = await axiosInstance.get(`/appointment/doctor/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!Array.isArray(res.data)) {
        console.warn('⚠️ Unexpected data format:', res.data);
        return [];
      }

      return res.data.filter(appointment => appointment.status === 'Booked');
    } catch (error) {
      console.error("❌ Error fetching doctor's appointments:", error.response?.data || error.message);
      return [];
    }
  }

  // ================= Doctors =================

  async getDoctors(filters = {}) {
    try {
      const response = await axiosInstance.get('/doctor/getAllDoctors');
      let doctors = response.data;

      if (filters.name) {
        doctors = doctors.filter((doc) =>
          (doc.name || doc.Name)?.toLowerCase().includes(filters.name.toLowerCase())
        );
      }

      if (filters.specialization) {
        doctors = doctors.filter((doc) =>
          (doc.specialization || doc.Specialization)?.toLowerCase().includes(filters.specialization.toLowerCase())
        );
      }

      return doctors;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return [];
    }
  }

  async getDoctorById(doctorId) {
    try {
      const res = await axiosInstance.get(`/doctor/getDoctorById/${doctorId}`);
      return res.data;
    } catch (error) {
      console.error('Doctor not found:', error);
      throw error;
    }
  }

  async getDoctorAvailability(doctorId) {
    try {
      const res = await axiosInstance.get(`/availability/doctor/${doctorId}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching availability:', error);
      return [];
    }
  }

  async updateDoctorAvailability(doctorId, availabilityData) {
    try {
      const res = await axiosInstance.put(`/doctor/availability/${doctorId}`, availabilityData);
      return res.data;
    } catch (error) {
      console.error('Error updating availability:', error);
      throw error;
    }
  }

  // ================= Messages =================

  async getMessages(appointmentId) {
    try {
      const res = await axiosInstance.get(`/message/${appointmentId}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async sendMessage(messageData) {
    try {
      const res = await axiosInstance.post('/message/send', messageData);
      return res.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // ================= Prescriptions =================

  async getPrescriptions(patientId = null, doctorId = null) {
    try {
      if (doctorId) {
        const res = await axiosInstance.get(`/prescription/doctor/${doctorId}`);
        return res.data;
      }
      if (patientId) {
        const res = await axiosInstance.get(`/prescription/patient/${patientId}`);
        return res.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      return [];
    }
  }

  async createPrescription(prescriptionData) {
    try {
      const res = await axiosInstance.post('/prescription/create', prescriptionData);
      return res.data;
    } catch (error) {
      console.error('Error creating prescription:', error);
      throw error;
    }
  }

  // ================= Payments =================

  async getPayments(patientId = null) {
    try {
      const res = await axiosInstance.get(`/payment/patient/${patientId}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
  }

  async createPayment(paymentData) {
    try {
      const res = await axiosInstance.post('/payment/create', paymentData);
      return res.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  // ================= Admin =================

  async getDashboardStats() {
    try {
      const res = await axiosInstance.get('/admin/dashboard-stats');
      return res.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {};
    }
  }

  async getPendingDoctors() {
    try {
      const res = await axiosInstance.get('/admin/pending-doctors');
      return res.data;
    } catch (error) {
      console.error('Error fetching pending doctors:', error);
      return [];
    }
  }

  async approveDoctor(doctorId) {
    try {
      const res = await axiosInstance.put(`/admin/approve-doctor/${doctorId}`);
      return res.data;
    } catch (error) {
      console.error('Error approving doctor:', error);
      throw error;
    }
  }

  // ================= Patients =================

 

async checkPatientEmailExists(email) {
    try {
      const token = localStorage.getItem('token');

      const res = await axiosInstance.get(`/patient/check-email`, {
        params: { email },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.exists === true;
    } catch (error) {
      console.error('❌ Error checking patient email existence:', error.response?.data || error.message);
      return false;
    }
  }

  async checkDoctorEmailExists(email) {
  try {
    const token = localStorage.getItem('token');

    const res = await axiosInstance.get(`/doctor/check-email`, {
      params: { email },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.exists === true;
  } catch (error) {
    console.error('❌ Error checking doctor email existence:', error.response?.data || error.message);
    return false;
  }
}


}

export default new ApiService();
