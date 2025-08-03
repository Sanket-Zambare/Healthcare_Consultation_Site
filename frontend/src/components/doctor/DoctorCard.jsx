import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../assets/styles/custom.css';

const DoctorCard = ({ doctor }) => {
  const getSpecializationIcon = (specialization) => {
    const icons = {
      'Cardiology': '❤️',
      'Dermatology': '🧴',
      'Neurology': '🧠',
      'Pediatrics': '👶',
      'Psychiatry': '🧘',
      'Orthopedics': '🦴',
      'Gynecology': '🤱',
      'Ophthalmology': '👁️',
      'ENT': '👂',
      'General Medicine': '🩺'
    };
    return icons[specialization] || '🩺';
  };

  return (
    <Card className="doctor-card card-hover h-100">
      <Card.Body className="text-center">
        <div className="mb-3">
          <img
            src={doctor.DoctorImage}
            alt={doctor.Name}
            className="rounded-circle"
            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
          />
        </div>
        
        <Card.Title className="h5 mb-2">{doctor.Name}</Card.Title>
        
        <div className="mb-2">
          <Badge bg="primary" className="me-2">
            {getSpecializationIcon(doctor.Specialization)} {doctor.Specialization}
          </Badge>
        </div>
        
        <p className="text-muted small mb-2">
          📅 {doctor.Availability}
        </p>
        
        <p className="text-muted small mb-3">
          🎓 {doctor.Experience} experience
        </p>
        
        <div className="mb-3">
          <div className="d-flex justify-content-center align-items-center">
            <span className="text-warning me-1">⭐⭐⭐⭐⭐</span>
            <small className="text-muted">(4.8/5)</small>
          </div>
        </div>
        
        <div className="d-grid gap-2">
          <Button 
            as={Link} 
            to={`/book-appointment/${doctor.DoctorID}`}
            variant="primary"
            size="sm"
          >
            Book Appointment
          </Button>
          <Button 
            as={Link} 
            to={`/doctor-profile/${doctor.DoctorID}`}
            variant="outline-primary"
            size="sm"
          >
            View Profile
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DoctorCard;