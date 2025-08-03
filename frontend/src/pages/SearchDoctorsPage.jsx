import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, Button } from 'react-bootstrap';
import apiService from '../services/apiService';
import DoctorCard from '../components/doctor/DoctorCard';

const SearchDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    specialization: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [filters, doctors]);

  const fetchDoctors = async () => {
    try {
      const data = await apiService.getDoctors();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (err) {
      console.error('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = doctors;

    if (filters.name) {
      filtered = filtered.filter(doctor =>
        doctor.Name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.specialization) {
      filtered = filtered.filter(doctor =>
        doctor.Specialization.toLowerCase().includes(filters.specialization.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const specializations = [
    'All Specializations',
    'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Psychiatry',
    'Orthopedics', 'Gynecology', 'Ophthalmology', 'ENT', 'General Medicine'
  ];

  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Find Doctors</h2>
          <p className="text-muted">Search and connect with healthcare professionals</p>
        </Col>
      </Row>

      {/* Search Filters */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Search by Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter doctor's name"
              value={filters.name}
              onChange={handleFilterChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Filter by Specialization</Form.Label>
            <Form.Select
              name="specialization"
              value={filters.specialization}
              onChange={handleFilterChange}
            >
              {specializations.map(spec => (
                <option key={spec} value={spec === 'All Specializations' ? '' : spec}>
                  {spec}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Results */}
      <Row>
        <Col>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <Card className="text-center py-5">
              <Card.Body>
                <h5>No doctors found</h5>
                <p className="text-muted mb-3">
                  Try adjusting your search criteria or browse all doctors.
                </p>
                <Button variant="primary" onClick={() => setFilters({ name: '', specialization: '' })}>
                  Clear Filters
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Row className="g-4">
              {filteredDoctors.map(doctor => (
                <Col key={doctor.DoctorID} md={6} lg={4}>
                  <DoctorCard doctor={doctor} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SearchDoctorsPage;