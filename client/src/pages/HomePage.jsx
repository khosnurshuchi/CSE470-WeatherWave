import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Thermometer, 
  Wind, 
  Eye, 
  Droplets,
  ArrowRight,
  MapPin,
  Bell,
  Shield,
  Users,
  Globe,
  Smartphone
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { theme, getThemeStyles } = useTheme();
  const themeStyles = getThemeStyles();

  return (
    <div style={{
      minHeight: '100vh',
      background: themeStyles.background,
      color: themeStyles.textPrimary,
      transition: 'all 0.3s ease'
    }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)'
          : 'linear-gradient(135deg, #f1c0e8 0%, #cfbaf0 25%, #a3c4f3 50%, #90dbf4 75%, #8eecf5 100%)',
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          overflow: 'hidden'
        }}>
          {/* Floating Elements */}
          <div style={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '60px',
            height: '60px',
            background: theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.4)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '0s'
          }} />
          <div style={{
            position: 'absolute',
            top: '60%',
            left: '5%',
            width: '40px',
            height: '40px',
            background: theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite',
            animationDelay: '2s'
          }} />
          <div style={{
            position: 'absolute',
            top: '30%',
            left: '15%',
            width: '80px',
            height: '80px',
            background: theme === 'dark' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            animation: 'float 10s ease-in-out infinite',
            animationDelay: '4s'
          }} />
          
          {/* Weather Icons */}
          <div style={{
            position: 'absolute',
            top: '15%',
            right: '20%',
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.6)',
            animation: 'float 7s ease-in-out infinite'
          }}>
            <Sun size={48} />
          </div>
          <div style={{
            position: 'absolute',
            top: '70%',
            right: '25%',
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.5)',
            animation: 'float 9s ease-in-out infinite',
            animationDelay: '3s'
          }}>
            <CloudRain size={36} />
          </div>
        </div>

        {/* Hero Content */}
        <div style={{
          maxWidth: '90rem',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '3rem',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }} className="lg:grid-cols-2">
          {/* Left Content */}
          <div style={{
            opacity: 0,
            transform: 'translateY(30px)',
            animation: 'slideUp 1s ease forwards',
            animationDelay: '0.2s'
          }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 'bold',
              lineHeight: '1.1',
              marginBottom: '1.5rem',
              background: theme === 'dark' 
                ? 'linear-gradient(135deg, #ffffff, #e2e8f0)'
                : 'linear-gradient(135deg, #1e293b, #475569)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Weather Forecast Made Simple
            </h1>
            
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              lineHeight: '1.6',
              marginBottom: '2.5rem',
              color: theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 41, 59, 0.8)',
              maxWidth: '600px'
            }}>
              Get accurate weather forecasts, manage multiple locations, and stay ahead of changing conditions with our comprehensive weather platform.
            </p>

            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              {isAuthenticated ? (
                <Link
                  to="/weather"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '1rem 2rem',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '1rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 15px 35px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
                  }}
                >
                  <Cloud size={20} />
                  View Weather
                  <ArrowRight size={20} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '1rem 2rem',
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '1rem',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 15px 35px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
                    }}
                  >
                    Get Started
                    <ArrowRight size={20} />
                  </Link>

                  <Link
                    to="/login"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '1rem 2rem',
                      background: 'transparent',
                      color: theme === 'dark' ? 'white' : '#1e293b',
                      textDecoration: 'none',
                      borderRadius: '1rem',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      border: `2px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(30, 41, 59, 0.3)'}`,
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(30, 41, 59, 0.1)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Features Preview */}
            <div style={{
              display: 'flex',
              gap: '2rem',
              marginTop: '3rem',
              flexWrap: 'wrap'
            }}>
              {[
                { icon: <MapPin size={20} />, text: 'Multiple Cities' },
                { icon: <Bell size={20} />, text: 'Smart Alerts' },
                { icon: <Shield size={20} />, text: '99.9% Uptime' }
              ].map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(30, 41, 59, 0.7)',
                  fontSize: '0.95rem'
                }}>
                  {feature.icon}
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          
        </div>
      </section>

      {/* About Section */}
      <section style={{
        padding: '5rem 2rem',
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
      }}>
        <div style={{
          maxWidth: '90rem',
          margin: '0 auto'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: themeStyles.textPrimary
            }}>
              Why Choose WeatherWave?
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: themeStyles.textSecondary,
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Experience weather forecasting like never before with our advanced features and intuitive design.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                icon: <Globe size={32} />,
                title: 'Global Coverage',
                description: 'Access weather data from over multiple cities worldwide with real-time updates.',
                color: '#3b82f6'
              },
              {
                icon: <Bell size={32} />,
                title: 'Smart Alerts',
                description: 'Receive personalized weather alerts for the conditions that matter to you.',
                color: '#10b981'
              },
              {
                icon: <Smartphone size={32} />,
                title: 'Mobile Ready',
                description: 'Fully responsive design that works seamlessly across all your devices.',
                color: '#8b5cf6'
              },
              {
                icon: <Users size={32} />,
                title: 'User Friendly',
                description: 'Intuitive interface designed for weather enthusiasts of all experience levels.',
                color: '#f59e0b'
              }
            ].map((feature, index) => (
              <div key={index} style={{
                background: themeStyles.cardBackground,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${themeStyles.border}`,
                borderRadius: '1.5rem',
                padding: '2rem',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                opacity: 0,
                transform: 'translateY(30px)',
                animation: `slideUp 0.6s ease forwards`,
                animationDelay: `${0.2 * index}s`
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = `0 20px 40px ${theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  boxShadow: `0 8px 25px ${feature.color}40`
                }}>
                  <div style={{ color: 'white' }}>
                    {feature.icon}
                  </div>
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  color: themeStyles.textPrimary
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  color: themeStyles.textSecondary,
                  margin: 0
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        padding: '3rem 2rem 2rem',
        color: 'white'
      }}>
        <div style={{
          maxWidth: '90rem',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Cloud color="white" size={20} />
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>WeatherWave</span>
              </div>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6' }}>
                Your trusted companion for accurate weather forecasts and real-time updates from around the globe.
              </p>
            </div>
            
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Features</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Real-time Weather', 'Multiple Locations', 'Weather Alerts', 'Detailed Forecasts'].map((item, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Support</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((item, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', cursor: 'pointer' }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '2rem',
            textAlign: 'center'
          }}>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              margin: 0,
              fontSize: '0.9rem'
            }}>
              © 2024 WeatherWave. All rights reserved. Built with ❤️ for weather enthusiasts.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }

        @media (min-width: 1024px) {
          .lg\\:grid-cols-2 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;