import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const PatientRegisterForm = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Password: '',
    confirmPassword: '',
    Gender: '',
    DOB: '',
    ContactNumber: '',
    MedicalHistory: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerPatient } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'Gender' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.Password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const patientData = { ...formData };
      delete patientData.confirmPassword;

      console.log("Payload to send:", JSON.stringify(patientData)); // Optional debug

      await registerPatient(patientData);
      showToast('Registration successful! Please login to continue.', 'success');
      navigate('/login');
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
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
            <Form.Label>Confirm Password</Form.Label>
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

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              name="Gender"
              value={formData.Gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value={0}>Male</option>
              <option value={1}>Female</option>
              <option value={2}>Other</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="DOB"
              value={formData.DOB}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Contact Number</Form.Label>
        <Form.Control
          type="tel"
          name="ContactNumber"
          value={formData.ContactNumber}
          onChange={handleChange}
          placeholder="Enter your contact number"
          required
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Medical History (Optional)</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="MedicalHistory"
          value={formData.MedicalHistory}
          onChange={handleChange}
          placeholder="Enter any relevant medical history"
        />
      </Form.Group>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-100 mb-3"
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Register'}
      </Button>

      <div className="text-center">
        <p className="mb-0">
          Already have an account?{' '}
          <Link to="/login" className="text-decoration-none">
            Sign In
          </Link>
        </p>
      </div>
    </Form>
  );
};

export default PatientRegisterForm;
