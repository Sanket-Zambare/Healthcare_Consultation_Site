import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Layout
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ToastNotification from './components/common/ToastNotification';

// Route Guards
import ProtectedRoute from './routes/ProtectedRoute';
import PatientRoute from './routes/PatientRoute';
import DoctorRoute from './routes/DoctorRoute';
import AdminRoute from './routes/AdminRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterPatient from './pages/RegisterPatient';
import RegisterDoctor from './pages/RegisterDoctor';

// Patient Pages
import PatientDashboardPage from './pages/PatientDashboardPage';
import SearchDoctorsPage from './pages/SearchDoctorsPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import PaymentsPage from './pages/PaymentsPage';

// Shared Pages
import AppointmentsPage from './pages/AppointmentsPage';
import ChatPage from './pages/ChatPage';
import PrescriptionsPage from './pages/PrescriptionsPage';

// Doctor Pages
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import AvailabilityPage from './pages/AvailabilityPage';

// Admin Page
import AdminDashboardPage from './pages/AdminDashboardPage';

// Other
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1">
              <Routes>
                {/* 🌐 Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register-patient" element={<RegisterPatient />} />
                <Route path="/register-doctor" element={<RegisterDoctor />} />

                {/* 🩺 Patient Routes */}
                <Route path="/patient-dashboard" element={
                  <PatientRoute>
                    <PatientDashboardPage />
                  </PatientRoute>
                } />

                <Route path="/search-doctors" element={
                  <PatientRoute>
                    <SearchDoctorsPage />
                  </PatientRoute>
                } />

                <Route path="/book-appointment/:doctorId" element={
                  <PatientRoute>
                    <BookAppointmentPage />
                  </PatientRoute>
                } />

                <Route path="/payment/:appointmentId" element={
                  <PatientRoute>
                    <PaymentsPage />
                  </PatientRoute>
                } />

                <Route path="/payments" element={
                  <PatientRoute>
                    <PaymentsPage />
                  </PatientRoute>
                } />

                {/* 🔐 Protected Routes (for any authenticated user) */}
                <Route path="/appointments" element={
                  <ProtectedRoute>
                    <AppointmentsPage />
                  </ProtectedRoute>
                } />

                <Route path="/chat/:appointmentId" element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                } />

                <Route path="/prescriptions" element={
                  <ProtectedRoute>
                    <PrescriptionsPage />
                  </ProtectedRoute>
                } />

                {/* 👨‍⚕️ Doctor Routes */}
                <Route path="/doctor-dashboard" element={
                  <DoctorRoute>
                    <DoctorDashboardPage />
                  </DoctorRoute>
                } />

                <Route path="/availability" element={
                  <DoctorRoute>
                    <AvailabilityPage />
                  </DoctorRoute>
                } />

                {/* 🛠 Admin Routes */}
                <Route path="/admin-dashboard" element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                } />

                {/* 404 Not Found */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <ToastNotification />
          </div>
        </Router>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
