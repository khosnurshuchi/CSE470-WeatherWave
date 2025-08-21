import { useState } from 'react';
import { User, Mail, Lock, Phone, Eye, EyeOff, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { authAPI } from '../services/api';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';


const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      alert('Please enter your full name');
      return false;
    }
    if (!formData.email.trim()) {
      alert('Please enter your email');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Please enter a valid email address');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      alert('Please enter your phone number');
      return false;
    }
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return false;
    }
    return true;
  };

  // REPLACE THE COMMENTED CODE AND LOOSE CODE WITH:
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      // Mock API call that matches your authAPI.register structure
      const response = await authAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber
      });

      // if(!response.ok)
      //   return
      // Remove this line entirely, or use:
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
      
      // Show success state
      setRegistrationSuccess(true);
      
      // Clear form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: ''
      });
      
    } catch (error) {
      console.error('Registration failed:', error);
      alert(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  // Smart validation helpers
  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9!@#$%^&*]/)) strength += 25;
    
    if (strength <= 25) return { strength, label: 'Weak', color: '#ef4444' };
    if (strength <= 50) return { strength, label: 'Fair', color: '#eab308' };
    if (strength <= 75) return { strength, label: 'Good', color: '#047857' };
    return { strength, label: 'Strong', color: '#065f46' };
  };

  const isEmailValid = formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isPhoneValid = formData.phoneNumber && formData.phoneNumber.length >= 10;
  const passwordMatch = formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordStrength = getPasswordStrength();

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
    border: '1px solid rgba(4, 120, 87, 0.2)',
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

  const successLogoStyle = {
    ...logoStyle,
    background: 'linear-gradient(135deg, #10b981, #047857)',
    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
    animation: 'pulse 2s infinite'
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

  const successTitleStyle = {
    ...titleStyle,
    background: 'linear-gradient(135deg, #10b981, #047857)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
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
    color: focusedField ? '#047857' : '#9ca3af',
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

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: 'rgba(4, 120, 87, 0.1)',
    color: '#047857',
    border: '2px solid rgba(4, 120, 87, 0.2)',
    boxShadow: 'none'
  };

  const progressBarStyle = {
    width: '100%',
    height: '0.5rem',
    backgroundColor: '#e5e7eb',
    borderRadius: '0.25rem',
    overflow: 'hidden',
    marginTop: '0.5rem'
  };

  const progressFillStyle = {
    height: '100%',
    backgroundColor: passwordStrength.color,
    width: `${passwordStrength.strength}%`,
    transition: 'all 0.3s ease',
    borderRadius: '0.25rem'
  };

  // Show success screen after registration
  if (registrationSuccess) {
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
        </div>

        <div style={cardStyle}>
          <div style={successLogoStyle}>
            <CheckCircle color="white" size={32} />
          </div>
          
          <h2 style={successTitleStyle}>Registration Successful!</h2>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ fontSize: '1rem', color: '#374151', marginBottom: '1rem', fontWeight: '600' }}>
              Welcome! Your account has been created.
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5' }}>
              We've sent a verification email to your address. Please check your inbox and click the verification link to activate your account.
            </p>
          </div>

          <button
            onClick={handleBackToLogin}
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          >
            <Shield style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
            Continue to Login
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Didn't receive the email?{' '}
              <button
                onClick={() => navigate('/resend-verification')}
                style={{
                  color: '#047857',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontWeight: '500'
                }}
              >
                Resend verification email
              </button>
            </p>
          </div>

          {/* Success Features */}
          <div style={{ 
            marginTop: '1.5rem', 
            paddingTop: '1.5rem', 
            borderTop: '1px solid rgba(16, 185, 129, 0.2)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.75rem' }}>
              🎉 Next steps to complete your setup
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
                Check Email
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
                Verify Account
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
                Start Using
              </span>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  // Show registration form
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
          background: 'linear-gradient(135deg, rgba(4, 120, 87, 0.3), rgba(6, 95, 70, 0.2))',
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
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(4, 120, 87, 0.2))',
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
          background: 'linear-gradient(135deg, rgba(6, 95, 70, 0.2), rgba(4, 120, 87, 0.2))',
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
        
        <h2 style={titleStyle}>Create your account</h2>
        
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginBottom: '2rem' }}>
          Or{' '}
          <button 
            onClick={handleSignIn}
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
            sign in to your existing account
          </button>
        </p>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Full Name</label>
            <div style={inputContainerStyle}>
              <User style={{...iconStyle, color: focusedField === 'fullName' ? '#047857' : '#9ca3af'}} />
              <input
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                onFocus={() => setFocusedField('fullName')}
                onBlur={() => setFocusedField('')}
                style={getInputStyle('fullName')}
                placeholder="Enter your full name"
              />
              {formData.fullName && (
                <CheckCircle style={{...validationIconStyle, color: '#047857'}} />
              )}
            </div>
          </div>

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

          {/* Phone Number */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Phone Number</label>
            <div style={inputContainerStyle}>
              <Phone style={{...iconStyle, color: focusedField === 'phoneNumber' ? '#047857' : '#9ca3af'}} />
              <input
                name="phoneNumber"
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                onFocus={() => setFocusedField('phoneNumber')}
                onBlur={() => setFocusedField('')}
                style={getInputStyle('phoneNumber')}
                placeholder="Enter your phone number"
              />
              {formData.phoneNumber && (
                isPhoneValid ? (
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
            {formData.password && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Password Strength:</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '500', color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div style={progressBarStyle}>
                  <div style={progressFillStyle}></div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Confirm Password</label>
            <div style={inputContainerStyle}>
              <Lock style={{...iconStyle, color: focusedField === 'confirmPassword' ? '#047857' : '#9ca3af'}} />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField('')}
                style={{...getInputStyle('confirmPassword'), paddingRight: '4rem'}}
                placeholder="Confirm your password"
              />
              <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {formData.confirmPassword && (
                  passwordMatch ? (
                    <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: '#047857' }} />
                  ) : (
                    <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: '#ef4444' }} />
                  )
                )}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#047857'}
                  onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
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
                Creating account...
              </>
            ) : (
              <>
                <Shield style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                Create account
              </>
            )}
          </button>
        </form>

        {/* Security Features */}
        <div style={{ 
          marginTop: '1.5rem', 
          paddingTop: '1.5rem', 
          borderTop: '1px solid rgba(4, 120, 87, 0.2)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.75rem' }}>
            🔒 Your data is protected with end-to-end encryption
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
              Encrypted
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
              GDPR Compliant
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
              24/7 Monitoring
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

export default Register;