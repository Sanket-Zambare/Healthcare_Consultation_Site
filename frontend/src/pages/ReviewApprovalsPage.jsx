import React, { useEffect, useState } from 'react';
import { Button, Table, Spinner, Alert, Container } from 'react-bootstrap';
import apiService from "../services/apiService";

const ReviewApprovals = () => {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const fetchPendingDoctors = async () => {
    try {
      const data = await apiService.getPendingDoctors();
      setPendingDoctors(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch pending doctors');
    } finally {
      setLoading(false);
    }
  };

  const approveDoctor = async (id) => {
    try {
      await apiService.approveDoctor(id);
      setMessage(`Doctor #${id} approved successfully.`);
      fetchPendingDoctors();
    } catch (err) {
      console.error('Approval failed', err);
      setMessage('Error approving doctor.');
    }
  };

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  return (
    <Container className="mt-4">
      <h4>Pending Doctor Approvals</h4>

      {message && <Alert variant="info">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>#ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Specialization</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingDoctors.length > 0 ? (
              pendingDoctors.map((doctor) => (
                <tr key={doctor.doctorID}>
                  <td>{doctor.doctorID}</td>
                  <td>{doctor.name}</td>
                  <td>{doctor.email}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.profileStatus}</td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => approveDoctor(doctor.doctorID)}
                    >
                      Approve
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No pending doctors.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ReviewApprovals;
