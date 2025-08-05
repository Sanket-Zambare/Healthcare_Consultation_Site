import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">
                Your Health, Our Priority
              </h1>
              <p className="lead mb-4">
                Connect with certified doctors from the comfort of your home. 
                Get quality healthcare consultations, prescriptions, and medical 
                advice through our secure telemedicine platform.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                {isAuthenticated ? (
                  <Button as={Link} to="/search-doctors" size="lg" variant="light">
                    Find Doctors
                  </Button>
                ) : (
                  <>
                    <Button as={Link} to="/register-patient" size="lg" variant="light">
                      Book Appointment
                    </Button>
                    <Button as={Link} to="/login" size="lg" variant="outline-light">
                      Login
                    </Button>
                  </>
                )}
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <img 
                src="https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Healthcare Professional"
                className="img-fluid rounded-3 shadow"
                style={{ maxHeight: '400px' }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <Container className="my-5 py-5">
        <Row className="text-center mb-5">
          <Col>
            <h2 className="display-5 fw-bold">Our Services</h2>
            <p className="lead text-muted">Comprehensive healthcare solutions at your fingertips</p>
          </Col>
        </Row>
        
        <Row className="g-4">
          <Col md={4}>
            <Card className="card-hover h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="mb-3" style={{ fontSize: '3rem' }}>🩺</div>
                <Card.Title>Online Consultations</Card.Title>
                <Card.Text>
                  Connect with certified doctors for video consultations and 
                  get medical advice from anywhere.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="card-hover h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="mb-3" style={{ fontSize: '3rem' }}>💊</div>
                <Card.Title>Digital Prescriptions</Card.Title>
                <Card.Text>
                  Receive digital prescriptions that you can download and 
                  use at any pharmacy.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="card-hover h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="mb-3" style={{ fontSize: '3rem' }}>📱</div>
                <Card.Title>Secure Messaging</Card.Title>
                <Card.Text>
                  Communicate securely with your healthcare providers through 
                  our encrypted messaging system.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Stats Section */}
      <section className="bg-light py-5">
        <Container>
          <Row className="text-center">
            <Col md={3} className="mb-4">
              <h3 className="display-4 fw-bold text-primary">500+</h3>
              <p className="lead">Certified Doctors</p>
            </Col>
            <Col md={3} className="mb-4">
              <h3 className="display-4 fw-bold text-primary">10K+</h3>
              <p className="lead">Happy Patients</p>
            </Col>
            <Col md={3} className="mb-4">
              <h3 className="display-4 fw-bold text-primary">25+</h3>
              <p className="lead">Specializations</p>
            </Col>
            <Col md={3} className="mb-4">
              <h3 className="display-4 fw-bold text-primary">24/7</h3>
              <p className="lead">Support Available</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <Container className="my-5 py-5 text-center">
        <Row>
          <Col lg={8} className="mx-auto">
            <h2 className="display-5 fw-bold mb-4">Ready to Get Started?</h2>
            <p className="lead mb-4">
              Join thousands of patients who trust our platform for their healthcare needs.
            </p>
            {!isAuthenticated && (
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button as={Link} to="/register-patient" size="lg" variant="primary">
                  Register as Patient
                </Button>
                <Button as={Link} to="/register-doctor" size="lg" variant="outline-primary">
                  Join as Doctor
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;