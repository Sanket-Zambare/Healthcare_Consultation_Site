import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import apiService from '../../services/apiService';
import '../../assets/styles/custom.css';

const DoctorRegisterForm = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Password: '',
    confirmPassword: '',
    Specialization: '',
    Degree: '',
    Experience: '',
    ContactNumber: '',
    Day: '',
    From: '',
    To: '',
    Status: 'Available'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerDoctor } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const isValidIndianMobileNumber = (number) => /^[6-9]\d{9}$/.test(number);

  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/.test(password);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isValidEmail(formData.Email)) {
      setError('Invalid email format.');
      setLoading(false);
      return;
    }

    if (parseInt(formData.Experience) < 5) {
      setError('Doctor must have at least 5 years of experience.');
      setLoading(false);
      return;
    }

    if (!formData.Degree || !['MD', 'MBBS'].includes(formData.Degree)) {
      setError('Please select a valid medical degree (MD or MBBS).');
      setLoading(false);
      return;
    }

    if (formData.Password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!isStrongPassword(formData.Password)) {
      setError(
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.'
      );
      setLoading(false);
      return;
    }

    if (!isValidIndianMobileNumber(formData.ContactNumber)) {
      setError('Contact number must be a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      setLoading(false);
      return;
    }

    try {
      const emailExists = await apiService.checkDoctorEmailExists(formData.Email);
      if (emailExists) {
        setError('This email is already registered. Please login.');
        setLoading(false);
        return;
      }

      const doctorData = {
        Name: formData.Name,
        Email: formData.Email,
        Password: formData.Password,
        Specialization: formData.Specialization,
        Degree: formData.Degree,
        Experience: parseInt(formData.Experience),
        ContactNumber: formData.ContactNumber,
        ProfileStatus: 'Pending',
        Doctor_Image: '',
        Availabilities: [
          {
            Day: formData.Day,
            From: formData.From,
            To: formData.To,
            Status: formData.Status
          }
        ]
      };

      await registerDoctor(doctorData);
      showToast('Registration successful! Your account is pending approval.', 'success');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed.');
      showToast(err.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const specializations = [
    'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Psychiatry',
    'Orthopedics', 'Gynecology', 'Ophthalmology', 'ENT', 'General Medicine'
  ];

  const medicalDegrees = [
    { value: 'MD', label: 'MD (Doctor of Medicine)' },
    { value: 'MBBS', label: 'MBBS (Bachelor of Medicine, Bachelor of Surgery)' }
  ];

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const timeSlots = [
    { label: 'Morning (08:00 - 12:00)', from: '08:00:00', to: '12:00:00' },
    { label: 'Afternoon (12:00 - 16:00)', from: '12:00:00', to: '16:00:00' },
    { label: 'Evening (16:00 - 20:00)', from: '16:00:00', to: '20:00:00' },
    { label: 'Full Day (09:00 - 17:00)', from: '09:00:00', to: '17:00:00' }
  ];

  return (
    <Card className="shadow-sm">
      <Card.Body className="p-4">
        <h3 className="text-center mb-4 text-primary">Doctor Registration</h3>
        
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Personal Information Section */}
          <div className="mb-4">
            <h5 className="text-secondary mb-3">Personal Information</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={handleChange}
                    placeholder="Dr. John Doe"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    placeholder="doctor@example.com"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="Password"
                    value={formData.Password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Professional Information Section */}
          <div className="mb-4">
            <h5 className="text-secondary mb-3">Professional Information</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Medical Degree</Form.Label>
                  <Form.Select
                    name="Degree"
                    value={formData.Degree}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Medical Degree</option>
                    {medicalDegrees.map(degree => (
                      <option key={degree.value} value={degree.value}>{degree.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Specialization</Form.Label>
                  <Form.Select
                    name="Specialization"
                    value={formData.Specialization}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Specialization</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Experience (years)</Form.Label>
                  <Form.Control
                    type="number"
                    name="Experience"
                    value={formData.Experience}
                    onChange={handleChange}
                    min="5"
                    placeholder="Minimum 5 years"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Contact Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="ContactNumber"
                    value={formData.ContactNumber}
                    onChange={handleChange}
                    placeholder="Enter your contact number"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Availability Section */}
          <div className="mb-4">
            <h5 className="text-secondary mb-3">Availability</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Preferred Day</Form.Label>
                  <Form.Select
                    name="Day"
                    value={formData.Day}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Day</option>
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Time Slot</Form.Label>
                  <Form.Select
                    onChange={(e) => {
                      const [from, to] = e.target.value.split(',');
                      setFormData(prev => ({ ...prev, From: from, To: to }));
                    }}
                    required
                  >
                    <option value="">Select Time Slot</option>
                    {timeSlots.map(slot => (
                      <option key={slot.label} value={`${slot.from},${slot.to}`}>
                        {slot.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-100 mb-3"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register as Doctor'}
          </Button>

          <div className="text-center">
            <p className="mb-0">
              Already have an account?{' '}
              <Link to="/login" className="text-decoration-none fw-semibold">
                Sign In
              </Link>
            </p>
          </div>

          <Alert variant="info" className="mt-3">
            <small>
              <i className="fas fa-info-circle me-2"></i>
              Your account will be reviewed by our admin team. You'll be notified once approved.
            </small>
          </Alert>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default DoctorRegisterForm;
