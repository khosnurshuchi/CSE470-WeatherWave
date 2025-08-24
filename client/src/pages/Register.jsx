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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const response = await authAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber
      });

      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
      
      setRegistrationSuccess(true);
      
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

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9!@#$%^&*]/)) strength += 25;
    
    if (strength <= 25) return { strength, label: 'Weak', color: '#f87171' };
    if (strength <= 50) return { strength, label: 'Fair', color: '#fbbf24' };
    if (strength <= 75) return { strength, label: 'Good', color: '#34d399' };
    return { strength, label: 'Strong', color: '#10b981' };
  };

  const isEmailValid = formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isPhoneValid = formData.phoneNumber && formData.phoneNumber.length >= 10;
  const passwordMatch = formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordStrength = getPasswordStrength();

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
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease'
  };

  const successLogoStyle = {
    ...logoStyle,
    background: 'rgba(16, 185, 129, 0.8)',
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

  const inputGroupStyle = {
    marginBottom: '1.5rem'
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
    width: '100%'
  };

  const getInputStyle = (fieldName) => ({
    width: '100%',
    paddingLeft: '3rem',
    paddingRight: formData[fieldName] ? '3rem' : '1rem',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    border: `2px solid ${focusedField === fieldName ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
    borderRadius: '0.75rem',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.1)',
    fontSize: '1rem',
    outline: 'none',
    boxShadow: focusedField === fieldName ? '0 0 0 4px rgba(255, 255, 255, 0.1)' : 'none',
    boxSizing: 'border-box',
    color: '#fff',
    backdropFilter: 'blur(10px)'
  });

  const iconStyle = {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '1.25rem',
    height: '1.25rem',
    color: focusedField ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)',
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
    backdropFilter: 'blur(10px)'
  };

  const progressBarStyle = {
    width: '100%',
    height: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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

        <div style={{...cardStyle, zIndex: 1}}>
          <div style={successLogoStyle}>
            <CheckCircle color="white" size={32} />
          </div>
          
          <h2 style={titleStyle}>Registration Successful!</h2>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '1rem', fontWeight: '600' }}>
              Welcome! Your account has been created.
            </p>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
              We've sent a verification email to your address. Please check your inbox and click the verification link to activate your account.
            </p>
          </div>

          <button
            onClick={handleBackToLogin}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.02)';
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <Shield style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
            Continue to Login
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1rem' }}>
              Didn't receive the email?{' '}
              <button
                onClick={() => navigate('/resend-verification')}
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
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
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.75rem' }}>
              Next steps to complete your setup
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
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
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
        <div style={logoStyle}>
          <Shield color="white" size={32} />
        </div>
        
        <h2 style={titleStyle}>Create your account</h2>
        
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '2rem' }}>
          Or{' '}
          <button 
            onClick={handleSignIn}
            style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              textDecoration: 'none', 
              fontWeight: '500', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#fff'}
            onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
          >
            sign in to your existing account
          </button>
        </p>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Full Name</label>
            <div style={inputContainerStyle}>
              <User style={{...iconStyle, color: focusedField === 'fullName' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)'}} />
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
                <CheckCircle style={{...validationIconStyle, color: '#10b981'}} />
              )}
            </div>
          </div>

          {/* Email */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email address</label>
            <div style={inputContainerStyle}>
              <Mail style={{...iconStyle, color: focusedField === 'email' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)'}} />
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
                  <CheckCircle style={{...validationIconStyle, color: '#10b981'}} />
                ) : (
                  <AlertCircle style={{...validationIconStyle, color: '#f87171'}} />
                )
              )}
            </div>
          </div>

          {/* Phone Number */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Phone Number</label>
            <div style={inputContainerStyle}>
              <Phone style={{...iconStyle, color: focusedField === 'phoneNumber' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)'}} />
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
                  <CheckCircle style={{...validationIconStyle, color: '#10b981'}} />
                ) : (
                  <AlertCircle style={{...validationIconStyle, color: '#f87171'}} />
                )
              )}
            </div>
          </div>

          {/* Password */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <div style={inputContainerStyle}>
              <Lock style={{...iconStyle, color: focusedField === 'password' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)'}} />
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
                  color: 'rgba(255, 255, 255, 0.6)',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formData.password && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>Password Strength:</span>
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
              <Lock style={{...iconStyle, color: focusedField === 'confirmPassword' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)'}} />
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
                    <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: '#10b981' }} />
                  ) : (
                    <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: '#f87171' }} />
                  )
                )}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(255, 255, 255, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
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
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'scale(1.02)' && (e.target.style.background = 'rgba(255, 255, 255, 0.3)'))}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'scale(1)' && (e.target.style.background = 'rgba(255, 255, 255, 0.2)'))}
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
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.75rem' }}>
            Your data is protected with end-to-end encryption
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
              Encrypted
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
              GDPR Compliant
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
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Register;