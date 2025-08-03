// src/services/apiService.js
import axios from 'axios';

const BASE_URL = 'https://localhost:44396/api'; // change if backend port changes

const apiService = {
  // Fetch all doctors from backend DB
  getDoctors: async () => {
    try {
      const res = await axios.get(`${BASE_URL}/doctor/getAllDoctors`);
      return res.data;
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      return [];
    }
  },

  // ✅ Fetch doctor by name (used in search)
  searchDoctorsByName: async (name) => {
    try {
      const res = await axios.get(`${BASE_URL}/doctor/doctorByName/${name}`);
      return res.data;
    } catch (error) {
      console.error('Failed to search doctor:', error);
      return [];
    }
  },

  // ✅ Fetch doctor by ID (used in detail view or dashboard)
  getDoctorById: async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/doctor/profile/${id}`);
      return res.data;
    } catch (error) {
      console.error('Failed to get doctor by ID:', error);
      return null;
    }
  },

  // ✅ Update doctor profile
  updateDoctorProfile: async (id, updatedData) => {
    try {
      const res = await axios.put(`${BASE_URL}/doctor/updateProfile/${id}`, updatedData);
      return res.data;
    } catch (error) {
      console.error('Failed to update doctor profile:', error);
      throw error;
    }
  },

  // ✅ Get appointments for doctor
  getAppointmentsForDoctor: async (doctorId) => {
    try {
      const res = await axios.get(`${BASE_URL}/doctor/appointments/${doctorId}`);
      return res.data;
    } catch (error) {
      console.error('Failed to get doctor appointments:', error);
      return [];
    }
  },

  // ✅ Cancel appointment
  cancelAppointment: async (appointmentId) => {
    try {
      const res = await axios.delete(`${BASE_URL}/doctor/cancelAppointment/${appointmentId}`);
      return res.data;
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      throw error;
    }
  },

  // ✅ Update appointment
  updateAppointment: async (appointmentId, updatedData) => {
    try {
      const res = await axios.put(`${BASE_URL}/doctor/updateAppointment/${appointmentId}`, updatedData);
      return res.data;
    } catch (error) {
      console.error('Failed to update appointment:', error);
      throw error;
    }
  },
};

export default apiService;
