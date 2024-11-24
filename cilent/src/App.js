// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom'; 
import Home from './Page/Home.js';
import Service from './Page/Service.js';
//import Home from './component/Home/Home.js';
import HeroSection from './component/HeroSection/HeroSection.js';
import Login from './component/Login/Login.js';
import Register from './component/Register/Register.js';
import Header from './component/Header/Header.js';
import VideoPlayer from './component/video/video.js';
import { AuthProvider } from './Context/AuthContext';
import ProtectedRoute from './Context/ProtectedRoute.js'; // Import AuthProvider
import Footer from './component/Footer/Footer.js';
import ServiceDetail from './Page/ServiceDetail.js';
import Booking from './Page/Booking.js';
import DashboardPage from './Admin/DashboardPage.jsx';
import Checkout from './Page/Checkout.js'
import BookingConfirmation from './component/Payment/Payment.js';
import ThanhToan from './Page/ThanhToan.js';
import WeeklySchedule from './component/WeeklySchedule/WeeklySchedule.js';
import ThankYouComponent from './component/Thank/thank.js';
import Profile from './component/Profile/profile.js';

const Layout = () => {
  const location = useLocation();
  const showHeaderFooter = !['/login', '/register',  '/admin-2', '/thank',].includes(location.pathname);

  return (
    <>
      {showHeaderFooter && <Header />}
      <Outlet />
      {showHeaderFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/admin-2" element={<ProtectedRoute requiredRole={1}><DashboardPage /></ProtectedRoute>} /> {/* Bảo vệ route */}
            <Route path="/service" element={<Service />} />
            <Route path="/servicedetail/:id" element={<ServiceDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/booking" element={<Checkout />} />
            <Route path="/thanhtoan" element={<ThanhToan />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/time" element={<Booking />} />
            <Route path="/register" element={<Register />} />
            <Route path="/thank" element={<ThankYouComponent />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;