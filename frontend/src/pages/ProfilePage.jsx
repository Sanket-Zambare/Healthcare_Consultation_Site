import React from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return <div className="text-center mt-5">Loading user data...</div>;

  const {
    name,
    username,
    email,
    phone,
    role,
    specialization,
    gender,
    address,
    age,
  } = user;

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h3 className="mb-4 text-primary">User Profile</h3>
              <Row>
                <Col xs={5}><strong>Name:</strong></Col>
                <Col xs={7}>{name || username}</Col>
              </Row>
              <Row className="mt-2">
                <Col xs={5}><strong>Email:</strong></Col>
                <Col xs={7}>{email}</Col>
              </Row>
              <Row className="mt-2">
                <Col xs={5}><strong>Role:</strong></Col>
                <Col xs={7} className="text-capitalize">{role}</Col>
              </Row>
              {phone && (
                <Row className="mt-2">
                  <Col xs={5}><strong>Phone:</strong></Col>
                  <Col xs={7}>{phone}</Col>
                </Row>
              )}
              {gender && (
                <Row className="mt-2">
                  <Col xs={5}><strong>Gender:</strong></Col>
                  <Col xs={7}>{gender}</Col>
                </Row>
              )}
              {age && (
                <Row className="mt-2">
                  <Col xs={5}><strong>Age:</strong></Col>
                  <Col xs={7}>{age}</Col>
                </Row>
              )}
              {specialization && (
                <Row className="mt-2">
                  <Col xs={5}><strong>Specialization:</strong></Col>
                  <Col xs={7}>{specialization}</Col>
                </Row>
              )}
              {address && (
                <Row className="mt-2">
                  <Col xs={5}><strong>Address:</strong></Col>
                  <Col xs={7}>{address}</Col>
                </Row>
              )}
              <div className="text-end mt-4">
                <Button variant="primary" disabled>Edit Profile</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
