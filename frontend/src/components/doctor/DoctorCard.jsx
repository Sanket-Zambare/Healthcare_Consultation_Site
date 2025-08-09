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

  const renderAvailability = (availability) => {
    if (!availability || !Array.isArray(availability) || availability.length === 0)
      return 'Not Available';

    return availability.map((slot, index) => (
      <div key={index}>
        {slot.day}: {slot.from} - {slot.to} ({slot.status})
      </div>
    ));
  };

  return (
    <Card className="doctor-card card-hover h-100">
      <Card.Body className="text-center">
        
        <Card.Title className="h5 mb-2">
          Dr. {doctor.name || doctor.Name || 'Dr. Unknown'}
        </Card.Title>

        {/* Specialization */}
        <div className="mb-2">
          <Badge bg="primary" className="me-2">
            {getSpecializationIcon(doctor.specialization || doctor.Specialization)}{' '}
            {doctor.specialization || doctor.Specialization || 'General'}
          </Badge>
        </div>

        {/* Availability */}
        <p className="text-muted small mb-2">
          📅 {renderAvailability(doctor.availability || doctor.Availability)}
        </p>

        {/* Experience */}
        <p className="text-muted small mb-3">
          🎓 {doctor.experience || doctor.Experience || '0'} 
        </p>

        {/* Rating */}
        <div className="mb-3">
          <div className="d-flex justify-content-center align-items-center">
            <span className="text-warning me-1">⭐⭐⭐⭐⭐</span>
            <small className="text-muted">(4.8/5)</small>
          </div>
        </div>

        {/* Buttons */}
        <div className="d-grid gap-2">
          <Button
            as={Link}
            to={`/book-appointment/${doctor.doctorID || doctor.DoctorID}`}
            variant="primary"
            size="sm"
          >
            Book Appointment
          </Button>
          {/* <Button
            as={Link}
            to={`/doctor-profile/${doctor.doctorID || doctor.DoctorID}`}
            variant="outline-primary"
            size="sm"
          >
            View Profile
          </Button> */}
        </div>
      </Card.Body>
    </Card>
  );
};

export default DoctorCard;
