import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VehicleDetail from './components/VehicleDetail';
import Login from './components/Login';
import Header from './components/Header';
import Register from './components/Register';
import AddVehicle from './components/AddVehicle';
import EditVehicle from './components/EditVehicle';
import SelfDiagnosis from './components/SelfDiagnosis';
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import './App.css';

const LayoutWrapper = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const isForgotPasswordPage = location.pathname === '/forgot-password';
  const isResetPasswordPage = location.pathname.startsWith('/reset-password');
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  // Redirect to /login if not logged in and not already on login/register page
  if (!isLoggedIn && !isLoginPage && !isRegisterPage && !isForgotPasswordPage && !isResetPasswordPage) {
    return <Navigate to="/login" replace />;
  }

  if (isLoginPage) {
    return (
      <div className="app-container"> 
        <div className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    );
  }
  
  if (isRegisterPage) {
    return (
    <div className="app-container">
    <div className="main-content">
      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
    </div>
    );
  }

  if (isForgotPasswordPage) {
    return (
      <div className="app-container">
        <div className="main-content">
          <Routes>
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </div>
      </div>
    );
  }

  if (isResetPasswordPage) {
    return (
      <div className="app-container">
        <div className="main-content">
          <Routes>
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vehicle/:id" element={<VehicleDetail />} />
            <Route path="/Vehicle-add" element={<AddVehicle />} />
            <Route path="/Vehicle-detail" element={<VehicleDetail />} />
            <Route path="/vehicle/:id/edit" element={<EditVehicle />} />
            <Route path="/self-diagnosis" element={<SelfDiagnosis />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

function App() {
  useEffect(() => {
    // Clear tokens and login flags on first load
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
  }, []);

  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}

export default App;
