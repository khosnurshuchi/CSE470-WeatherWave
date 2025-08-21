import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { CheckCircle, XCircle, Mail, Loader, RefreshCw } from 'lucide-react';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  
  // Use ref to track if verification has been attempted
  const verificationAttempted = useRef(false);

  useEffect(() => {
    // Prevent multiple API calls
    if (verificationAttempted.current || !token) {
      return;
    }
    
    verificationAttempted.current = true;
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      console.log('🔍 Starting email verification for token:', token?.substring(0, 10) + '...');
      const response = await authAPI.verifyEmail(token);
      console.log('✅ Verification successful:', response);
      setStatus('success');
      setMessage(response.message);
    } catch (error) {
      console.error('❌ Verification failed:', error);
      setStatus('error');
      setMessage(error.message || 'Email verification failed');
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleResendVerification = () => {
    navigate("/resend-verification");
  };

  // Inline styles matching Login/Register theme
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
    width: '100%',
    textAlign: 'center'
  };

  const successLogoStyle = {
    width: '5rem',
    height: '5rem',
    background: 'linear-gradient(135deg, #10b981, #047857)',
    borderRadius: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    boxShadow: '0 15px 35px rgba(16, 185, 129, 0.4)',
    animation: 'pulse 2s infinite'
  };

  const errorLogoStyle = {
    width: '5rem',
    height: '5rem',
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    borderRadius: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    boxShadow: '0 15px 35px rgba(239, 68, 68, 0.4)',
    animation: 'pulse 2s infinite'
  };

  const loadingLogoStyle = {
    width: '5rem',
    height: '5rem',
    background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
    borderRadius: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    boxShadow: '0 15px 35px rgba(59, 130, 246, 0.4)'
  };

  const titleStyle = {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  };

  const successTitleStyle = {
    ...titleStyle,
    background: 'linear-gradient(135deg, #10b981, #047857)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  };

  const errorTitleStyle = {
    ...titleStyle,
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  };

  const loadingTitleStyle = {
    ...titleStyle,
    background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  };

  const messageStyle = {
    fontSize: '0.875rem',
    color: '#6b7280',
    lineHeight: '1.5',
    marginBottom: '2rem'
  };

  const buttonStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    background: 'linear-gradient(135deg, #047857, #065f46)',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 14px 0 rgba(4, 120, 87, 0.5)',
    transform: 'scale(1)',
    boxSizing: 'border-box',
    marginBottom: '1rem',
    textDecoration: 'none'
  };

  const secondaryButtonStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    background: 'rgba(4, 120, 87, 0.1)',
    color: '#047857',
    fontSize: '1rem',
    fontWeight: '600',
    border: '2px solid rgba(4, 120, 87, 0.2)',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    transform: 'scale(1)',
    boxSizing: 'border-box',
    textDecoration: 'none'
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.5)'
  };

  if (status === 'loading') {
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
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(30, 64, 175, 0.2))',
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
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.2))',
            borderRadius: '50%',
            filter: 'blur(3rem)',
            animation: 'pulse 4s infinite',
            animationDelay: '2s'
          }} />
        </div>

        <div style={cardStyle}>
          <div style={loadingLogoStyle}>
            <div style={{
              width: '2rem',
              height: '2rem',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              borderTop: '3px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
          
          <h2 style={loadingTitleStyle}>Verifying Email</h2>
          
          <p style={messageStyle}>
            Please wait while we verify your email address...
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            <Loader style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} />
            Processing verification...
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
  }

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
          background: status === 'success' 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.2))'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.2))',
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
          background: status === 'success'
            ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(16, 185, 129, 0.2))'
            : 'linear-gradient(135deg, rgba(220, 38, 38, 0.3), rgba(185, 28, 28, 0.2))',
          borderRadius: '50%',
          filter: 'blur(3rem)',
          animation: 'pulse 4s infinite',
          animationDelay: '2s'
        }} />
      </div>

      <div style={cardStyle}>
        {status === 'success' ? (
          <>
            <div style={successLogoStyle}>
              <CheckCircle color="white" size={40} />
            </div>
            
            <h2 style={successTitleStyle}>Email Verified!</h2>
            
            <p style={messageStyle}>
              {message || 'Your email has been successfully verified. You can now access all features of your account.'}
            </p>

            <button
              onClick={handleBackToLogin}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 6px 20px 0 rgba(4, 120, 87, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 14px 0 rgba(4, 120, 87, 0.5)';
              }}
            >
              <CheckCircle style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
              Continue to Login
            </button>

            {/* Success Features */}
            <div style={{ 
              marginTop: '1.5rem', 
              paddingTop: '1.5rem', 
              borderTop: '1px solid rgba(16, 185, 129, 0.2)',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                🎉 Your account is now fully activated
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem', color: '#10b981' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    marginRight: '0.25rem',
                    animation: 'pulse 2s infinite'
                  }} />
                  Full Access
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
                  Secure Account
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
                  Ready to Use
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={errorLogoStyle}>
              <XCircle color="white" size={40} />
            </div>
            
            <h2 style={errorTitleStyle}>Verification Failed</h2>
            
            <p style={messageStyle}>
              {message || 'We were unable to verify your email address. The verification link may have expired or is invalid.'}
            </p>

            <button
              onClick={handleResendVerification}
              style={dangerButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
                e.target.style.boxShadow = '0 6px 20px 0 rgba(239, 68, 68, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                e.target.style.boxShadow = '0 4px 14px 0 rgba(239, 68, 68, 0.5)';
              }}
            >
              <RefreshCw style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
              Resend Verification Email
            </button>

            <button
              onClick={handleBackToLogin}
              style={secondaryButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.background = 'rgba(4, 120, 87, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.background = 'rgba(4, 120, 87, 0.1)';
              }}
            >
              <Mail style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
              Back to Login
            </button>

            {/* Error Help */}
            <div style={{ 
              marginTop: '1.5rem', 
              paddingTop: '1.5rem', 
              borderTop: '1px solid rgba(239, 68, 68, 0.2)',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                🔧 Common issues and solutions
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem', color: '#ef4444' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    backgroundColor: '#ef4444',
                    borderRadius: '50%',
                    marginRight: '0.25rem',
                    animation: 'pulse 2s infinite'
                  }} />
                  Check Spam
                </span>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    backgroundColor: '#ef4444',
                    borderRadius: '50%',
                    marginRight: '0.25rem',
                    animation: 'pulse 2s infinite',
                    animationDelay: '0.5s'
                  }} />
                  Link Expired
                </span>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    backgroundColor: '#ef4444',
                    borderRadius: '50%',
                    marginRight: '0.25rem',
                    animation: 'pulse 2s infinite',
                    animationDelay: '1s'
                  }} />
                  Try Again
                </span>
              </div>
            </div>
          </>
        )}
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

export default VerifyEmail;