import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, CheckCircle, AlertCircle, LogIn } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page user was trying to access
  const from = location.state?.from?.pathname || '/dashboard';
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (loginError) setLoginError('');
  };

const handleSubmit = async () => {
  setLoading(true);
  setLoginError('');

  try {
    const response = await authAPI.login({
      email: formData.email,
      password: formData.password
    });
    
    const { token, user } = response.data;
    
    if (!user.isVerified) {
      setLoginError('Your email is not verified. Please check your email and verify your account.');
      return;
    }
    
    // Use AuthContext login function
    login(user, token);
    
    alert(`Login successful! Welcome ${user.fullName}`);
    navigate(from, { replace: true });
    
  } catch (error) {
    const errorMessage = error.message || 'Login failed. Please try again.';
    setLoginError(errorMessage);
  } finally {
    setLoading(false);
  }
};

const handleCreateAccount = () => {
  navigate('/register');
};

const handleForgotPassword = () => {
  navigate('/forgot-password');
};

const handleResendVerification = () => {
  navigate('/resend-verification');
};

  // Smart validation helpers
  const isEmailValid = formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isPasswordValid = formData.password && formData.password.length >= 6;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '3rem 1rem',
      position: 'relative'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '20%',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '25%',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite reverse'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '10%',
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          filter: 'blur(30px)',
          animation: 'float 10s ease-in-out infinite'
        }} />
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        borderRadius: '1.5rem',
        padding: '2.5rem',
        maxWidth: '28rem',
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 1,
        opacity: 0,
        transform: 'translateY(-50px)',
        animation: 'slideIn 1s ease forwards',
        animationDelay: '0.3s'
      }}>
        <div style={{
          width: '4rem',
          height: '4rem',
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s ease'
        }}>
          <Shield color="white" size={32} />
        </div>
        
        <h2 style={{
          fontSize: '2.25rem',
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#fff',
          marginBottom: '1rem'
        }}>
          Welcome back
        </h2>
        
        <p style={{ 
          textAlign: 'center', 
          fontSize: '0.875rem', 
          color: 'rgba(255, 255, 255, 0.8)', 
          marginBottom: '2rem' 
        }}>
          Or{' '}
          <button 
            onClick={handleCreateAccount}
            style={{ 
              color: '#fff', 
              textDecoration: 'underline', 
              fontWeight: '500', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            create a new account
          </button>
        </p>

        {/* Error Message */}
        {loginError && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '0.75rem',
            padding: '0.75rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backdropFilter: 'blur(10px)'
          }}>
            <AlertCircle size={16} />
            {loginError}
          </div>
        )}

        <div>
          {/* Email */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#fff',
              marginBottom: '0.5rem'
            }}>
              Email address
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <Mail style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1.25rem',
                height: '1.25rem',
                color: focusedField === 'email' ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                transition: 'color 0.2s ease'
              }} />
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                style={{
                  width: '100%',
                  paddingLeft: '3rem',
                  paddingRight: formData.email ? '3rem' : '1rem',
                  paddingTop: '1rem',
                  paddingBottom: '1rem',
                  border: `2px solid ${focusedField === 'email' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
                  borderRadius: '0.75rem',
                  transition: 'all 0.3s ease',
                  background: 'rgba(255, 255, 255, 0.1)',
                  fontSize: '1rem',
                  outline: 'none',
                  boxShadow: focusedField === 'email' ? '0 0 0 4px rgba(255, 255, 255, 0.1)' : 'none',
                  boxSizing: 'border-box',
                  color: '#fff',
                  backdropFilter: 'blur(10px)'
                }}
                placeholder="Enter your email"
              />
              {formData.email && (
                isEmailValid ? (
                  <CheckCircle style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1.25rem',
                    height: '1.25rem',
                    color: '#10b981'
                  }} />
                ) : (
                  <AlertCircle style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1.25rem',
                    height: '1.25rem',
                    color: '#ef4444'
                  }} />
                )
              )}
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#fff',
              marginBottom: '0.5rem'
            }}>
              Password
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <Lock style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1.25rem',
                height: '1.25rem',
                color: focusedField === 'password' ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                transition: 'color 0.2s ease'
              }} />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                style={{
                  width: '100%',
                  paddingLeft: '3rem',
                  paddingRight: '3rem',
                  paddingTop: '1rem',
                  paddingBottom: '1rem',
                  border: `2px solid ${focusedField === 'password' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
                  borderRadius: '0.75rem',
                  transition: 'all 0.3s ease',
                  background: 'rgba(255, 255, 255, 0.1)',
                  fontSize: '1rem',
                  outline: 'none',
                  boxShadow: focusedField === 'password' ? '0 0 0 4px rgba(255, 255, 255, 0.1)' : 'none',
                  boxSizing: 'border-box',
                  color: '#fff',
                  backdropFilter: 'blur(10px)'
                }}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255, 255, 255, 0.6)',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#fff'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || !isEmailValid || !isPasswordValid}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '1rem 1.5rem',
              background: loading ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.75rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              transform: 'scale(1)',
              boxSizing: 'border-box',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'scale(1.02)', e.target.style.background = 'rgba(255, 255, 255, 0.4)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'scale(1)', e.target.style.background = 'rgba(255, 255, 255, 0.3)')}
          >
            {loading ? (
              <>
                <div style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '0.75rem'
                }} />
                Signing in...
              </>
            ) : (
              <>
                <LogIn style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                Sign in
              </>
            )}
          </button>
        </div>

        {/* Additional Links */}
        <div style={{ 
          marginTop: '1.5rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <button
            onClick={handleForgotPassword}
            style={{
              fontSize: '0.875rem',
              color: '#fff',
              textDecoration: 'underline',
              fontWeight: '500',
              transition: 'opacity 0.2s ease',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Forgot your password?
          </button>
          
          <button
            onClick={handleResendVerification}
            style={{
              fontSize: '0.875rem',
              color: 'rgba(255, 255, 255, 0.7)',
              textDecoration: 'underline',
              fontWeight: '400',
              transition: 'color 0.2s ease',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.color = '#fff'}
            onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
          >
            Didn't receive verification email?
          </button>
        </div>

        {/* Security Features */}
        <div style={{ 
          marginTop: '1.5rem', 
          paddingTop: '1.5rem', 
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.75rem' }}>
            🔒 Secure login with industry-standard encryption
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem', color: '#fff' }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '0.5rem',
                height: '0.5rem',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                marginRight: '0.25rem',
                animation: 'pulse 2s infinite'
              }} />
              2FA Ready
            </span>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '0.5rem',
                height: '0.5rem',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                marginRight: '0.25rem',
                animation: 'pulse 2s infinite',
                animationDelay: '0.5s'
              }} />
              SSL Protected
            </span>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '0.5rem',
                height: '0.5rem',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                marginRight: '0.25rem',
                animation: 'pulse 2s infinite',
                animationDelay: '1s'
              }} />
              Zero Logs
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};

export default Login;