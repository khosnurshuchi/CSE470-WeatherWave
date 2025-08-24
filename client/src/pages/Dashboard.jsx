import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Edit3,
  Settings,
  Activity,
  LogOut,
  Cloud,
  MapPin,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { theme, getThemeStyles } = useTheme();
  const navigate = useNavigate();
  const themeStyles = getThemeStyles();

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      logout();
      alert('Logged out successfully!');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEditProfile = () => {
    navigate('/profile');
  };

  const handleViewWeather = () => {
    navigate('/weather');
  };

  const handleManageLocations = () => {
    navigate('/locations');
  };

  const handleSecuritySettings = () => {
    alert('Security settings would be implemented here');
  };

  const handleActivityLog = () => {
    alert('Activity log would be implemented here');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: themeStyles.background,
      padding: '1rem',
      position: 'relative',
      transition: 'all 0.3s ease'
    }}>
      {/* Animated Background */}
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
          background: theme === 'dark' ? 'rgba(59, 130, 246, 0.05)' : 'rgba(255, 255, 255, 0.1)',
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
          background: theme === 'dark' ? 'rgba(139, 92, 246, 0.05)' : 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite reverse'
        }} />
      </div>

      {/* Responsive Container */}
      <div className="container-responsive" style={{
        maxWidth: '90rem',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header Section - Now responsive */}
        <div style={{
          background: themeStyles.cardBackground,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${themeStyles.border}`,
          boxShadow: `0 8px 40px ${themeStyles.shadow}`,
          borderRadius: '1.5rem',
          padding: '2rem',
          marginBottom: '1.5rem',
          opacity: 0,
          transform: 'translateY(-70%)',
          animation: 'slide-down 1s ease forwards',
          animationDelay: '0.2s',
          color: themeStyles.textPrimary
        }}>
          <div className="mobile-stack" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div className="mobile-center">
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)', // Responsive font size
                fontWeight: 'bold',
                margin: '0 0 0.5rem 0',
                color: themeStyles.textPrimary
              }}>
                Welcome back, {user?.fullName}!
              </h1>
              <p style={{
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                color: themeStyles.textSecondary,
                margin: 0
              }}>
                Here's your account information and weather dashboard.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                background: themeStyles.cardBackground,
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 30px ${themeStyles.shadow}`,
                backdropFilter: 'blur(10px)'
              }}>
                <span style={{ color: themeStyles.textPrimary, fontWeight: 'bold', fontSize: '1.5rem' }}>
                  {user?.fullName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(220, 38, 38, 0.8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 30px rgba(220, 38, 38, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}
                className="mobile-full-width mobile-text-sm"
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.background = 'rgba(185, 28, 28, 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.background = 'rgba(220, 38, 38, 0.8)';
                }}
              >
                <LogOut size={16} />
                <span className="mobile-hidden">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Layout Container */}
        <div className="grid-responsive-sidebar" style={{
          display: 'grid',
          gridTemplateColumns: '1fr', // Mobile first
          gap: '1.5rem',
          '@media (min-width: 1024px)': {
            gridTemplateColumns: '2fr 1fr'
          }
        }}>
          {/* Main Content - Now responsive */}
          <div>
            {/* Stats Cards - Now responsive grid */}
            <div style={{
              background: themeStyles.cardBackground,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${themeStyles.border}`,
              boxShadow: `0 8px 40px ${themeStyles.shadow}`,
              borderRadius: '1.5rem',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              opacity: 0,
              transform: 'translateY(200px)',
              animation: 'slide-up 1s ease forwards',
              color: themeStyles.textPrimary
            }}>
              <div className="grid-responsive-1 tablet-grid-2" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                {/* Your existing stats cards with responsive updates */}
                {[
                  {
                    icon: <Cloud size={24} color="white" />,
                    title: 'Weather Dashboard',
                    subtitle: 'View Now',
                    color: 'rgba(59, 130, 246, 0.8)',
                    action: handleViewWeather
                  },
                  {
                    icon: <MapPin size={24} color="white" />,
                    title: 'My Locations',
                    subtitle: 'Manage',
                    color: 'rgba(16, 185, 129, 0.8)',
                    action: handleManageLocations
                  },
                  {
                    icon: <Shield size={24} color="white" />,
                    title: 'Account Status',
                    subtitle: user?.isVerified ? 'Verified' : 'Unverified',
                    color: 'rgba(139, 92, 246, 0.8)',
                    action: () => { }
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      background: themeStyles.cardBackground,
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      border: `1px solid ${themeStyles.border}`,
                      backdropFilter: 'blur(15px)'
                    }}
                    onClick={item.action}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = `0 20px 40px ${theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.2)'}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = `0 8px 40px ${themeStyles.shadow}`;
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        background: item.color,
                        borderRadius: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '1rem',
                        boxShadow: `0 4px 20px ${item.color}40`
                      }}>
                        {item.icon}
                      </div>
                      <div>
                        <p style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: themeStyles.textSecondary,
                          margin: '0'
                        }}>
                          {item.title}
                        </p>
                        <p style={{
                          fontSize: '1.25rem',
                          fontWeight: 'bold',
                          margin: '0.25rem 0 0 0',
                          color: themeStyles.textPrimary
                        }}>
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Information */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              borderRadius: '0.8rem',
              padding: '20px',
              marginBottom: '20px',
              opacity: 0,
              transform: 'translateY(200px)',
              animation: 'slide-up 1s ease forwards',
              animationDelay: '0.2s',
              color: '#fff'
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
                Your account details and contact information.
              </p>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {[
                  { icon: <User size={20} color="white" />, label: 'Full Name', value: user?.fullName },
                  { icon: <Mail size={20} color="white" />, label: 'Email Address', value: user?.email },
                  { icon: <Phone size={20} color="white" />, label: 'Phone Number', value: user?.phoneNumber },
                  { icon: <Calendar size={20} color="white" />, label: 'Account Created', value: user?.createdAt ? formatDate(user.createdAt) : 'Recently' }
                ].map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem'
                    }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', margin: '0' }}>
                        {item.label}
                      </p>
                      <p style={{ fontSize: '1rem', fontWeight: '500', color: '#fff', margin: '0.25rem 0 0 0' }}>
                        {item.value}
                      </p>
                    </div>
                    {item.label === 'Full Name' && user?.isVerified && (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: 'rgba(16, 185, 129, 0.3)',
                        color: '#fff'
                      }}>
                        Verified
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div style={{
            background: themeStyles.cardBackground,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${themeStyles.border}`,
            boxShadow: `0 8px 40px ${themeStyles.shadow}`,
            borderRadius: '1.5rem',
            padding: '1.5rem',
            color: themeStyles.textPrimary,
            opacity: 0,
            transform: 'translateX(200px)',
            animation: 'slide-right 1s ease forwards',
            animationDelay: '0.4s'
          }} className="mobile-p-4">
            <h3 style={{
              fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
              fontWeight: 'bold',
              color: themeStyles.textPrimary,
              marginBottom: '1.5rem'
            }}>
              Quick Actions
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                {
                  icon: <Cloud size={24} color="white" />,
                  title: 'Weather Dashboard',
                  description: 'View current conditions',
                  action: handleViewWeather
                },
                {
                  icon: <MapPin size={24} color="white" />,
                  title: 'Manage Locations',
                  description: 'Add new locations',
                  action: handleManageLocations
                },
                {
                  icon: <Edit3 size={24} color="white" />,
                  title: 'Edit Profile',
                  description: 'Update your information',
                  action: handleEditProfile
                },
                {
                  icon: <Settings size={24} color="white" />,
                  title: 'Security Settings',
                  description: 'Manage your password',
                  action: handleSecuritySettings
                },
                {
                  icon: <AlertTriangle size={24} color="white" />,
                  title: 'Weather Alerts',
                  description: 'Configure notifications',
                  action: handleViewWeather
                },
                {
                  icon: <Activity size={24} color="white" />,
                  title: 'Activity Log',
                  description: 'View recent activity',
                  action: handleActivityLog
                }
              ].map((action, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  onClick={action.action}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
                  }}>
                    {action.icon}
                  </div>
                  <h4 style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#fff',
                    marginBottom: '0.5rem',
                    margin: '0 0 0.5rem 0'
                  }}>
                    {action.title}
                  </h4>
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.5',
                    margin: '0'
                  }}>
                    {action.description}
                  </p>
                </div>
              ))}

              {/* See More Button */}
              <button style={{
                width: '100%',
                padding: '15px 0',
                cursor: 'pointer',
                background: 'rgba(64, 154, 199, 0.8)',
                border: 'none',
                fontSize: '1rem',
                color: '#fff',
                borderRadius: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.7rem',
                transition: '0.5s',
                backdropFilter: 'blur(10px)'
              }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.border = '1px solid #fff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(64, 154, 199, 0.8)';
                  e.target.style.border = 'none';
                }}
              >
                <span>See More</span>
                <span style={{ fontSize: '1.2rem' }}>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-70%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(200px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-right {
          from {
            opacity: 0;
            transform: translateX(200px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;