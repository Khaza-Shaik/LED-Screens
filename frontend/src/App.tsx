import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Locations from './pages/Locations';
import LaunchCampaign from './pages/LaunchCampaign';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ApiDocs from './pages/ApiDocs';
import MyBookings from './pages/MyBookings';
import ScreenPreview from './pages/ScreenPreview';




function AppContent() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  const isScreenPage = location.pathname.startsWith('/screen/');
  const shouldHideUI = isAuthPage || isScreenPage || !token;

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {!shouldHideUI && <Navbar />}
      <main className="flex-grow flex flex-col">
        <Routes>
          {/* ── Public routes ─────────────────────── */}
          <Route path="/login"    element={<Login />} />
          <Route path="/docs" element={<ApiDocs />} />
          <Route path="/screen/:deviceId" element={<ScreenPreview />} />


          {/* ── Protected routes ──────────────────── */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/locations" element={<ProtectedRoute><Locations /></ProtectedRoute>} />
          <Route path="/launch-campaign" element={<ProtectedRoute><LaunchCampaign /></ProtectedRoute>} />
          <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
          <Route path="/slot-booked" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          {/* ── Fallback ──────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!shouldHideUI && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
