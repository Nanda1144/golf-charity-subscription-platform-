import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import Admin from './pages/Admin';
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import Payment from './pages/Payment';
import Invoice from './pages/Invoice';
import PaymentSuccess from './pages/PaymentSuccess';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading: authLoading } = useAuth();
  const searchParams = new URLSearchParams(window.location.search);
  const isExploring = searchParams.get('explore') === 'true';

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-emerald-950 font-bold text-white italic">Validating Identity...</div>;
  }

  if (!user && !isExploring) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && (!user || !user.isAdmin)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <PrivateRoute adminOnly={true}>
                <Admin />
              </PrivateRoute>
            } 
          />
          <Route path="/pricing" element={<Pricing />} />
          <Route 
            path="/payment-success" 
            element={
              <PrivateRoute>
                <PaymentSuccess />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/payment" 
            element={
              <PrivateRoute>
                 <Payment />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/invoice" 
            element={
              <PrivateRoute>
                 <Invoice />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Landing />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
