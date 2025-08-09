import React from 'react';
import { Modal, Button, Card, Alert } from 'react-bootstrap';

const ViewPrescriptionModal = ({ show, onHide, prescription, userRole }) => {
  if (!prescription) {
    return (
      <Modal show={show} onHide={onHide} size="md" centered>
        <Modal.Header closeButton className="bg-warning text-dark">
          <Modal.Title>No Prescription Found</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <p>No prescription found for this appointment.</p>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>💊 Prescription</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Card className="mb-3">
          <Card.Body>
            <h6 className="text-primary mb-3">Prescription Details</h6>
            
            <div className="mb-3">
              <strong>Date Issued:</strong> {prescription.dateIssued || prescription.DateIssued ? 
                new Date(prescription.dateIssued || prescription.DateIssued).toLocaleDateString() : 'N/A'}
            </div>
            
            <div className="mb-3">
              <strong>Doctor:</strong> Dr. {prescription.doctor?.name || prescription.Doctor?.Name || 'Unknown Doctor'}
            </div>
            
            <div className="mb-3">
              <strong>Patient:</strong> {prescription.patient?.name || prescription.Patient?.Name || 'Unknown Patient'}
            </div>
            
            <div className="mb-3">
              <strong>Appointment Date:</strong> {prescription.appointment?.date || prescription.Appointment?.Date ? 
                new Date(prescription.appointment?.date || prescription.Appointment?.Date).toLocaleDateString() : 'N/A'}
            </div>
            
            <div className="mb-3">
              <strong>Medication Details:</strong>
              <div className="mt-2 p-3 bg-light border rounded">
                {prescription.medicationDetails || prescription.MedicationDetails || 'No medication details available'}
              </div>
            </div>
          </Card.Body>
        </Card>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewPrescriptionModal;
