import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/apiService';


const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodayAppointments();
  }, []);

  const fetchTodayAppointments = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await apiService.getAppointments(null, user.DoctorID);
      const todayAppointments = data.filter(apt => apt.Date === today);
      setAppointments(todayAppointments);
    } catch (err) {
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeSlot) => {
    return timeSlot.split(' - ')[0];
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Welcome, {user.Name}!</h2>
          <p className="text-muted">Manage your practice and patient consultations</p>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-5">
        <Col md={3}>
          <Card className="dashboard-stats h-100">
            <Card.Body className="text-center">
              <div className="mb-2" style={{ fontSize: '2rem' }}>📅</div>
              <h4 className="mb-0">{appointments.length}</h4>
              <small>Today's Appointments</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-stats h-100">
            <Card.Body className="text-center">
              <div className="mb-2" style={{ fontSize: '2rem' }}>👥</div>
              <h4 className="mb-0">25</h4>
              <small>Total Patients</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-stats h-100">
            <Card.Body className="text-center">
              <div className="mb-2" style={{ fontSize: '2rem' }}>💊</div>
              <h4 className="mb-0">12</h4>
              <small>Prescriptions Issued</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-stats h-100">
            <Card.Body className="text-center">
              <div className="mb-2" style={{ fontSize: '2rem' }}>⭐</div>
              <h4 className="mb-0">4.8</h4>
              <small>Patient Rating</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="g-4 mb-5">
        <Col md={3}>
          <Card className="card-hover text-center h-100">
            <Card.Body>
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>📋</div>
              <Card.Title>All Appointments</Card.Title>
              <Card.Text>View and manage appointments</Card.Text>
              <Button as={Link} to="/appointments" variant="primary" size="sm">
                View All
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="card-hover text-center h-100">
            <Card.Body>
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>⏰</div>
              <Card.Title>Availability</Card.Title>
              <Card.Text>Set your available hours</Card.Text>
              <Button as={Link} to="/availability" variant="outline-primary" size="sm">
                Manage
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="card-hover text-center h-100">
            <Card.Body>
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>💊</div>
              <Card.Title>Prescriptions</Card.Title>
              <Card.Text>Create and manage prescriptions</Card.Text>
              <Button as={Link} to="/prescriptions" variant="outline-primary" size="sm">
                Manage
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="card-hover text-center h-100">
            <Card.Body>
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>👤</div>
              <Card.Title>Profile</Card.Title>
              <Card.Text>Update your profile information</Card.Text>
              <Button as={Link} to="/profile" variant="outline-primary" size="sm">
                Edit Profile
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Today's Appointments */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Today's Appointments</h5>
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
                  <p className="text-muted mb-0">No appointments scheduled for today</p>
                </div>
              ) : (
                <div className="row g-3">
                  {appointments.map(appointment => (
                    <div key={appointment.AppointmentID} className="col-md-6">
                      <Card className="appointment-card">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h6 className="mb-1">Patient #{appointment.PatientID}</h6>
                              <p className="text-muted small mb-0">
                                🕐 {appointment.TimeSlot}
                              </p>
                            </div>
                            <Badge bg={appointment.Status === 'Completed' ? 'success' : 'primary'}>
                              {appointment.Status}
                            </Badge>
                          </div>
                          
                          <div className="d-flex gap-2">
                            {appointment.Status === 'Booked' && (
                              <>
                                <Button 
                                  as={Link} 
                                  to={`/chat/${appointment.AppointmentID}`}
                                  variant="primary" 
                                  size="sm"
                                >
                                  Start Chat
                                </Button>
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  onClick={() => {/* Handle prescription creation */}}
                                >
                                  Create Prescription
                                </Button>
                              </>
                            )}
                            {appointment.Status === 'Completed' && (
                              <Button 
                                variant="outline-secondary" 
                                size="sm"
                                disabled
                              >
                                Completed
                              </Button>
                            )}
                          </div>
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

export default DoctorDashboard;