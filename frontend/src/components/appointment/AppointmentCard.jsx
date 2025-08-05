import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const AppointmentCard = ({ appointment, userRole, onUpdate }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'danger';
      case 'Booked':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  const getPaymentStatusVariant = (status) => {
    return status === 'Paid' ? 'success' : 'warning';
  };

  const isAppointmentToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointment.Date === today;
  };

  const canStartChat = () => {
    return appointment.Status === 'Booked' && 
           appointment.PaymentStatus === 'Paid' && 
           isAppointmentToday();
  };

  return (
    <Card className="appointment-card h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h6 className="mb-1">
              {userRole === 'patient' ? 'Dr. Smith' : `Patient #${appointment.PatientID}`}
            </h6>
            <p className="text-muted small mb-0">
              Appointment #{appointment.AppointmentID}
            </p>
          </div>
          <Badge bg={getStatusVariant(appointment.Status)}>
            {appointment.Status}
          </Badge>
        </div>

        <div className="mb-3">
          <p className="mb-1">
            <strong>📅 Date:</strong> {formatDate(appointment.Date)}
          </p>
          <p className="mb-1">
            <strong>🕐 Time:</strong> {appointment.TimeSlot}
          </p>
          <p className="mb-0">
            <strong>💳 Payment:</strong>{' '}
            <Badge bg={getPaymentStatusVariant(appointment.PaymentStatus)} className="ms-1">
              {appointment.PaymentStatus}
            </Badge>
          </p>
        </div>

        <div className="d-grid gap-2">
          {userRole === 'patient' && (
            <>
              {appointment.PaymentStatus === 'Unpaid' && (
                <Button 
                  as={Link} 
                  to={`/payment/${appointment.AppointmentID}`}
                  variant="warning" 
                  size="sm"
                >
                  Complete Payment
                </Button>
              )}
              
              {canStartChat() && (
                <Button 
                  as={Link} 
                  to={`/chat/${appointment.AppointmentID}`}
                  variant="success" 
                  size="sm"
                >
                  Join Consultation
                </Button>
              )}
              
              {appointment.Status === 'Completed' && (
                <Button 
                  as={Link} 
                  to={`/prescriptions?appointment=${appointment.AppointmentID}`}
                  variant="outline-primary" 
                  size="sm"
                >
                  View Prescription
                </Button>
              )}
            </>
          )}

          {userRole === 'doctor' && (
            <>
              {canStartChat() && (
                <Button 
                  as={Link} 
                  to={`/chat/${appointment.AppointmentID}`}
                  variant="primary" 
                  size="sm"
                >
                  Start Consultation
                </Button>
              )}
              
              {appointment.Status === 'Booked' && appointment.PaymentStatus === 'Paid' && (
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => {/* Handle create prescription */}}
                >
                  Create Prescription
                </Button>
              )}
              
              {appointment.Status === 'Completed' && (
                <Button 
                  as={Link} 
                  to={`/prescriptions?appointment=${appointment.AppointmentID}`}
                  variant="outline-secondary" 
                  size="sm"
                >
                  View Prescription
                </Button>
              )}
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default AppointmentCard;