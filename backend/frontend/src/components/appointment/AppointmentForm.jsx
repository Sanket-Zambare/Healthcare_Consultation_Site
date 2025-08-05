import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import apiService from '../../services/apiService';
import '../../assets/styles/custom.css';

const AppointmentForm = ({ doctor: doctorProp }) => {
  const [formData, setFormData] = useState({ date: '', timeSlot: '' });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [doctor, setDoctor] = useState(doctorProp || null);
  const [doctorAvailability, setDoctorAvailability] = useState([]);

  const { user } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();
  const { id: doctorIdFromURL } = useParams();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const id = doctorProp?.doctorID || doctorIdFromURL;
        const fetchedDoctor = await apiService.getDoctorById(id);
        setDoctor(fetchedDoctor);
        setDoctorAvailability(fetchedDoctor.availability || []);
      } catch (err) {
        console.error('Doctor fetch error:', err);
        setError('Failed to load doctor details.');
      }
    };
    fetchDoctor();
  }, [doctorProp, doctorIdFromURL]);

  useEffect(() => {
    if (formData.date && doctor) fetchAvailableSlots();
  }, [formData.date, doctor]);

  const fetchAvailableSlots = async () => {
    try {
      const selectedDay = new Date(formData.date).toLocaleDateString('en-US', {
        weekday: 'long'
      });

      const availability = doctorAvailability.find(
        a =>
          a.day.toLowerCase() === selectedDay.toLowerCase() &&
          a.status === 'Available'
      );

      if (!availability) {
        setAvailableSlots([]);
        setError(`Doctor is not available on ${selectedDay}`);
        return;
      }

      const slots = generateTimeSlots(availability.from, availability.to);

      // ✅ Fetch Booked Appointments
      const allAppointments = await apiService.getBookedAppointmentsByDoctor(
        doctor.doctorID
      );
      console.log('✅ All appointments:', allAppointments);

      const selectedDate = formData.date;

      const booked = allAppointments
        .filter(app => app.date.split('T')[0] === selectedDate)
        .map(app => app.timeSlot.trim());

      console.log('✅ Booked Slots:', booked);

      const filteredSlots = slots.filter(
        slot => !booked.includes(slot.trim())
      );

      setBookedSlots(booked);
      setAvailableSlots(filteredSlots);
      setError('');
    } catch (err) {
      console.error('Slot fetch error:', err);
      setError('Failed to load available time slots.');
    }
  };

  const generateTimeSlots = (from, to) => {
    const slots = [];
    const [startHour, startMin] = from.split(':').map(Number);
    const [endHour, endMin] = to.split(':').map(Number);

    const startTime = new Date();
    startTime.setHours(startHour, startMin, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMin, 0, 0);

    while (startTime < endTime) {
      const slotStart = new Date(startTime);
      startTime.setMinutes(startTime.getMinutes() + 60);
      const slotEnd = new Date(startTime);

      if (slotEnd > endTime) break;

      slots.push(`${formatTime(slotStart)} - ${formatTime(slotEnd)}`);
    }

    return slots;
  };

  const formatTime = date =>
    date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.date || !formData.timeSlot) {
      setError('Please select a valid date and time slot.');
      setLoading(false);
      return;
    }

    const selectedDay = new Date(formData.date).toLocaleDateString('en-US', {
      weekday: 'long'
    });
    const isAvailable = doctorAvailability.some(
      a =>
        a.day.toLowerCase() === selectedDay.toLowerCase() &&
        a.status === 'Available'
    );

    if (!isAvailable) {
      setError(`Doctor is not available on ${selectedDay}`);
      setLoading(false);
      return;
    }

    if (bookedSlots.includes(formData.timeSlot.trim())) {
      setError('Selected slot already booked. Choose another.');
      setLoading(false);
      return;
    }

    const newAppointment = {
      doctorID: doctor.doctorID,
      patientID: user.patientID,
      date: formData.date,
      timeSlot: formData.timeSlot,
      status: 'Booked',
      paymentStatus: 'Unpaid'
    };

    try {
      const created = await apiService.createAppointment(newAppointment);
      showToast('Redirecting to payment...', 'info');
      navigate(
        `/payment/${created.appointmentID}?doctorId=${doctor.doctorID}`
      );
    } catch (err) {
      console.error('Submit error:', err);
      showToast('Something went wrong.', 'danger');
      setError('Could not create appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => new Date().toISOString().split('T')[0];
  const getMaxDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
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
            {availableSlots.map(slot => (
              <div
                key={slot}
                className={`availability-slot ${
                  formData.timeSlot === slot ? 'selected' : ''
                }`}
                onClick={() =>
                  setFormData({ ...formData, timeSlot: slot })
                }
              >
                {slot}
              </div>
            ))}
          </div>
          {availableSlots.length === 0 && (
            <p className="text-muted mt-2">
              No available slots for this date.
            </p>
          )}
        </Form.Group>
      )}

      <Alert variant="info">
        <strong>Consultation Fee:</strong> ₹500
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
