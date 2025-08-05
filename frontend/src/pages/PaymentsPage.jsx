import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import apiService from '../services/apiService';
import PaymentForm from '../components/payment/PaymentForm';

const PaymentsPage = () => {
 const { appointmentId } = useParams();
const queryParams = new URLSearchParams(window.location.search);
const doctorId = queryParams.get('doctorId');

  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useApp();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (appointmentId) {
      fetchAppointment();
    } else {
      setLoading(false);
    }
  }, [appointmentId, user, navigate]);

  const fetchAppointment = async () => {
  try {
    const date = queryParams.get('date');
    const timeSlot = queryParams.get('timeSlot');

    const appointment = await apiService.getAppointmentBySlot(user.PatientID, doctorId, date, timeSlot);

    console.log('Fetched appointment:', appointment); // 👈 LOG IT HERE
    setAppointment(appointment);
  } catch (err) {
    console.error('Error fetching appointment:', err);
    setError(err.message || 'Failed to fetch appointment');
  } finally {
    setLoading(false);
  }
};



  const handlePaymentSuccess = async (paymentData) => {
    try {
      await apiService.createPayment({
        AppointmentID: appointment.AppointmentID,
        Amount: 50,
        PaymentMode: 'RazorPay',
        PatientID: user.PatientID,
        ...paymentData
      });

      await apiService.updateAppointment(appointment.AppointmentID, {
        PaymentStatus: 'Paid'
      });

      showToast('Payment successful! Your appointment is confirmed.', 'success');
      navigate('/appointments');
    } catch (err) {
      console.error('Payment recording error:', err);
      showToast('Payment recorded but failed to update appointment. Please contact support.', 'warning');
    }
  };

  if (loading) {
    return (
      <Container className="my-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!appointmentId) {
    return (
      <Container className="my-4">
        <h2 className="fw-bold mb-4">Payment History</h2>
        <Card>
          <Card.Body>
            <p className="text-muted">Payment history will be displayed here.</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Complete Payment</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <h6>Appointment Details</h6>
                <p className="mb-1"><strong>Date:</strong> {appointment?.Date}</p>
                <p className="mb-1"><strong>Time:</strong> {appointment?.TimeSlot}</p>
                <p className="mb-1"><strong>Doctor:</strong> {appointment?.DoctorName || 'Doctor'}</p>
                <p className="mb-0"><strong>Consultation Fee:</strong> $50.00</p>
              </div>

              <PaymentForm 
                amount={50}
                appointment={appointment}
                onSuccess={handlePaymentSuccess}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentsPage;