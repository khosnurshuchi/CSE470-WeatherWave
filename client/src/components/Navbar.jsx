import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Menu, X, Cloud, MapPin, Home } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  if (!isAuthenticated) {
    return null; // Don't show navbar if not authenticated
  }

  // Updated styles to match dashboard theme
  const navbarStyle = {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    zIndex: 10
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: '#fff'
  };

  const logoIconStyle = {
    width: '2rem',
    height: '2rem',
    background: 'rgba(59, 130, 246, 0.8)',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.3)',
    backdropFilter: 'blur(10px)'
  };

  const logoTextStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#fff'
  };

  const navLinkStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    color: isActive(path) ? '#fff' : 'rgba(255, 255, 255, 0.8)',
    background: isActive(path) ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
    border: isActive(path) ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
    backdropFilter: isActive(path) ? 'blur(10px)' : 'none'
  });

  const mobileNavLinkStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    color: isActive(path) ? '#fff' : 'rgba(255, 255, 255, 0.8)',
    background: isActive(path) ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
    border: isActive(path) ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
    backdropFilter: isActive(path) ? 'blur(10px)' : 'none'
  });

  const userButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    background: 'transparent',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const dropdownStyle = {
    position: 'absolute',
    right: '0',
    top: '100%',
    marginTop: '0.5rem',
    width: '12rem',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    borderRadius: '0.75rem',
    padding: '0.5rem',
    zIndex: 50,
    opacity: 0,
    visibility: 'hidden',
    transform: 'translateY(-10px)',
    transition: 'all 0.2s ease'
  };

  const dropdownVisibleStyle = {
    ...dropdownStyle,
    opacity: 1,
    visibility: 'visible',
    transform: 'translateY(0)'
  };

  const dropdownItemStyle = {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.8)',
    background: 'transparent',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    textDecoration: 'none'
  };

  const menuButtonStyle = {
    color: 'rgba(255, 255, 255, 0.8)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    transition: 'all 0.2s ease'
  };

  const mobileMenuStyle = {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderTop: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '1rem'
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <nav style={navbarStyle}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
            {/* Logo */}
            <div>
              <Link to="/dashboard" style={logoStyle}>
                <div style={logoIconStyle}>
                  <Cloud color="white" size={18} />
                </div>
                <span style={logoTextStyle}>WeatherWave</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="md:flex">
              <Link
                to="/dashboard"
                style={navLinkStyle('/dashboard')}
                onMouseEnter={(e) => {
                  if (!isActive('/dashboard')) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.color = '#fff';
                    e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                    e.target.style.backdropFilter = 'blur(10px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/dashboard')) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                    e.target.style.border = '1px solid transparent';
                    e.target.style.backdropFilter = 'none';
                  }
                }}
              >
                <Home size={16} />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/weather"
                style={navLinkStyle('/weather')}
                onMouseEnter={(e) => {
                  if (!isActive('/weather')) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.color = '#fff';
                    e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                    e.target.style.backdropFilter = 'blur(10px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/weather')) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                    e.target.style.border = '1px solid transparent';
                    e.target.style.backdropFilter = 'none';
                  }
                }}
              >
                <Cloud size={16} />
                <span>Weather</span>
              </Link>

              <Link
                to="/locations"
                style={navLinkStyle('/locations')}
                onMouseEnter={(e) => {
                  if (!isActive('/locations')) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.color = '#fff';
                    e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                    e.target.style.backdropFilter = 'blur(10px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/locations')) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                    e.target.style.border = '1px solid transparent';
                    e.target.style.backdropFilter = 'none';
                  }
                }}
              >
                <MapPin size={16} />
                <span>Locations</span>
              </Link>

              {/* User Menu */}
              <div style={{ position: 'relative' }} className="group">
                <button 
                  style={userButtonStyle}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                  }}
                >
                  <div style={{
                    width: '1.75rem',
                    height: '1.75rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <User size={14} />
                  </div>
                  <span>{user?.fullName}</span>
                </button>

                {/* Dropdown Menu */}
                <div 
                  style={dropdownStyle}
                  className="group-hover:opacity-100 group-hover:visible group-hover:translate-y-0"
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '1';
                    e.target.style.visibility = 'visible';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <Link
                    to="/profile"
                    style={dropdownItemStyle}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                    }}
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={dropdownItemStyle}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <LogOut size={16} />
                      <span>Logout</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div style={{ display: 'flex', alignItems: 'center' }} className="md:hidden">
              <button
                onClick={toggleMenu}
                style={menuButtonStyle}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div style={mobileMenuStyle} className="md:hidden">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link
                  to="/dashboard"
                  style={mobileNavLinkStyle('/dashboard')}
                  onClick={() => setIsMenuOpen(false)}
                  onMouseEnter={(e) => {
                    if (!isActive('/dashboard')) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.color = '#fff';
                      e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                      e.target.style.backdropFilter = 'blur(10px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive('/dashboard')) {
                      e.target.style.background = 'transparent';
                      e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                      e.target.style.border = '1px solid transparent';
                      e.target.style.backdropFilter = 'none';
                    }
                  }}
                >
                  <Home size={18} />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/weather"
                  style={mobileNavLinkStyle('/weather')}
                  onClick={() => setIsMenuOpen(false)}
                  onMouseEnter={(e) => {
                    if (!isActive('/weather')) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.color = '#fff';
                      e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                      e.target.style.backdropFilter = 'blur(10px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive('/weather')) {
                      e.target.style.background = 'transparent';
                      e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                      e.target.style.border = '1px solid transparent';
                      e.target.style.backdropFilter = 'none';
                    }
                  }}
                >
                  <Cloud size={18} />
                  <span>Weather</span>
                </Link>

                <Link
                  to="/locations"
                  style={mobileNavLinkStyle('/locations')}
                  onClick={() => setIsMenuOpen(false)}
                  onMouseEnter={(e) => {
                    if (!isActive('/locations')) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.color = '#fff';
                      e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                      e.target.style.backdropFilter = 'blur(10px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive('/locations')) {
                      e.target.style.background = 'transparent';
                      e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                      e.target.style.border = '1px solid transparent';
                      e.target.style.backdropFilter = 'none';
                    }
                  }}
                >
                  <MapPin size={18} />
                  <span>Locations</span>
                </Link>

                <Link
                  to="/profile"
                  style={mobileNavLinkStyle('/profile')}
                  onClick={() => setIsMenuOpen(false)}
                  onMouseEnter={(e) => {
                    if (!isActive('/profile')) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.color = '#fff';
                      e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                      e.target.style.backdropFilter = 'blur(10px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive('/profile')) {
                      e.target.style.background = 'transparent';
                      e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                      e.target.style.border = '1px solid transparent';
                      e.target.style.backdropFilter = 'none';
                    }
                  }}
                >
                  <User size={18} />
                  <span>Edit Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  style={mobileNavLinkStyle()}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.color = '#fff';
                    e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                    e.target.style.backdropFilter = 'blur(10px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                    e.target.style.border = '1px solid transparent';
                    e.target.style.backdropFilter = 'none';
                  }}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;