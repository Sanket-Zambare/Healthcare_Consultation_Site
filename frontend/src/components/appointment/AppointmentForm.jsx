import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import apiService from '../../services/apiService';
import '../../assets/styles/custom.css';

const AppointmentForm = ({ doctor }) => {
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.date) {
      fetchAvailableSlots();
    }
  }, [formData.date]);

  const fetchAvailableSlots = async () => {
    try {
      // Get doctor's availability
      const availability = await apiService.getDoctorAvailability(doctor.DoctorID);
      
      // Get booked appointments for the selected date
      const appointments = await apiService.getAppointments(null, doctor.DoctorID);
      const dayBookedSlots = appointments
        .filter(apt => apt.Date === formData.date && apt.Status !== 'Cancelled')
        .map(apt => apt.TimeSlot);
      
      setBookedSlots(dayBookedSlots);
      
      // Generate time slots based on availability
      const slots = generateTimeSlots(availability);
      setAvailableSlots(slots);
    } catch (err) {
      console.error('Failed to fetch availability');
    }
  };

  const generateTimeSlots = (availability) => {
    // This is a simplified version - in real app, you'd parse the availability properly
    const slots = [
      '09:00 AM - 10:00 AM',
      '10:00 AM - 11:00 AM',
      '11:00 AM - 12:00 PM',
      '02:00 PM - 03:00 PM',
      '03:00 PM - 04:00 PM',
      '04:00 PM - 05:00 PM'
    ];
    
    return slots;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (bookedSlots.includes(formData.timeSlot)) {
      setError('This time slot is already booked. Please select another.');
      setLoading(false);
      return;
    }

    try {
      const appointmentData = {
        DoctorID: doctor.DoctorID,
        PatientID: user.PatientID,
        Date: formData.date,
        TimeSlot: formData.timeSlot
      };

      const appointment = await apiService.createAppointment(appointmentData);
      showToast('Appointment created! Please proceed to payment.', 'success');
      navigate(`/payment/${appointment.AppointmentID}`);
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // Allow booking up to 30 days ahead
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Select Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={getMinDate()}
              max={getMaxDate()}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      {formData.date && (
        <Form.Group className="mb-4">
          <Form.Label>Available Time Slots</Form.Label>
          <div className="d-flex flex-wrap gap-2">
            {availableSlots.map(slot => {
              const isBooked = bookedSlots.includes(slot);
              return (
                <div
                  key={slot}
                  className={`availability-slot ${formData.timeSlot === slot ? 'selected' : ''} ${isBooked ? 'disabled' : ''}`}
                  onClick={() => !isBooked && setFormData({...formData, timeSlot: slot})}
                  style={{ 
                    pointerEvents: isBooked ? 'none' : 'auto',
                    opacity: isBooked ? 0.5 : 1
                  }}
                >
                  {slot} {isBooked && '(Booked)'}
                </div>
              );
            })}
          </div>
          {availableSlots.length === 0 && (
            <p className="text-muted mt-2">No available slots for this date</p>
          )}
        </Form.Group>
      )}

      <Alert variant="info">
        <strong>Consultation Fee:</strong> $50.00
      </Alert>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={loading || !formData.date || !formData.timeSlot}
        className="w-100"
      >
        {loading ? 'Booking...' : 'Proceed to Payment'}
      </Button>
    </Form>
  );
};

export default AppointmentForm;