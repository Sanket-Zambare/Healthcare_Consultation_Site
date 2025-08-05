import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import apiService from '../services/apiService';
import DoctorAvailability from '../components/doctor/DoctorAvailability';

const AvailabilityPage = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const { showToast } = useApp();

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
    'Friday', 'Saturday', 'Sunday'
  ];

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const data = await apiService.getDoctorAvailability(user.DoctorID);
      
      // Initialize availability for all days
      const availabilityMap = {};
      daysOfWeek.forEach(day => {
        const dayAvailability = data.find(a => a.Day === day);
        availabilityMap[day] = dayAvailability || {
          Day: day,
          From: '09:00',
          To: '17:00',
          Status: 'Unavailable'
        };
      });
      
      setAvailability(Object.values(availabilityMap));
    } catch (err) {
      setError('Failed to fetch availability');
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityChange = (day, field, value) => {
    setAvailability(prev => 
      prev.map(avail => 
        avail.Day === day 
          ? { ...avail, [field]: value }
          : avail
      )
    );
  };

  const handleSaveAvailability = async () => {
    setSaving(true);
    try {
      await apiService.updateDoctorAvailability(user.DoctorID, availability);
      showToast('Availability updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update availability', 'error');
    } finally {
      setSaving(false);
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

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold">Manage Availability</h2>
              <p className="text-muted">Set your available hours for patient consultations</p>
            </div>
            
            <Button 
              variant="primary"
              onClick={handleSaveAvailability}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Card>
            <Card.Body>
              <DoctorAvailability 
                availability={availability}
                onAvailabilityChange={handleAvailabilityChange}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AvailabilityPage;