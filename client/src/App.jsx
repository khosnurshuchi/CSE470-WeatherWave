import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import VerifyEmail from './pages/VerifyEmail';
import ResendVerification from './pages/ResendVerification';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PublicRoute from './components/PublicRoute';

// Weather Pages
import WeatherDashboard from './pages/WeatherDashboard';
import LocationManager from './pages/LocationManager';

// Loading component
function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        textAlign: 'center',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }}>
        <div style={{
          width: '2rem',
          height: '2rem',
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #047857',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Loading...</p>
      </div>
    </div>
  );
}

// Main App Router Component
function AppRouter() {
  const { user, loading } = useAuth();

  // Show loading screen while authentication state is being determined
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Navbar />
      <Routes>

        {/* Public Routes - Only accessible when NOT authenticated */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route
          path="/forgot-password"
          element={<PublicRoute><ForgotPassword /></PublicRoute>}
        />
        <Route
          path="/reset-password/:token"
          element={<PublicRoute><ResetPassword /></PublicRoute>}
        />

        {/* Email verification routes - Always accessible */}
        <Route path="/verify-email/:token" element={<PublicRoute><VerifyEmail /></PublicRoute>} />
        <Route path="/resend-verification" element={<PublicRoute><ResendVerification /></PublicRoute>} />

        {/* Protected Routes - Require authentication and verification */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Weather Routes - Protected */}
        <Route
          path="/weather"
          element={
            <ProtectedRoute>
              <WeatherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/locations"
          element={
            <ProtectedRoute>
              <LocationManager />
            </ProtectedRoute>
          }
        />

        {/* Default route */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/weather" replace /> : <Navigate to="/login" replace />
          }
        />

        {/* Catch-all route */}
        <Route
          path="*"
          element={
            user ? <Navigate to="/weather" replace /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <AppRouter />

            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 6000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  fontSize: '14px',
                  padding: '16px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                },
                success: {
                  duration: 5000,
                  style: {
                    background: '#10b981',
                    color: '#fff',
                  },
                  iconTheme: {
                    primary: '#fff',
                    secondary: '#10b981',
                  },
                },
                error: {
                  duration: 7000,
                  style: {
                    background: '#ef4444',
                    color: '#fff',
                  },
                  iconTheme: {
                    primary: '#fff',
                    secondary: '#ef4444',
                  },
                },
                loading: {
                  style: {
                    background: '#3b82f6',
                    color: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;