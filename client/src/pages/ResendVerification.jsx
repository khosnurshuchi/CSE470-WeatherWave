import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Mail, Send, Shield, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authAPI.resendVerification(email);
      setSent(true);
      toast.success('Verification email sent successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/login");
  };

  // Main container style matching dashboard
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '2rem 1rem',
    position: 'relative'
  };

  // Glassmorphism card style
  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    padding: '2.5rem',
    borderRadius: '1rem',
    maxWidth: '28rem',
    margin: '0 auto',
    width: '100%',
    color: '#fff'
  };

  const logoStyle = {
    width: '4rem',
    height: '4rem',
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
  };

  const successLogoStyle = {
    width: '4rem',
    height: '4rem',
    background: 'rgba(16, 185, 129, 0.8)',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    boxShadow: '0 4px 30px rgba(16, 185, 129, 0.3)',
    animation: 'pulse 2s infinite'
  };

  const titleStyle = {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: '1rem'
  };

  const subtitleStyle = {
    textAlign: 'center',
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '2rem',
    lineHeight: '1.5'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '0.5rem'
  };

  const inputContainerStyle = {
    position: 'relative',
    marginBottom: '1.5rem'
  };

  const inputStyle = {
    width: '100%',
    paddingLeft: '3rem',
    paddingRight: '1rem',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.75rem',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.1)',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#fff',
    backdropFilter: 'blur(10px)'
  };

  const inputFocusStyle = {
    ...inputStyle,
    border: '2px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.1)'
  };

  const iconStyle = {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '1.25rem',
    height: '1.25rem',
    color: 'rgba(255, 255, 255, 0.8)',
    transition: 'color 0.2s ease'
  };

  const buttonStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    background: loading ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '600',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '0.75rem',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    transform: 'scale(1)',
    boxSizing: 'border-box',
    marginBottom: '1.5rem',
    backdropFilter: 'blur(10px)'
  };

  const secondaryButtonStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '1rem',
    fontWeight: '600',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    transform: 'scale(1)',
    boxSizing: 'border-box',
    backdropFilter: 'blur(10px)'
  };

  const linkStyle = {
    color: 'rgba(255, 255, 255, 0.9)',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.875rem',
    transition: 'color 0.2s ease'
  };

  return (
    <div style={containerStyle}>
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
          top: '10%',
          left: '10%',
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
          right: '15%',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite reverse'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '24rem',
          height: '24rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          filter: 'blur(3rem)',
          animation: 'float 4s ease-in-out infinite',
          animationDelay: '2s'
        }} />
      </div>

      <div style={{...cardStyle, zIndex: 1}}>
        {!sent ? (
          <>
            <div style={logoStyle}>
              <Mail color="white" size={32} />
            </div>
            
            <h2 style={titleStyle}>Resend Verification</h2>
            
            <p style={subtitleStyle}>
              Enter your email address and we'll send you a new verification link
            </p>

            <div>
              <div>
                <label style={labelStyle}>Email address</label>
                <div style={inputContainerStyle}>
                  <Mail style={iconStyle} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    placeholder="Enter your email"
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={buttonStyle}
                onMouseEnter={(e) => !loading && (
                  e.target.style.transform = 'scale(1.02)',
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)'
                )}
                onMouseLeave={(e) => !loading && (
                  e.target.style.transform = 'scale(1)',
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)'
                )}
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
                    Sending...
                  </>
                ) : (
                  <>
                    <Send style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                    Send Verification Email
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={successLogoStyle}>
              <CheckCircle color="white" size={32} />
            </div>
            
            <h2 style={titleStyle}>Email Sent!</h2>
            
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '1rem', fontWeight: '600' }}>
                Verification Email Sent Successfully!
              </p>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                We've sent a verification email to{' '}
                <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{email}</strong>.{' '}
                Please check your inbox and click the verification link.
              </p>
            </div>

            <button
              onClick={() => {
                setSent(false);
                setEmail('');
              }}
              style={secondaryButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <Mail style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
              Send to Different Email
            </button>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            onClick={handleBackToLogin}
            style={{
              ...linkStyle,
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.color = '#fff'}
            onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
          >
            Back to Login
          </button>
        </div>

        {/* Security Features */}
        <div style={{ 
          marginTop: '1.5rem', 
          paddingTop: '1.5rem', 
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.75rem' }}>
            Your email verification is secure and encrypted
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)' }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '0.5rem',
                height: '0.5rem',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                marginRight: '0.25rem',
                animation: 'pulse 2s infinite'
              }} />
              Secure Delivery
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
              No Spam
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
              Quick Process
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
      `}</style>
    </div>
  );
};

export default ResendVerification;