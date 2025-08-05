import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import apiService from '../services/apiService';

const PrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [newPrescription, setNewPrescription] = useState({
    AppointmentID: '',
    MedicationDetails: ''
  });
  
  const { user } = useAuth();
  const { showToast } = useApp();

  useEffect(() => {
    fetchPrescriptions();
    if (user.role === 'doctor') {
      fetchCompletedAppointments();
    }
  }, []);

  const fetchPrescriptions = async () => {
    try {
      let data;
      if (user.role === 'patient') {
        data = await apiService.getPrescriptions(user.PatientID);
      } else if (user.role === 'doctor') {
        data = await apiService.getPrescriptions(null, user.DoctorID);
      }
      
      setPrescriptions(data);
    } catch (err) {
      setError('Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedAppointments = async () => {
    try {
      const data = await apiService.getAppointments(null, user.DoctorID);
      const completed = data.filter(apt => apt.Status === 'Completed');
      setAppointments(completed);
    } catch (err) {
      console.error('Failed to fetch appointments');
    }
  };

  const handleCreatePrescription = async (e) => {
    e.preventDefault();
    
    try {
      const prescriptionData = {
        ...newPrescription,
        DoctorID: user.DoctorID,
        PatientID: appointments.find(apt => apt.AppointmentID === parseInt(newPrescription.AppointmentID))?.PatientID
      };
      
      await apiService.createPrescription(prescriptionData);
      showToast('Prescription created successfully!', 'success');
      setShowCreateModal(false);
      setNewPrescription({ AppointmentID: '', MedicationDetails: '' });
      fetchPrescriptions();
    } catch (err) {
      showToast('Failed to create prescription', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold">Prescriptions</h2>
              <p className="text-muted">
                {user.role === 'patient' ? 'Your digital prescriptions' : 'Manage patient prescriptions'}
              </p>
            </div>
            
            {user.role === 'doctor' && (
              <Button 
                variant="primary"
                onClick={() => setShowCreateModal(true)}
              >
                Create Prescription
              </Button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : prescriptions.length === 0 ? (
            <Card className="text-center py-5">
              <Card.Body>
                <div className="mb-3" style={{ fontSize: '3rem' }}>💊</div>
                <h5>No prescriptions found</h5>
                <p className="text-muted">
                  {user.role === 'patient' 
                    ? "You don't have any prescriptions yet." 
                    : "No prescriptions created yet."}
                </p>
              </Card.Body>
            </Card>
          ) : (
            <Row className="g-4">
              {prescriptions.map(prescription => (
                <Col key={prescription.PrescriptionID} md={6} lg={4}>
                  <Card className="h-100 card-hover">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h6 className="mb-0">
                          Prescription #{prescription.PrescriptionID}
                        </h6>
                        <span className="badge bg-success">Active</span>
                      </div>
                      
                      <p className="mb-2">
                        <strong>Date Issued:</strong> {formatDate(prescription.DateIssued)}
                      </p>
                      
                      <p className="mb-2">
                        <strong>Doctor:</strong> Dr. Smith
                      </p>
                      
                      <p className="mb-3">
                        <strong>Medication:</strong><br/>
                        <small className="text-muted">{prescription.MedicationDetails}</small>
                      </p>
                      
                      <div className="d-grid gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => window.open(prescription.FilePath, '_blank')}
                        >
                          📄 Download PDF
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                        >
                          📧 Share
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>

      {/* Create Prescription Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create Prescription</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreatePrescription}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Select Appointment</Form.Label>
              <Form.Select
                value={newPrescription.AppointmentID}
                onChange={(e) => setNewPrescription({
                  ...newPrescription,
                  AppointmentID: e.target.value
                })}
                required
              >
                <option value="">Choose appointment...</option>
                {appointments.map(apt => (
                  <option key={apt.AppointmentID} value={apt.AppointmentID}>
                    Patient #{apt.PatientID} - {apt.Date} - {apt.TimeSlot}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Medication Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={newPrescription.MedicationDetails}
                onChange={(e) => setNewPrescription({
                  ...newPrescription,
                  MedicationDetails: e.target.value
                })}
                placeholder="Enter medication details, dosage, and instructions..."
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Prescription
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default PrescriptionsPage;