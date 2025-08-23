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

  const navLinkClass = (path) => `
    text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors
    ${isActive(path) ? 'bg-blue-50 text-blue-600' : ''}
  `;

  const mobileNavLinkClass = (path) => `
    block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium
    ${isActive(path) ? 'bg-blue-50 text-blue-600' : ''}
  `;

  return (
    <nav className="bg-white border-b shadow-lg">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                <Cloud className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold text-gray-900">WeatherWave</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-4 md:flex">
            <Link
              to="/dashboard"
              className={navLinkClass('/dashboard')}
            >
              <div className="flex items-center space-x-1">
                <Home size={16} />
                <span>Dashboard</span>
              </div>
            </Link>

            <Link
              to="/weather"
              className={navLinkClass('/weather')}
            >
              <div className="flex items-center space-x-1">
                <Cloud size={16} />
                <span>Weather</span>
              </div>
            </Link>

            <Link
              to="/locations"
              className={navLinkClass('/locations')}
            >
              <div className="flex items-center space-x-1">
                <MapPin size={16} />
                <span>Locations</span>
              </div>
            </Link>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center px-3 py-2 space-x-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:text-blue-600">
                <User size={18} />
                <span>{user?.fullName}</span>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 z-50 invisible w-48 py-1 mt-2 transition-all duration-200 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-2">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t sm:px-3">
              <Link
                to="/dashboard"
                className={mobileNavLinkClass('/dashboard')}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <Home size={18} />
                  <span>Dashboard</span>
                </div>
              </Link>

              <Link
                to="/weather"
                className={mobileNavLinkClass('/weather')}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <Cloud size={18} />
                  <span>Weather</span>
                </div>
              </Link>

              <Link
                to="/locations"
                className={mobileNavLinkClass('/locations')}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <MapPin size={18} />
                  <span>Locations</span>
                </div>
              </Link>

              <Link
                to="/profile"
                className={mobileNavLinkClass('/profile')}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <User size={18} />
                  <span>Edit Profile</span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="block w-full px-3 py-2 text-base font-medium text-left text-gray-700 rounded-md hover:text-blue-600"
              >
                <div className="flex items-center space-x-2">
                  <LogOut size={18} />
                  <span>Logout</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;