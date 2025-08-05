import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import ChatWindow from '../components/chat/ChatWindow';

const ChatPage = () => {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chatActive, setChatActive] = useState(true);
  
  const { user } = useAuth();

  useEffect(() => {
    fetchAppointmentAndMessages();
  }, [appointmentId]);

  const fetchAppointmentAndMessages = async () => {
    try {
      // Fetch appointment details
      let appointments;
      if (user.role === 'patient') {
        appointments = await apiService.getAppointments(user.PatientID);
      } else {
        appointments = await apiService.getAppointments(null, user.DoctorID);
      }
      
      const apt = appointments.find(a => a.AppointmentID === parseInt(appointmentId));
      if (!apt) {
        throw new Error('Appointment not found');
      }
      
      setAppointment(apt);
      
      // Check if chat should be active (only during appointment time and if paid)
      const isToday = apt.Date === new Date().toISOString().split('T')[0];
      const isPaid = apt.PaymentStatus === 'Paid';
      setChatActive(isToday && isPaid);
      
      // Fetch messages
      const messageData = await apiService.getMessages(parseInt(appointmentId));
      setMessages(messageData);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (content) => {
    try {
      const messageData = {
        SenderID: user.role === 'patient' ? user.PatientID : user.DoctorID,
        ReceiverID: user.role === 'patient' ? appointment.DoctorID : appointment.PatientID,
        AppointmentID: parseInt(appointmentId),
        Content: content
      };
      
      const newMessage = await apiService.sendMessage(messageData);
      setMessages(prev => [...prev, newMessage]);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleEndChat = async () => {
    try {
      await apiService.updateAppointment(parseInt(appointmentId), {
        Status: 'Completed'
      });
      setChatActive(false);
    } catch (err) {
      console.error('Failed to end chat:', err);
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

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!chatActive) {
    return (
      <Container className="my-4">
        <Alert variant="warning">
          <h5>Chat Not Available</h5>
          <p>
            {appointment.Status === 'Completed' 
              ? 'This consultation has been completed.' 
              : 'Chat is only available during your appointment time and after payment confirmation.'}
          </p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <Card>
            <Card.Header className="bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">
                    Consultation Chat
                  </h5>
                  <small>
                    {user.role === 'patient' ? 'Dr. Smith' : `Patient #${appointment.PatientID}`} • 
                    {appointment.Date} • {appointment.TimeSlot}
                  </small>
                </div>
                {user.role === 'doctor' && chatActive && (
                  <button 
                    className="btn btn-outline-light btn-sm"
                    onClick={handleEndChat}
                  >
                    End Consultation
                  </button>
                )}
              </div>
            </Card.Header>
            
            <Card.Body className="p-0">
              <ChatWindow 
                messages={messages}
                currentUserId={user.role === 'patient' ? user.PatientID : user.DoctorID}
                onSendMessage={handleSendMessage}
                chatActive={chatActive}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatPage;