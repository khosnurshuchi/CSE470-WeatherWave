import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import { User, Phone, Lock, Trash2, Save, Shield, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1rem',
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
          top: '15%',
          left: '15%',
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
          right: '20%',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite reverse'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          filter: 'blur(30px)',
          animation: 'float 10s ease-in-out infinite'
        }} />
      </div>

      <div style={{ maxWidth: '64rem', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          borderRadius: '1.5rem',
          padding: '2rem',
          marginBottom: '2rem',
          opacity: 0,
          transform: 'translateY(-50px)',
          animation: 'slideIn 1s ease forwards',
          animationDelay: '0.1s'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: '0.5rem'
          }}>
            Profile Settings
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)' }}>
            Manage your account information and security settings.
          </p>
        </div>

        {/* Profile Information */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          borderRadius: '1.5rem',
          padding: '2rem',
          marginBottom: '2rem',
          opacity: 0,
          transform: 'translateY(50px)',
          animation: 'slideIn 1s ease forwards',
          animationDelay: '0.2s'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: '0.5rem'
          }}>
            Personal Information
          </h3>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'rgba(255, 255, 255, 0.8)', 
            marginBottom: '2rem' 
          }}>
            Update your personal details and contact information.
          </p>
          
          <form onSubmit={handleProfileSubmit}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '1.5rem', 
              marginBottom: '2rem' 
            }}>
              {/* Full Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#fff',
                  marginBottom: '0.5rem'
                }}>
                  Full Name
                </label>
                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                  <User style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1.25rem',
                    height: '1.25rem',
                    color: focusedField === 'fullName' ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                    transition: 'color 0.2s ease'
                  }} />
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                    onFocus={() => setFocusedField('fullName')}
                    onBlur={() => setFocusedField('')}
                    style={{
                      width: '100%',
                      paddingLeft: '3rem',
                      paddingRight: '1rem',
                      paddingTop: '1rem',
                      paddingBottom: '1rem',
                      border: `2px solid ${focusedField === 'fullName' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
                      borderRadius: '0.75rem',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.1)',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      color: '#fff',
                      backdropFilter: 'blur(10px)',
                      boxShadow: focusedField === 'fullName' ? '0 0 0 4px rgba(255, 255, 255, 0.1)' : 'none'
                    }}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#fff',
                  marginBottom: '0.5rem'
                }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                  <Phone style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1.25rem',
                    height: '1.25rem',
                    color: focusedField === 'phoneNumber' ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                    transition: 'color 0.2s ease'
                  }} />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleProfileChange}
                    onFocus={() => setFocusedField('phoneNumber')}
                    onBlur={() => setFocusedField('')}
                    style={{
                      width: '100%',
                      paddingLeft: '3rem',
                      paddingRight: '1rem',
                      paddingTop: '1rem',
                      paddingBottom: '1rem',
                      border: `2px solid ${focusedField === 'phoneNumber' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
                      borderRadius: '0.75rem',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.1)',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      color: '#fff',
                      backdropFilter: 'blur(10px)',
                      boxShadow: focusedField === 'phoneNumber' ? '0 0 0 4px rgba(255, 255, 255, 0.1)' : 'none'
                    }}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            {/* Email (Read-only) */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#fff',
                marginBottom: '0.5rem'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1.25rem',
                  height: '1.25rem',
                  color: 'rgba(255, 255, 255, 0.4)'
                }} />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  style={{
                    width: '100%',
                    paddingLeft: '3rem',
                    paddingRight: '1rem',
                    paddingTop: '1rem',
                    paddingBottom: '1rem',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    color: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    cursor: 'not-allowed'
                  }}
                />
              </div>
              <p style={{ 
                fontSize: '0.875rem', 
                color: 'rgba(255, 255, 255, 0.6)', 
                marginTop: '0.5rem' 
              }}>
                Email address cannot be changed. Contact support if you need to update it.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
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
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          borderRadius: '1.5rem',
          padding: '2rem',
          marginBottom: '2rem',
          opacity: 0,
          transform: 'translateY(50px)',
          animation: 'slideIn 1s ease forwards',
          animationDelay: '0.3s'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: '0.5rem'
          }}>
            Change Password
          </h3>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'rgba(255, 255, 255, 0.8)', 
            marginBottom: '2rem' 
          }}>
            Update your password to keep your account secure.
          </p>
          
          <form onSubmit={handlePasswordSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#fff',
                marginBottom: '0.5rem'
              }}>
                Current Password
              </label>
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <Lock style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1.25rem',
                  height: '1.25rem',
                  color: focusedField === 'currentPassword' ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                  transition: 'color 0.2s ease'
                }} />
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  onFocus={() => setFocusedField('currentPassword')}
                  onBlur={() => setFocusedField('')}
                  style={{
                    width: '100%',
                    paddingLeft: '3rem',
                    paddingRight: '1rem',
                    paddingTop: '1rem',
                    paddingBottom: '1rem',
                    border: `2px solid ${focusedField === 'currentPassword' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
                    borderRadius: '0.75rem',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255, 255, 255, 0.1)',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    color: '#fff',
                    backdropFilter: 'blur(10px)',
                    boxShadow: focusedField === 'currentPassword' ? '0 0 0 4px rgba(255, 255, 255, 0.1)' : 'none'
                  }}
                  placeholder="Enter current password"
                />
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '1.5rem', 
              marginBottom: '2rem' 
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#fff',
                  marginBottom: '0.5rem'
                }}>
                  New Password
                </label>
                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                  <Lock style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1.25rem',
                    height: '1.25rem',
                    color: focusedField === 'newPassword' ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                    transition: 'color 0.2s ease'
                  }} />
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    onFocus={() => setFocusedField('newPassword')}
                    onBlur={() => setFocusedField('')}
                    style={{
                      width: '100%',
                      paddingLeft: '3rem',
                      paddingRight: '1rem',
                      paddingTop: '1rem',
                      paddingBottom: '1rem',
                      border: `2px solid ${focusedField === 'newPassword' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
                      borderRadius: '0.75rem',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.1)',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      color: '#fff',
                      backdropFilter: 'blur(10px)',
                      boxShadow: focusedField === 'newPassword' ? '0 0 0 4px rgba(255, 255, 255, 0.1)' : 'none'
                    }}
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#fff',
                  marginBottom: '0.5rem'
                }}>
                  Confirm New Password
                </label>
                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                  <Lock style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1.25rem',
                    height: '1.25rem',
                    color: focusedField === 'confirmPassword' ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                    transition: 'color 0.2s ease'
                  }} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField('')}
                    style={{
                      width: '100%',
                      paddingLeft: '3rem',
                      paddingRight: '1rem',
                      paddingTop: '1rem',
                      paddingBottom: '1rem',
                      border: `2px solid ${focusedField === 'confirmPassword' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
                      borderRadius: '0.75rem',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.1)',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      color: '#fff',
                      backdropFilter: 'blur(10px)',
                      boxShadow: focusedField === 'confirmPassword' ? '0 0 0 4px rgba(255, 255, 255, 0.1)' : 'none'
                    }}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={passwordLoading}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '1rem 1.5rem',
                  background: passwordLoading ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.75rem',
                  cursor: passwordLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                  transform: 'scale(1)',
                  boxSizing: 'border-box',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => !passwordLoading && (e.target.style.transform = 'scale(1.02)', e.target.style.background = 'rgba(255, 255, 255, 0.4)')}
                onMouseLeave={(e) => !passwordLoading && (e.target.style.transform = 'scale(1)', e.target.style.background = 'rgba(255, 255, 255, 0.3)')}
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
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          borderRadius: '1.5rem',
          padding: '2rem',
          opacity: 0,
          transform: 'translateY(50px)',
          animation: 'slideIn 1s ease forwards',
          animationDelay: '0.4s'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#ef4444',
            marginBottom: '0.5rem'
          }}>
            Danger Zone
          </h3>
          
          <div style={{
            borderRadius: '1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem',
                flexShrink: 0
              }}>
                <Trash2 color="#ef4444" size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: '#ef4444',
                  margin: '0 0 0.5rem 0'
                }}>
                  Delete Account
                </h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: '0 0 1.5rem 0',
                  lineHeight: '1.5'
                }}>
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '1rem 1.5rem',
                    background: 'rgba(239, 68, 68, 0.3)',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    border: '1px solid rgba(239, 68, 68, 0.5)',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 30px rgba(239, 68, 68, 0.2)',
                    transform: 'scale(1)',
                    boxSizing: 'border-box',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.background = 'rgba(239, 68, 68, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.background = 'rgba(239, 68, 68, 0.3)';
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

export default Profile;