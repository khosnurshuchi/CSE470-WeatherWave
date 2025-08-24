// src/pages/ResetPassword.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Lock, Shield, CheckCircle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);

    try {
      await authAPI.resetPassword(token, formData.password);
      setSuccess(true);
      toast.success('Password reset successfully!');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1rem',
        position: 'relative'
      }}>
        {/* Animated Background Blobs */}
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
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '3rem',
          borderRadius: '2rem',
          maxWidth: '28rem',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          opacity: 0,
          transform: 'translateY(-50px)',
          animation: 'slideInSuccess 0.8s ease forwards'
        }}>
          <div style={{
            width: '5rem',
            height: '5rem',
            background: 'linear-gradient(135deg, #10b981, #047857)',
            borderRadius: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            boxShadow: '0 15px 35px rgba(16, 185, 129, 0.4)',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            <CheckCircle color="white" size={36} />
          </div>
          
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
          }}>
            Password Reset Successfully!
          </h2>
          
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '2.5rem',
            lineHeight: '1.6'
          }}>
            Your password has been updated successfully. You will be redirected to the login page shortly.
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '1rem',
            color: 'white',
            fontWeight: '500'
          }}>
            <div style={{
              width: '1.5rem',
              height: '1.5rem',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              borderTop: '3px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Redirecting to login...
          </div>
        </div>

        <style jsx>{`
          @keyframes slideInSuccess {
            from {
              opacity: 0;
              transform: translateY(-50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem 1rem',
      position: 'relative'
    }}>
      {/* Animated Background Blobs */}
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
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '3rem',
        borderRadius: '2rem',
        maxWidth: '28rem',
        width: '100%',
        position: 'relative',
        zIndex: 1,
        opacity: 0,
        transform: 'translateY(-50px)',
        animation: 'slideIn 0.8s ease forwards'
      }}>
        <div style={{
          width: '5rem',
          height: '5rem',
          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          borderRadius: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
          boxShadow: '0 15px 35px rgba(139, 92, 246, 0.4)'
        }}>
          <Shield color="white" size={36} />
        </div>
        
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          color: 'white',
          marginBottom: '1rem',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}>
          Reset Password
        </h2>
        
        <p style={{
          textAlign: 'center',
          fontSize: '1rem',
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: '2.5rem',
          lineHeight: '1.6'
        }}>
          Enter your new password below to secure your account
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{
            position: 'relative',
            marginBottom: '1.5rem'
          }}>
            <Lock style={{
              position: 'absolute',
              left: '1.25rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '1.25rem',
              height: '1.25rem',
              color: 'rgba(255, 255, 255, 0.8)'
            }} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                paddingLeft: '3.5rem',
                paddingRight: '3.5rem',
                paddingTop: '1rem',
                paddingBottom: '1rem',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '1rem',
                transition: 'all 0.3s ease',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
                color: 'white',
                '::placeholder': {
                  color: 'rgba(255, 255, 255, 0.6)'
                }
              }}
              placeholder="New password"
              onFocus={(e) => {
                e.target.style.border = '2px solid rgba(139, 92, 246, 0.8)';
                e.target.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.2)';
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid rgba(255, 255, 255, 0.2)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            />
            {showPassword ? (
              <EyeOff 
                style={{
                  position: 'absolute',
                  right: '1.25rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1.25rem',
                  height: '1.25rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onClick={() => setShowPassword(false)}
                onMouseEnter={(e) => e.target.style.color = 'white'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
              />
            ) : (
              <Eye 
                style={{
                  position: 'absolute',
                  right: '1.25rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1.25rem',
                  height: '1.25rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onClick={() => setShowPassword(true)}
                onMouseEnter={(e) => e.target.style.color = 'white'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
              />
            )}
          </div>

          <div style={{
            position: 'relative',
            marginBottom: '2rem'
          }}>
            <Lock style={{
              position: 'absolute',
              left: '1.25rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '1.25rem',
              height: '1.25rem',
              color: 'rgba(255, 255, 255, 0.8)'
            }} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                width: '100%',
                paddingLeft: '3.5rem',
                paddingRight: '3.5rem',
                paddingTop: '1rem',
                paddingBottom: '1rem',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '1rem',
                transition: 'all 0.3s ease',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
                color: 'white'
              }}
              placeholder="Confirm new password"
              onFocus={(e) => {
                e.target.style.border = '2px solid rgba(139, 92, 246, 0.8)';
                e.target.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.2)';
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid rgba(255, 255, 255, 0.2)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            />
            {showConfirmPassword ? (
              <EyeOff 
                style={{
                  position: 'absolute',
                  right: '1.25rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1.25rem',
                  height: '1.25rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onClick={() => setShowConfirmPassword(false)}
                onMouseEnter={(e) => e.target.style.color = 'white'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
              />
            ) : (
              <Eye 
                style={{
                  position: 'absolute',
                  right: '1.25rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1.25rem',
                  height: '1.25rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onClick={() => setShowConfirmPassword(true)}
                onMouseEnter={(e) => e.target.style.color = 'white'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 1.5rem',
              background: loading 
                ? 'rgba(156, 163, 175, 0.5)' 
                : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              border: 'none',
              borderRadius: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: loading 
                ? 'none' 
                : '0 15px 35px rgba(139, 92, 246, 0.4)',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 15px 35px rgba(139, 92, 246, 0.4)';
              }
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Resetting Password...
              </>
            ) : (
              <>
                <Shield style={{ width: '1.25rem', height: '1.25rem' }} />
                Reset Password
              </>
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
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
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        input::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;