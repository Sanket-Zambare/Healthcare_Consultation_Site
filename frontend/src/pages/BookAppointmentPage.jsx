import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import apiService from '../services/apiService';
import AppointmentForm from '../components/appointment/AppointmentForm';

const BookAppointmentPage = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctor();
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      const doctorData = await apiService.getDoctorById(parseInt(doctorId));
      setDoctor(doctorData);
    } catch (err) {
      setError('Doctor not found');
    } finally {
      setLoading(false);
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

  return (
    <Container className="my-4">
      <Row>
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <img
                src={doctor.DoctorImage}
                alt={doctor.Name}
                className="rounded-circle mb-3"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <h4>{doctor.Name}</h4>
              <p className="text-muted">{doctor.Specialization}</p>
              <p className="small">
                <strong>Experience:</strong> {doctor.Experience}<br/>
                <strong>Availability:</strong> {doctor.Availability}
              </p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Book Appointment</h5>
            </Card.Header>
            <Card.Body>
              <AppointmentForm doctor={doctor} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookAppointmentPage;