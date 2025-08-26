// Replace your current Navbar component with this updated version:

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { LogOut, User, Menu, X, Cloud, MapPin, Home, Sun, Moon, Bell, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme, getThemeStyles } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const themeStyles = getThemeStyles();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const navbarStyle = {
    background: themeStyles.cardBackground,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${themeStyles.border}`,
    boxShadow: `0 8px 40px ${themeStyles.shadow}`,
    position: 'sticky',
    top: 0,
    zIndex: 50,
    transition: 'all 0.3s ease'
  };

  const containerStyle = {
    background: themeStyles.background,
    position: 'sticky',
    top: 0,
    zIndex: 50
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none',
    color: themeStyles.textPrimary,
    padding: '0.5rem',
    borderRadius: '12px',
    transition: 'all 0.2s ease'
  };

  const logoIconStyle = {
    width: '2.5rem',
    height: '2.5rem',
    background: theme === 'dark'
      ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
      : 'linear-gradient(135deg, #59, 130, 246, 0.9), #1e40af 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme === 'dark'
      ? '0 4px 20px rgba(59, 130, 246, 0.4)'
      : '0 4px 20px rgba(59, 130, 246, 0.3)',
    backdropFilter: 'blur(10px)'
  };

  const logoTextStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const navLinkStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    color: isActive(path) ? themeStyles.textPrimary : themeStyles.textSecondary,
    background: isActive(path)
      ? `linear-gradient(135deg, ${theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.25)'}, ${theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.15)'})`
      : 'transparent',
    border: isActive(path)
      ? `2px solid ${theme === 'dark' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.4)'}`
      : '2px solid transparent',
    backdropFilter: isActive(path) ? 'blur(10px)' : 'none',
    boxShadow: isActive(path)
      ? `0 4px 20px ${theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`
      : 'none'
  });

  const themeToggleStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.75rem',
    height: '2.75rem',
    background: theme === 'dark'
      ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
      : 'linear-gradient(135deg, #1e293b, #334155)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: theme === 'dark'
      ? '0 4px 20px rgba(251, 191, 36, 0.3)'
      : '0 4px 20px rgba(30, 41, 59, 0.3)',
    backdropFilter: 'blur(10px)'
  };

  const userButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1.25rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: themeStyles.textSecondary,
    background: 'transparent',
    border: `2px solid transparent`,
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none'
  };

  const menuButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.75rem',
    height: '2.75rem',
    color: themeStyles.textSecondary,
    background: 'rgba(255, 255, 255, 0.1)',
    border: `1px solid ${themeStyles.border}`,
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  };

  const mobileMenuStyle = {
    background: themeStyles.cardBackground,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${themeStyles.border}`,
    borderTop: `2px solid ${theme === 'dark' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.4)'}`,
    padding: '1.5rem',
    boxShadow: `0 8px 40px ${themeStyles.shadow}`
  };

  return (
    <div style={containerStyle}>
      <nav style={navbarStyle}>
        <div style={{
          maxWidth: '90rem',
          margin: '0 auto',
          padding: '0 1.5rem',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '5rem',
            position: 'relative'
          }}>
            {/* Logo */}
            <Link to="/" style={logoStyle}>
              <div style={logoIconStyle}>
                <Cloud color="white" size={20} />
              </div>
              <span style={logoTextStyle}>WeatherWave</span>
            </Link>

            {/* Desktop Navigation */}
            <div style={{
              display: 'none',
              '@media (min-width: 768px)': {
                display: 'flex'
              }
            }} className="hidden md:flex md:items-center md:gap-2">
              

              {/* Show authenticated routes only if user is logged in */}
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    style={navLinkStyle('/dashboard')}
                    onMouseEnter={(e) => {
                      if (!isActive('/dashboard')) {
                        e.target.style.background = theme === 'dark'
                          ? 'rgba(59, 130, 246, 0.1)'
                          : 'rgba(255, 255, 255, 0.15)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = `0 6px 25px ${theme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive('/dashboard')) {
                        e.target.style.background = 'transparent';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <User size={18} />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    to="/weather"
                    style={navLinkStyle('/weather')}
                    onMouseEnter={(e) => {
                      if (!isActive('/weather')) {
                        e.target.style.background = theme === 'dark'
                          ? 'rgba(59, 130, 246, 0.1)'
                          : 'rgba(255, 255, 255, 0.15)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = `0 6px 25px ${theme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive('/weather')) {
                        e.target.style.background = 'transparent';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <Cloud size={18} />
                    <span>Weather</span>
                  </Link>

                  <Link
                    to="/locations"
                    style={navLinkStyle('/locations')}
                    onMouseEnter={(e) => {
                      if (!isActive('/locations')) {
                        e.target.style.background = theme === 'dark'
                          ? 'rgba(59, 130, 246, 0.1)'
                          : 'rgba(255, 255, 255, 0.15)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = `0 6px 25px ${theme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive('/locations')) {
                        e.target.style.background = 'transparent';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <MapPin size={18} />
                    <span>Locations</span>
                  </Link>

                  <Link
                    to="/alerts"
                    style={navLinkStyle('/alerts')}
                    onMouseEnter={(e) => {
                      if (!isActive('/alerts')) {
                        e.target.style.background = theme === 'dark'
                          ? 'rgba(59, 130, 246, 0.1)'
                          : 'rgba(255, 255, 255, 0.15)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = `0 6px 25px ${theme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive('/alerts')) {
                        e.target.style.background = 'transparent';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <Bell size={18} />
                    <span>Alerts</span>
                  </Link>
                </>
              )}
            </div>

            {/* Right side - Theme toggle, User menu/Login, Mobile menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                style={themeToggleStyle}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = theme === 'dark'
                    ? '0 8px 30px rgba(251, 191, 36, 0.4)'
                    : '0 8px 30px rgba(30, 41, 59, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = theme === 'dark'
                    ? '0 4px 20px rgba(251, 191, 36, 0.3)'
                    : '0 4px 20px rgba(30, 41, 59, 0.3)';
                }}
              >
                {theme === 'light' ? <Moon size={16} color="white" /> : <Sun size={16} color="#1e293b" />}
              </button>

              {/* Desktop User Menu/Login */}
              <div style={{
                display: 'none',
                '@media (min-width: 768px)': {
                  display: 'flex'
                }
              }} className="hidden md:flex md:items-center md:gap-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      style={userButtonStyle}
                      onMouseEnter={(e) => {
                        e.target.style.background = theme === 'dark'
                          ? 'rgba(59, 130, 246, 0.1)'
                          : 'rgba(255, 255, 255, 0.15)';
                        e.target.style.color = themeStyles.textPrimary;
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = `0 6px 25px ${theme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = themeStyles.textSecondary;
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{
                        width: '2rem',
                        height: '2rem',
                        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                      }}>
                        <User size={14} color="white" />
                      </div>
                      <span>{user?.fullName}</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      style={{
                        ...userButtonStyle,
                        marginLeft: '0.5rem',
                        color: '#ef4444'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 25px rgba(239, 68, 68, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    style={userButtonStyle}
                    onMouseEnter={(e) => {
                      e.target.style.background = theme === 'dark'
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(255, 255, 255, 0.15)';
                      e.target.style.color = themeStyles.textPrimary;
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = `0 6px 25px ${theme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = themeStyles.textSecondary;
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <LogIn size={16} />
                    <span>Login</span>
                  </Link>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={toggleMenu}
                style={menuButtonStyle}
                className="md:hidden"
                onMouseEnter={(e) => {
                  e.target.style.background = theme === 'dark'
                    ? 'rgba(59, 130, 246, 0.2)'
                    : 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div style={mobileMenuStyle} className="md:hidden">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Always show Home in mobile */}
                <Link
                  to="/"
                  style={navLinkStyle('/')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home size={20} />
                  <span>Home</span>
                </Link>

                {/* Show authenticated routes only if user is logged in */}
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      style={navLinkStyle('/dashboard')}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={20} />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      to="/weather"
                      style={navLinkStyle('/weather')}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Cloud size={20} />
                      <span>Weather</span>
                    </Link>

                    <Link
                      to="/locations"
                      style={navLinkStyle('/locations')}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <MapPin size={20} />
                      <span>Locations</span>
                    </Link>

                    <Link
                      to="/alerts"
                      style={navLinkStyle('/alerts')}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Bell size={20} />
                      <span>Weather Alerts</span>
                    </Link>

                    <Link
                      to="/profile"
                      style={navLinkStyle('/profile')}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={20} />
                      <span>Edit Profile</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      style={{
                        ...navLinkStyle(),
                        color: '#ef4444',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '2px solid rgba(239, 68, 68, 0.2)'
                      }}
                    >
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    style={{
                      ...navLinkStyle('/login'),
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '2px solid rgba(59, 130, 246, 0.2)'
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn size={20} />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <style jsx>{`
        @media (max-width: 1120px) {
          .hidden { display: none !important; }
        }
        @media (min-width: 1120px) {
          .md\\:flex { display: flex !important; }
          .md\\:items-center { align-items: center !important; }
          .md\\:gap-2 { gap: 0.5rem !important; }
          .md\\:block { display: block !important; }
          .md\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Navbar;