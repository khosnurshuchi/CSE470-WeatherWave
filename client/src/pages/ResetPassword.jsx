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
      //await authAPI.resetPassword({ token, newPassword: formData.password });
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

  // Styles matching your theme
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
    background: success 
      ? 'linear-gradient(135deg, #10b981, #047857)'
      : 'linear-gradient(135deg, #047857, #065f46)',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    boxShadow: '0 10px 25px rgba(4, 120, 87, 0.3)'
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

  const inputContainerStyle = {
    position: 'relative',
    marginBottom: '1.5rem'
  };

  const inputStyle = {
    width: '100%',
    paddingLeft: '3rem',
    paddingRight: '3rem',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    border: '2px solid #d1d5db',
    borderRadius: '0.75rem',
    transition: 'all 0.3s ease',
    background: 'white',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const inputFocusStyle = {
    ...inputStyle,
    border: '2px solid #047857',
    boxShadow: '0 0 0 4px rgba(4, 120, 87, 0.1)'
  };

  const iconStyle = {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '1.25rem',
    height: '1.25rem',
    color: '#047857'
  };

  const eyeIconStyle = {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '1.25rem',
    height: '1.25rem',
    color: '#6b7280',
    cursor: 'pointer'
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
    marginTop: '1rem'
  };

  if (success) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={logoStyle}>
            <CheckCircle color="white" size={32} />
          </div>
          
          <h2 style={titleStyle}>Password Reset Successfully!</h2>
          
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginBottom: '2rem' }}>
            Your password has been updated. Redirecting to login...
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: '#047857'
          }}>
            <div style={{
              width: '1rem',
              height: '1rem',
              border: '2px solid rgba(4, 120, 87, 0.3)',
              borderTop: '2px solid #047857',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Redirecting...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={logoStyle}>
          <Shield color="white" size={32} />
        </div>
        
        <h2 style={titleStyle}>Reset Password</h2>
        
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginBottom: '2rem' }}>
          Enter your new password below
        </p>

        <form onSubmit={handleSubmit}>
          <div style={inputContainerStyle}>
            <Lock style={iconStyle} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
              placeholder="New password"
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
            {showPassword ? (
              <EyeOff 
                style={eyeIconStyle} 
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <Eye 
                style={eyeIconStyle} 
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          <div style={inputContainerStyle}>
            <Lock style={iconStyle} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Confirm new password"
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
            {showConfirmPassword ? (
              <EyeOff 
                style={eyeIconStyle} 
                onClick={() => setShowConfirmPassword(false)}
              />
            ) : (
              <Eye 
                style={eyeIconStyle} 
                onClick={() => setShowConfirmPassword(true)}
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
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
                Resetting...
              </>
            ) : (
              <>
                <Shield style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                Reset Password
              </>
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;