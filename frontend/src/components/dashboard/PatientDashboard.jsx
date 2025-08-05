import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/apiService';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await apiService.getAppointments(user.PatientID);
      setAppointments(data.slice(0, 3)); // Show only recent 3
    } catch (err) {
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Welcome back, {user.Name}!</h2>
          <p className="text-muted">Here's your health dashboard overview</p>
        </div>
      </div>

      {/* Quick Actions */}
      <Row className="g-4 mb-5">
        <Col md={3}>
          <Card className="card-hover text-center h-100">
            <Card.Body>
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>🔍</div>
              <Card.Title>Find Doctors</Card.Title>
              <Card.Text>Search and connect with specialists</Card.Text>
              <Button as={Link} to="/search-doctors" variant="primary" size="sm">
                Search Now
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="card-hover text-center h-100">
            <Card.Body>
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>📅</div>
              <Card.Title>Book Appointment</Card.Title>
              <Card.Text>Schedule your next consultation</Card.Text>
              <Button as={Link} to="/search-doctors" variant="outline-primary" size="sm">
                Book Now
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="card-hover text-center h-100">
            <Card.Body>
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>💊</div>
              <Card.Title>Prescriptions</Card.Title>
              <Card.Text>View your digital prescriptions</Card.Text>
              <Button as={Link} to="/prescriptions" variant="outline-primary" size="sm">
                View All
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="card-hover text-center h-100">
            <Card.Body>
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>💳</div>
              <Card.Title>Payments</Card.Title>
              <Card.Text>Manage payment history</Card.Text>
              <Button as={Link} to="/payments" variant="outline-primary" size="sm">
                View History
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Appointments */}
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Appointments</h5>
              <Button as={Link} to="/appointments" variant="link" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : appointments.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted mb-3">No appointments found</p>
                  <Button as={Link} to="/search-doctors" variant="primary">
                    Book Your First Appointment
                  </Button>
                </div>
              ) : (
                <div className="row g-3">
                  {appointments.map(appointment => (
                    <div key={appointment.AppointmentID} className="col-md-4">
                      <Card className="appointment-card h-100">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="mb-0">Dr. Smith</h6>
                            <span className={`badge ${appointment.Status === 'Completed' ? 'bg-success' : 
                              appointment.Status === 'Booked' ? 'bg-primary' : 'bg-warning'}`}>
                              {appointment.Status}
                            </span>
                          </div>
                          <p className="text-muted small mb-2">
                            📅 {formatDate(appointment.Date)}
                          </p>
                          <p className="text-muted small mb-0">
                            🕐 {appointment.TimeSlot}
                          </p>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PatientDashboard;