import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import { User, Phone, Lock, Trash2, Save, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userAPI.updateProfile(profileData);
      updateUser(response.data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);

    try {
      await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      await userAPI.deleteAccount();
      toast.success('Account deleted successfully');
      window.location.href = '/login';
    } catch (error) {
      toast.error(error.message || 'Failed to delete account');
    }
  };

  // Inline styles matching Login/Register theme
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)',
    padding: '2rem 1rem',
    position: 'relative'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    borderRadius: '1.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    padding: '2rem',
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #047857, #065f46)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem'
  };

  const sectionTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#047857',
    marginBottom: '0.5rem'
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
    marginBottom: '1.5rem'
  };

  const inputStyle = {
    width: '100%',
    paddingLeft: '3rem',
    paddingRight: '1rem',
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

  const disabledInputStyle = {
    ...inputStyle,
    backgroundColor: '#f9fafb',
    color: '#6b7280',
    cursor: 'not-allowed'
  };

  const iconStyle = {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '1.25rem',
    height: '1.25rem',
    color: '#9ca3af',
    transition: 'color 0.2s ease'
  };

  const buttonStyle = {
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
    boxSizing: 'border-box'
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
    boxShadow: '0 4px 14px 0 rgba(220, 38, 38, 0.5)'
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
      </div>

      <div style={{ maxWidth: '64rem', margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <div style={cardStyle}>
          <h1 style={titleStyle}>Profile Settings</h1>
          <p style={{ fontSize: '1rem', color: '#6b7280' }}>
            Manage your account information and security settings.
          </p>
        </div>

        {/* Profile Information */}
        <div style={cardStyle}>
          <h3 style={sectionTitleStyle}>Personal Information</h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '2rem' }}>
            Update your personal details and contact information.
          </p>
          
          <form onSubmit={handleProfileSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Full Name */}
              <div>
                <label style={labelStyle}>Full Name</label>
                <div style={inputContainerStyle}>
                  <User style={iconStyle} />
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                    style={inputStyle}
                    placeholder="Enter your full name"
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label style={labelStyle}>Phone Number</label>
                <div style={inputContainerStyle}>
                  <Phone style={iconStyle} />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleProfileChange}
                    style={inputStyle}
                    placeholder="Enter your phone number"
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
              </div>
            </div>

            {/* Email (Read-only) */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                style={disabledInputStyle}
              />
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                Email address cannot be changed. Contact support if you need to update it.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                    Updating...
                  </>
                ) : (
                  <>
                    <Save style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                    Update Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div style={cardStyle}>
          <h3 style={sectionTitleStyle}>Change Password</h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '2rem' }}>
            Update your password to keep your account secure.
          </p>
          
          <form onSubmit={handlePasswordSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Current Password</label>
              <div style={inputContainerStyle}>
                <Lock style={iconStyle} />
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  style={inputStyle}
                  placeholder="Enter current password"
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label style={labelStyle}>New Password</label>
                <div style={inputContainerStyle}>
                  <Lock style={iconStyle} />
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    style={inputStyle}
                    placeholder="Enter new password"
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Confirm New Password</label>
                <div style={inputContainerStyle}>
                  <Lock style={iconStyle} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    style={inputStyle}
                    placeholder="Confirm new password"
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={passwordLoading}
                style={buttonStyle}
                onMouseEnter={(e) => !passwordLoading && (e.target.style.transform = 'scale(1.02)')}
                onMouseLeave={(e) => !passwordLoading && (e.target.style.transform = 'scale(1)')}
              >
                {passwordLoading ? (
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
                    Changing...
                  </>
                ) : (
                  <>
                    <Lock style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                    Change Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Danger Zone */}
        <div style={cardStyle}>
          <h3 style={{ ...sectionTitleStyle, color: '#dc2626' }}>Danger Zone</h3>
          
          <div style={{
            borderRadius: '1rem',
            backgroundColor: 'rgba(220, 38, 38, 0.05)',
            border: '1px solid rgba(220, 38, 38, 0.2)',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem',
                flexShrink: 0
              }}>
                <Trash2 color="#dc2626" size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: '#dc2626',
                  margin: '0 0 0.5rem 0'
                }}>
                  Delete Account
                </h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#7f1d1d',
                  margin: '0 0 1.5rem 0',
                  lineHeight: '1.5'
                }}>
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  style={dangerButtonStyle}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.background = 'linear-gradient(135deg, #b91c1c, #991b1b)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
                  }}
                >
                  <Trash2 style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                  Delete Account
                </button>
              </div>
            </div>
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

export default Profile;