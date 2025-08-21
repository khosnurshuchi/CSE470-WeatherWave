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

  // Inline styles for better compatibility
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '3rem 1rem',
    position: 'relative'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    padding: '2.5rem',
    borderRadius: '1.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    maxWidth: '28rem',
    margin: '0 auto',
    width: '100%'
  };

  const logoStyle = {
    width: '4rem',
    height: '4rem',
    background: 'linear-gradient(135deg, #047857, #065f46)',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    boxShadow: '0 10px 25px rgba(4, 120, 87, 0.3)',
    transition: 'transform 0.3s ease'
  };

  const titleStyle = {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #047857, #065f46)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '1rem'
  };

  const inputGroupStyle = {
    marginBottom: '1.5rem'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem'
  };

  const inputContainerStyle = {
    position: 'relative',
    width: '100%'
  };

  const getInputStyle = (fieldName) => ({
    width: '100%',
    paddingLeft: '3rem',
    paddingRight: formData[fieldName] ? '3rem' : '1rem',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    border: `2px solid ${focusedField === fieldName ? '#047857' : '#d1d5db'}`,
    borderRadius: '0.75rem',
    transition: 'all 0.3s ease',
    background: 'white',
    fontSize: '1rem',
    outline: 'none',
    boxShadow: focusedField === fieldName ? '0 0 0 4px rgba(4, 120, 87, 0.1)' : 'none',
    boxSizing: 'border-box'
  });

  const iconStyle = {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '1.25rem',
    height: '1.25rem',
    color: focusedField ? '#10b981' : '#9ca3af',
    transition: 'color 0.2s ease'
  };

  const validationIconStyle = {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '1.25rem',
    height: '1.25rem'
  };

  const buttonStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #047857, #065f46)',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '0.75rem',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 14px 0 rgba(4, 120, 87, 0.5)',
    transform: 'scale(1)',
    boxSizing: 'border-box'
  };

  const errorStyle = {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '0.5rem',
    padding: '0.75rem',
    marginBottom: '1rem',
    fontSize: '0.875rem',
    color: '#dc2626',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };
  

  return (
    <div style={containerStyle}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        inset: '0',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '-10rem',
          right: '-10rem',
          width: '20rem',
          height: '20rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.2))',
          borderRadius: '50%',
          filter: 'blur(3rem)',
          animation: 'pulse 4s infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10rem',
          left: '-10rem',
          width: '20rem',
          height: '20rem',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(16, 185, 129, 0.2))',
          borderRadius: '50%',
          filter: 'blur(3rem)',
          animation: 'pulse 4s infinite',
          animationDelay: '2s'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '24rem',
          height: '24rem',
          background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.2), rgba(16, 185, 129, 0.2))',
          borderRadius: '50%',
          filter: 'blur(3rem)',
          animation: 'pulse 4s infinite',
          animationDelay: '4s'
        }} />
      </div>

      <div style={cardStyle}>
        <div style={logoStyle}>
          <Shield color="white" size={32} />
        </div>
        
        <h2 style={titleStyle}>Welcome back</h2>
        
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginBottom: '2rem' }}>
          Or{' '}
          <button 
            onClick={handleCreateAccount}
            style={{ 
              color: '#047857', 
              textDecoration: 'none', 
              fontWeight: '500', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#065f46'}
            onMouseLeave={(e) => e.target.style.color = '#047857'}
          >
            create a new account
          </button>
        </p>

        {/* Error Message */}
        {loginError && (
          <div style={errorStyle}>
            <AlertCircle size={16} />
            {loginError}
          </div>
        )}

        <div>
          {/* Email */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email address</label>
            <div style={inputContainerStyle}>
              <Mail style={{...iconStyle, color: focusedField === 'email' ? '#047857' : '#9ca3af'}} />
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                style={getInputStyle('email')}
                placeholder="Enter your email"
              />
              {formData.email && (
                isEmailValid ? (
                  <CheckCircle style={{...validationIconStyle, color: '#047857'}} />
                ) : (
                  <AlertCircle style={{...validationIconStyle, color: '#ef4444'}} />
                )
              )}
            </div>
          </div>

          {/* Password */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <div style={inputContainerStyle}>
              <Lock style={{...iconStyle, color: focusedField === 'password' ? '#047857' : '#9ca3af'}} />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                style={{...getInputStyle('password'), paddingRight: '3rem'}}
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
                  color: '#9ca3af',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#047857'}
                onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
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
            style={buttonStyle}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'scale(1)')}
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
              color: '#047857',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.2s ease',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.color = '#065f46'}
            onMouseLeave={(e) => e.target.style.color = '#047857'}
          >
            Forgot your password?
          </button>
          
          <button
            onClick={handleResendVerification}
            style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              textDecoration: 'none',
              fontWeight: '400',
              transition: 'color 0.2s ease',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.color = '#047857'}
            onMouseLeave={(e) => e.target.style.color = '#6b7280'}
          >
            Didn't receive verification email?
          </button>
        </div>

        {/* Security Features */}
        <div style={{ 
          marginTop: '1.5rem', 
          paddingTop: '1.5rem', 
          borderTop: '1px solid rgba(4, 120, 87, 0.2)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.75rem' }}>
            🔒 Secure login with industry-standard encryption
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem', color: '#047857' }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '0.5rem',
                height: '0.5rem',
                backgroundColor: '#047857',
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
                backgroundColor: '#047857',
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
                backgroundColor: '#047857',
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
      `}</style>
    </div>
  );
};

export default Login;