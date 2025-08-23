import { useAuth } from '../contexts/AuthContext';
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
  const navigate = useNavigate();

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

  const headerCardStyle = {
    ...cardStyle,
    marginBottom: '2rem'
  };

  const statsCardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '1rem',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    padding: '1.5rem',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  };

  const actionCardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '1rem',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    padding: '2rem',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'inherit',
    display: 'block'
  };

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #047857, #065f46)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem'
  };

  const subtitleStyle = {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '0'
  };

  const avatarStyle = {
    width: '4rem',
    height: '4rem',
    background: 'linear-gradient(135deg, #047857, #065f46)',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 25px rgba(4, 120, 87, 0.3)'
  };

  const logoutButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 14px 0 rgba(220, 38, 38, 0.3)'
  };

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <div style={headerCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={titleStyle}>
                Welcome back, {user?.fullName}!
              </h1>
              <p style={subtitleStyle}>
                Here's your account information and weather dashboard.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={avatarStyle}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>
                  {user?.fullName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                style={logoutButtonStyle}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.background = 'linear-gradient(135deg, #b91c1c, #991b1b)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div
            style={statsCardStyle}
            onClick={handleViewWeather}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                <Cloud color="white" size={20} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', margin: '0' }}>
                  Weather Dashboard
                </p>
                <p style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0.25rem 0 0 0', color: '#374151' }}>
                  View Now
                </p>
              </div>
            </div>
          </div>

          <div
            style={statsCardStyle}
            onClick={handleManageLocations}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                background: 'linear-gradient(135deg, #10b981, #047857)',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                <MapPin color="white" size={20} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', margin: '0' }}>
                  My Locations
                </p>
                <p style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0.25rem 0 0 0', color: '#374151' }}>
                  Manage
                </p>
              </div>
            </div>
          </div>

          <div
            style={statsCardStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                <Shield color="white" size={20} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', margin: '0' }}>
                  Account Status
                </p>
                <p style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0.25rem 0 0 0' }}>
                  {user?.isVerified ? (
                    <span style={{ color: '#047857' }}>Verified</span>
                  ) : (
                    <span style={{ color: '#ef4444' }}>Unverified</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Information Card */}
        <div style={cardStyle}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#047857',
            marginBottom: '0.5rem'
          }}>
            Personal Information
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '2rem'
          }}>
            Your account details and contact information.
          </p>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {[
              { icon: User, label: 'Full Name', value: user?.fullName, color: '#047857' },
              { icon: Mail, label: 'Email Address', value: user?.email, color: '#3b82f6' },
              { icon: Phone, label: 'Phone Number', value: user?.phoneNumber, color: '#8b5cf6' },
              { icon: Calendar, label: 'Account Created', value: user?.createdAt ? formatDate(user.createdAt) : 'Recently', color: '#f59e0b' }
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: index % 2 === 0 ? 'rgba(16, 185, 129, 0.05)' : 'white',
                borderRadius: '0.75rem',
                border: '1px solid rgba(16, 185, 129, 0.1)'
              }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  backgroundColor: `${item.color}20`,
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem'
                }}>
                  <item.icon color={item.color} size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', margin: '0' }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: '1rem', fontWeight: '500', color: '#374151', margin: '0.25rem 0 0 0' }}>
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
                    backgroundColor: '#10b98120',
                    color: '#047857'
                  }}>
                    Verified
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={cardStyle}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#047857',
            marginBottom: '1.5rem'
          }}>
            Quick Actions
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                icon: Cloud,
                title: 'Weather Dashboard',
                description: 'View current weather conditions and forecasts for all your locations.',
                gradient: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                action: handleViewWeather
              },
              {
                icon: MapPin,
                title: 'Manage Locations',
                description: 'Add, remove, and organize your weather monitoring locations.',
                gradient: 'linear-gradient(135deg, #10b981, #047857)',
                action: handleManageLocations
              },
              {
                icon: Edit3,
                title: 'Edit Profile',
                description: 'Update your personal information and contact details.',
                gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                action: handleEditProfile
              },
              {
                icon: Settings,
                title: 'Security Settings',
                description: 'Manage your password and security preferences.',
                gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
                action: handleSecuritySettings
              },
              {
                icon: AlertTriangle,
                title: 'Weather Alerts',
                description: 'Configure notifications for severe weather conditions.',
                gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
                action: handleViewWeather
              },
              {
                icon: Activity,
                title: 'Activity Log',
                description: 'View your recent account activity and login history.',
                gradient: 'linear-gradient(135deg, #6b7280, #4b5563)',
                action: handleActivityLog
              }
            ].map((action, index) => (
              <div
                key={index}
                style={actionCardStyle}
                onClick={action.action}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
                }}
              >
                <div style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  background: action.gradient,
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
                }}>
                  <action.icon color="white" size={24} />
                </div>
                <h4 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#374151',
                  marginBottom: '0.5rem',
                  margin: '0 0 0.5rem 0'
                }}>
                  {action.title}
                </h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  lineHeight: '1.5',
                  margin: '0'
                }}>
                  {action.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;