import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import apiService from '../../services/apiService';


const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const data = await apiService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Admin Dashboard</h2>
          <p className="text-muted">System overview and management</p>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-5">
        <Col md={3}>
          <Card className="dashboard-stats h-100">
            <Card.Body className="text-center">
              <div className="mb-2" style={{ fontSize: '2rem' }}>👥</div>
              <h3 className="mb-0">{stats.totalPatients || 0}</h3>
              <small>Total Patients</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-stats h-100">
            <Card.Body className="text-center">
              <div className="mb-2" style={{ fontSize: '2rem' }}>👨‍⚕️</div>
              <h3 className="mb-0">{stats.totalDoctors || 0}</h3>
              <small>Total Doctors</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-stats h-100">
            <Card.Body className="text-center">
              <div className="mb-2" style={{ fontSize: '2rem' }}>📅</div>
              <h3 className="mb-0">{stats.totalAppointments || 0}</h3>
              <small>Total Appointments</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-stats h-100">
            <Card.Body className="text-center">
              <div className="mb-2" style={{ fontSize: '2rem' }}>💰</div>
              <h3 className="mb-0">${(stats.totalPayments * 500) || 0}</h3>
              <small>Total Revenue</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Management Cards */}
      <Row className="g-4 mb-5">
        <Col md={4}>
          <Card className="card-hover h-100">
            <Card.Body className="text-center">
              <div className="mb-3" style={{ fontSize: '3rem' }}>👨‍⚕️</div>
              <Card.Title>Doctor Approvals</Card.Title>
              <Card.Text>
                {stats.pendingApprovals || 0} doctors pending approval
              </Card.Text>
              <Button variant="primary" size="sm">
                Review Approvals
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="card-hover h-100">
            <Card.Body className="text-center">
              <div className="mb-3" style={{ fontSize: '3rem' }}>👥</div>
              <Card.Title>User Management</Card.Title>
              <Card.Text>
                Manage patients and doctors accounts
              </Card.Text>
              <Button variant="outline-primary" size="sm">
                Manage Users
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="card-hover h-100">
            <Card.Body className="text-center">
              <div className="mb-3" style={{ fontSize: '3rem' }}>📊</div>
              <Card.Title>System Logs</Card.Title>
              <Card.Text>
                View system activity and logs
              </Card.Text>
              <Button variant="outline-primary" size="sm">
                View Logs
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Activity</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Activity</th>
                      <th>User</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>New Doctor Registration</td>
                      <td>Dr. John Smith</td>
                      <td>2024-01-15</td>
                      <td><span className="badge bg-warning">Pending</span></td>
                    </tr>
                    <tr>
                      <td>Patient Registration</td>
                      <td>Jane Doe</td>
                      <td>2024-01-15</td>
                      <td><span className="badge bg-success">Approved</span></td>
                    </tr>
                    <tr>
                      <td>Appointment Completed</td>
                      <td>Patient #1 - Dr. Sarah</td>
                      <td>2024-01-14</td>
                      <td><span className="badge bg-success">Completed</span></td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AdminDashboard;