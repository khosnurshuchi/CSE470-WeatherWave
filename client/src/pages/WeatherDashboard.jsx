import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { weatherAPI } from '../services/api';
import {
    Cloud,
    CloudRain,
    Sun,
    Snowflake,
    Wind,
    Droplets,
    Eye,
    Gauge,
    Thermometer,
    MapPin,
    Star,
    Settings2,
    AlertTriangle,
    RefreshCw,
    Plus,
    ArrowRight,
    Search,
    X
} from 'lucide-react';
import toast from 'react-hot-toast';

const WeatherDashboard = () => {
    const [locations, setLocations] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unit, setUnit] = useState('celsius');
    const [refreshing, setRefreshing] = useState(false);
    
    // Search functionality state
    const [allLocations, setAllLocations] = useState([]);
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [selectedLocationModal, setSelectedLocationModal] = useState(null);
    const [modalWeatherData, setModalWeatherData] = useState(null);
    const [loadingModal, setLoadingModal] = useState(false);
    
    const navigate = useNavigate();
    const { theme, getThemeStyles } = useTheme();
    const themeStyles = getThemeStyles();

    useEffect(() => {
        fetchWeatherData();
        fetchAlerts();
        fetchAllLocations();
    }, [unit]);

    // Filter locations based on search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredLocations(allLocations);
        } else {
            const filtered = allLocations.filter(location =>
                location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                location.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                location.region?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredLocations(filtered);
        }
    }, [searchQuery, allLocations]);

    const fetchWeatherData = async () => {
        try {
            setLoading(true);
            const response = await weatherAPI.getLocations();
            setLocations(response.data || []);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            toast.error(error.message || 'Failed to fetch weather data');
        } finally {
            setLoading(false);
        }
    };

    const fetchAlerts = async () => {
        try {
            const response = await weatherAPI.getAlerts(true, 10);
            setAlerts(response.data || []);
        } catch (error) {
            console.error('Error fetching alerts:', error);
        }
    };

    const fetchAllLocations = async () => {
        try {
            const response = await weatherAPI.getAllLocations();
            setAllLocations(response.data || []);
            setFilteredLocations(response.data || []);
        } catch (error) {
            console.error('Error fetching all locations:', error);
            toast.error('Failed to fetch locations for search');
        }
    };

    const handleLocationClick = async (location) => {
        setSelectedLocationModal(location);
        setLoadingModal(true);
        
        try {
            const response = await weatherAPI.getLocationWeather(location._id, unit);
            setModalWeatherData(response.data);
        } catch (error) {
            console.error('Error fetching location weather:', error);
            toast.error('Failed to fetch weather data for this location');
            setModalWeatherData(null);
        } finally {
            setLoadingModal(false);
        }
    };

    const closeModal = () => {
        setSelectedLocationModal(null);
        setModalWeatherData(null);
        setLoadingModal(false);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchWeatherData();
        await fetchAlerts();
        setRefreshing(false);
        toast.success('Weather data refreshed');
    };

    const handleUnitToggle = () => {
        setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius');
    };

    const handleSetDefault = async (userLocationId) => {
        try {
            await weatherAPI.setDefaultLocation(userLocationId);
            toast.success('Default location updated');
            fetchWeatherData();
        } catch (error) {
            toast.error(error.message || 'Failed to set default location');
        }
    };

    const getWeatherIcon = (description, size = 24) => {
        const desc = description?.toLowerCase() || '';
        const iconProps = { size, style: { color: '#6b7280' } };

        if (desc.includes('rain')) return <CloudRain {...iconProps} style={{ color: '#3b82f6' }} />;
        if (desc.includes('snow')) return <Snowflake {...iconProps} style={{ color: '#e5e7eb' }} />;
        if (desc.includes('cloud')) return <Cloud {...iconProps} />;
        if (desc.includes('clear') || desc.includes('sunny')) return <Sun {...iconProps} style={{ color: '#eab308' }} />;
        return <Cloud {...iconProps} />;
    };

    const convertTemperature = (temp, tempType) => {
        if (tempType === unit) return Math.round(temp);

        if (tempType === 'celsius' && unit === 'fahrenheit') {
            return Math.round((temp * 9 / 5) + 32);
        } else if (tempType === 'fahrenheit' && unit === 'celsius') {
            return Math.round((temp - 32) * 5 / 9);
        }
        return Math.round(temp);
    };

    const getAlertColor = (severity) => {
        switch (severity) {
            case 'extreme':
                return {
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderColor: '#ef4444',
                    color: '#7f1d1d'
                };
            case 'high':
                return {
                    background: 'rgba(249, 115, 22, 0.1)',
                    borderColor: '#f97316',
                    color: '#9a3412'
                };
            case 'moderate':
                return {
                    background: 'rgba(234, 179, 8, 0.1)',
                    borderColor: '#eab308',
                    color: '#713f12'
                };
            default:
                return {
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderColor: '#3b82f6',
                    color: '#1e3a8a'
                };
        }
    };

    if (loading) {
        return (
            <section className="dashboard-section">
                <div className="loading-container">
                    <div className="loading-card">
                        <div className="loading-spinner"></div>
                        <span>Loading weather data...</span>
                    </div>
                </div>
                <style jsx>{`
                    .dashboard-section {
                        min-height: 100vh;
                        background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #c7d2fe 100%);
                        padding: 2rem;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                    }
                    .loading-container {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        max-width: 1200px;
                        margin: 0 auto;
                    }
                    .loading-card {
                        background: rgba(255, 255, 255, 0.95);
                        border-radius: 24px;
                        padding: 2rem;
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                        backdrop-filter: blur(20px);
                    }
                    .loading-spinner {
                        width: 2rem;
                        height: 2rem;
                        border: 3px solid #e5e7eb;
                        border-top: 3px solid #3b82f6;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </section>
        );
    }

    if (!locations.length) {
        return (
            <section className="dashboard-section">
                <div className="home">
                    <div className="no-locations-card">
                        <MapPin size={64} />
                        <h2>No Locations Added</h2>
                        <p>You need to add at least one location to view weather data.</p>
                        <button onClick={() => navigate('/locations')} className="add-location-btn">
                            <Plus size={20} />
                            Add Your First Location
                        </button>
                    </div>
                </div>
                <style jsx>{`
                    .dashboard-section {
                        min-height: 100vh;
                        background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #c7d2fe 100%);
                        padding: 2rem;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                    }
                    .home {
                        max-width: 1200px;
                        margin: 0 auto;
                    }
                    .no-locations-card {
                        background: rgba(255, 255, 255, 0.95);
                        border-radius: 32px;
                        padding: 3rem;
                        text-align: center;
                        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
                        backdrop-filter: blur(20px);
                        border: 1px solid rgba(255, 255, 255, 0.3);
                    }
                    .no-locations-card svg {
                        color: #9ca3af;
                        margin-bottom: 1rem;
                    }
                    .no-locations-card h2 {
                        font-size: 1.5rem;
                        font-weight: bold;
                        color: #1f2937;
                        margin-bottom: 0.5rem;
                    }
                    .no-locations-card p {
                        color: #6b7280;
                        margin-bottom: 1.5rem;
                    }
                    .add-location-btn {
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                        background: linear-gradient(135deg, #3b82f6, #1e40af);
                        color: white;
                        padding: 0.75rem 1.5rem;
                        border: none;
                        border-radius: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
                    }
                    .add-location-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
                    }
                `}</style>
            </section>
        );
    }

    const defaultLocation = locations.find(loc => loc.isDefault) || locations[0];
    const otherLocations = locations.filter(loc => !loc.isDefault).slice(0, 4);

    return (
        <section style={{
            minHeight: '100vh',
            background: themeStyles.background,
            padding: 'clamp(1rem, 3vw, 2rem)',
            fontFamily: '-apple-system, BlinkMacSystemFont, \'Segoe UI\', \'Roboto\', sans-serif',
            transition: 'all 0.3s ease'
        }}>
            <div className="container-responsive" style={{ maxWidth: '90rem', margin: '0 auto' }}>
                {/* Header Controls - Now responsive */}
                <div style={{
                    position: 'fixed',
                    top: '2rem',
                    right: 'auto !important',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 'clamp(0.5rem, 2vw, 1rem)',
                    zIndex: 1,
                }} className="mobile-relative">
                    <div style={{
                        display: 'flex',
                        background: themeStyles.cardBackground,
                        borderRadius: '12px',
                        padding: '4px',
                        boxShadow: `0 4px 20px ${themeStyles.shadow}`,
                        backdropFilter: 'blur(15px)',
                        border: `1px solid ${themeStyles.border}`
                    }}>
                        <button
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                background: unit === 'celsius' ? 'linear-gradient(135deg, #3b82f6, #1e40af)' : 'transparent',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                color: unit === 'celsius' ? 'white' : themeStyles.textSecondary,
                                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                            }}
                            onClick={handleUnitToggle}
                        >
                            °C
                        </button>
                        <button
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                background: unit === 'fahrenheit' ? 'linear-gradient(135deg, #3b82f6, #1e40af)' : 'transparent',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                color: unit === 'fahrenheit' ? 'white' : themeStyles.textSecondary,
                                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                            }}
                            onClick={handleUnitToggle}
                        >
                            °F
                        </button>
                    </div>

                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)',
                            background: themeStyles.cardBackground,
                            border: `1px solid ${themeStyles.border}`,
                            borderRadius: '12px',
                            fontWeight: '600',
                            cursor: refreshing ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                            color: themeStyles.textPrimary,
                            boxShadow: `0 4px 20px ${themeStyles.shadow}`,
                            backdropFilter: 'blur(15px)',
                            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                        }}
                    >
                        <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
                        <span className="mobile-hidden">Refresh</span>
                    </button>

                    <button
                        onClick={() => navigate('/locations')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)',
                            background: themeStyles.cardBackground,
                            border: `1px solid ${themeStyles.border}`,
                            borderRadius: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            color: themeStyles.textPrimary,
                            boxShadow: `0 4px 20px ${themeStyles.shadow}`,
                            backdropFilter: 'blur(15px)',
                            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                        }}
                    >
                        <Settings2 size={16} />
                        <span className="mobile-hidden">Manage</span>
                    </button>

                    {/* NEW SEARCH BUTTON */}
                    <button
                        onClick={() => setSearchVisible(!searchVisible)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)',
                            background: searchVisible ? 'linear-gradient(135deg, #3b82f6, #1e40af)' : themeStyles.cardBackground,
                            border: `1px solid ${themeStyles.border}`,
                            borderRadius: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            color: searchVisible ? 'white' : themeStyles.textPrimary,
                            boxShadow: `0 4px 20px ${themeStyles.shadow}`,
                            backdropFilter: 'blur(15px)',
                            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                        }}
                    >
                        <Search size={16} />
                        <span className="mobile-hidden">Search</span>
                    </button>
                </div>

                {/* SEARCH DROPDOWN */}
                {searchVisible && (
                    <div style={{
                        position: 'fixed',
                        top: '5rem',
                        right: '2rem',
                        width: 'min(400px, 90vw)',
                        background: themeStyles.cardBackground,
                        borderRadius: '20px',
                        padding: '1.5rem',
                        boxShadow: `0 25px 50px ${themeStyles.shadow}`,
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${themeStyles.border}`,
                        zIndex: 1,
                        maxHeight: '70vh',
                        overflowY: 'auto'
                    }} className="mobile-search-position">
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginBottom: '1rem'
                        }}>
                            <Search size={20} style={{ color: themeStyles.textSecondary }} />
                            <input
                                type="text"
                                placeholder="Search locations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: themeStyles.background,
                                    border: `1px solid ${themeStyles.border}`,
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    color: themeStyles.textPrimary,
                                    outline: 'none'
                                }}
                                autoFocus
                            />
                            <button
                                onClick={() => {
                                    setSearchVisible(false);
                                    setSearchQuery('');
                                }}
                                style={{
                                    padding: '0.5rem',
                                    background: 'transparent',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    color: themeStyles.textSecondary,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                            {filteredLocations.length > 0 ? (
                                filteredLocations.map((location) => (
                                    <div
                                        key={location._id}
                                        onClick={() => handleLocationClick(location)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            marginBottom: '0.5rem',
                                            background: 'transparent',
                                            border: `1px solid transparent`
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = themeStyles.background;
                                            e.target.style.borderColor = themeStyles.border;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'transparent';
                                            e.target.style.borderColor = 'transparent';
                                        }}
                                    >
                                        <MapPin size={16} style={{ color: themeStyles.textSecondary, flexShrink: 0 }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                fontWeight: '600',
                                                color: themeStyles.textPrimary,
                                                fontSize: '1rem'
                                            }}>
                                                {location.city}
                                            </div>
                                            <div style={{
                                                fontSize: '0.875rem',
                                                color: themeStyles.textSecondary
                                            }}>
                                                {location.region ? `${location.region}, ` : ''}{location.country}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '2rem',
                                    color: themeStyles.textSecondary
                                }}>
                                    No locations found matching "{searchQuery}"
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* LOCATION DETAILS MODAL */}
                {selectedLocationModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2000,
                        padding: '1rem'
                    }} onClick={closeModal}>
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: themeStyles.cardBackground,
                                borderRadius: '24px',
                                padding: '2rem',
                                width: 'min(500px, 90vw)',
                                maxHeight: '80vh',
                                overflowY: 'auto',
                                boxShadow: `0 25px 50px ${themeStyles.shadow}`,
                                backdropFilter: 'blur(20px)',
                                border: `1px solid ${themeStyles.border}`
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '2rem'
                            }}>
                                <h2 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: themeStyles.textPrimary,
                                    margin: 0
                                }}>
                                    {selectedLocationModal.city}, {selectedLocationModal.country}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    style={{
                                        padding: '0.5rem',
                                        background: 'transparent',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        color: themeStyles.textSecondary,
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {loadingModal ? (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '3rem'
                                }}>
                                    <div className="loading-spinner"></div>
                                    <span style={{ marginLeft: '1rem', color: themeStyles.textSecondary }}>
                                        Loading weather data...
                                    </span>
                                </div>
                            ) : modalWeatherData ? (
                                <div>
                                    {/* Current Weather */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.5rem',
                                        padding: '1.5rem',
                                        background: themeStyles.background,
                                        borderRadius: '16px',
                                        marginBottom: '1.5rem'
                                    }}>
                                        {getWeatherIcon(modalWeatherData.description, 60)}
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                fontSize: '2.5rem',
                                                fontWeight: 'bold',
                                                color: themeStyles.textPrimary,
                                                lineHeight: 1
                                            }}>
                                                {convertTemperature(modalWeatherData.temperature, modalWeatherData.temperatureType)}°{unit.charAt(0).toUpperCase()}
                                            </div>
                                            <div style={{
                                                fontSize: '1rem',
                                                color: themeStyles.textSecondary,
                                                textTransform: 'capitalize',
                                                marginTop: '0.5rem'
                                            }}>
                                                {modalWeatherData.description}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Weather Details Grid */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: '1rem'
                                    }}>
                                        <div style={{
                                            padding: '1rem',
                                            background: themeStyles.background,
                                            borderRadius: '12px',
                                            textAlign: 'center'
                                        }}>
                                            <Droplets size={20} style={{ color: '#3b82f6', marginBottom: '0.5rem' }} />
                                            <div style={{ fontSize: '0.875rem', color: themeStyles.textSecondary }}>Humidity</div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: themeStyles.textPrimary }}>
                                                {modalWeatherData.humidity}%
                                            </div>
                                        </div>

                                        <div style={{
                                            padding: '1rem',
                                            background: themeStyles.background,
                                            borderRadius: '12px',
                                            textAlign: 'center'
                                        }}>
                                            <Wind size={20} style={{ color: '#10b981', marginBottom: '0.5rem' }} />
                                            <div style={{ fontSize: '0.875rem', color: themeStyles.textSecondary }}>Wind Speed</div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: themeStyles.textPrimary }}>
                                                {modalWeatherData.windSpeed} km/h
                                            </div>
                                        </div>

                                        <div style={{
                                            padding: '1rem',
                                            background: themeStyles.background,
                                            borderRadius: '12px',
                                            textAlign: 'center'
                                        }}>
                                            <Eye size={20} style={{ color: '#8b5cf6', marginBottom: '0.5rem' }} />
                                            <div style={{ fontSize: '0.875rem', color: themeStyles.textSecondary }}>Visibility</div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: themeStyles.textPrimary }}>
                                                {modalWeatherData.visibility} km
                                            </div>
                                        </div>

                                        <div style={{
                                            padding: '1rem',
                                            background: themeStyles.background,
                                            borderRadius: '12px',
                                            textAlign: 'center'
                                        }}>
                                            <Gauge size={20} style={{ color: '#f59e0b', marginBottom: '0.5rem' }} />
                                            <div style={{ fontSize: '0.875rem', color: themeStyles.textSecondary }}>Pressure</div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: themeStyles.textPrimary }}>
                                                {modalWeatherData.pressure} hPa
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '2rem',
                                    color: themeStyles.textSecondary
                                }}>
                                    <Cloud size={60} style={{ marginBottom: '1rem' }} />
                                    <p>No weather data available for this location</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Weather Alerts - Responsive */}
                {alerts.length > 0 && (
                    <div style={{
                        background: themeStyles.cardBackground,
                        borderRadius: '24px',
                        padding: 'clamp(1.5rem, 4vw, 2rem)',
                        marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
                        boxShadow: `0 20px 40px ${themeStyles.shadow}`,
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${themeStyles.border}`,
                        marginTop: '6rem'
                    }} className="mobile-mt-20">
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginBottom: '1rem',
                            flexWrap: 'wrap'
                        }}>
                            <AlertTriangle size={24} style={{ color: '#eab308', flexShrink: 0 }} />
                            <h2 style={{
                                fontSize: 'clamp(1.125rem, 3vw, 1.25rem)',
                                fontWeight: 'bold',
                                color: themeStyles.textPrimary,
                                margin: 0
                            }}>
                                Weather Alerts
                            </h2>
                        </div>

                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {alerts.map((alert) => {
                                const alertStyle = getAlertColor(alert.severity);
                                return (
                                    <div
                                        key={alert._id}
                                        style={{
                                            borderLeft: `4px solid ${alertStyle.borderColor}`,
                                            background: alertStyle.background,
                                            color: alertStyle.color,
                                            borderRadius: '12px',
                                            padding: 'clamp(0.75rem, 2vw, 1rem)',
                                            marginBottom: '0.75rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'start',
                                            flexWrap: 'wrap',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <div style={{ flex: 1, minWidth: '200px' }}>
                                            <p style={{
                                                fontWeight: '600',
                                                margin: '0 0 0.25rem 0',
                                                fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                                            }}>
                                                {alert.message}
                                            </p>
                                            <p style={{
                                                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                                                opacity: 0.75,
                                                margin: 0
                                            }}>
                                                {alert.locationId?.city}, {alert.locationId?.country} • {alert.severity.toUpperCase()}
                                            </p>
                                        </div>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            opacity: 0.6,
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {new Date(alert.createdAt).toLocaleTimeString()}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Main Weather Layout - Responsive Grid */}
                <div className="grid-responsive-sidebar" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: 'clamp(1rem, 3vw, 2rem)',
                    marginTop: alerts.length > 0 ? '0' : '6rem'
                }}>
                    {/* Main Weather Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
                        {/* Main Weather Card - Responsive */}
                        <div style={{
                            background: themeStyles.cardBackground,
                            borderRadius: 'clamp(24px, 4vw, 32px)',
                            padding: 'clamp(2rem, 5vw, 3rem)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'clamp(1rem, 4vw, 2rem)',
                            boxShadow: `0 25px 50px ${themeStyles.shadow}`,
                            backdropFilter: 'blur(20px)',
                            border: `1px solid ${themeStyles.border}`,
                            position: 'relative',
                            flexDirection: 'row'
                        }} className="mobile-stack mobile-center">
                            {defaultLocation?.currentWeather ? (
                                <>
                                    {getWeatherIcon(defaultLocation.currentWeather.description,
                                        window.innerWidth < 768 ? 60 : 80)}
                                    <div style={{
                                        display: 'flex',
                                        flex: 1,
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: '1rem'
                                    }} className="mobile-stack mobile-center">
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.5rem'
                                        }} className="mobile-center">
                                            <span style={{
                                                fontSize: 'clamp(1.5rem, 4vw, 1.75rem)',
                                                fontWeight: 'bold',
                                                color: themeStyles.textPrimary
                                            }}>
                                                {defaultLocation.location.city}, {defaultLocation.location.country}
                                            </span>
                                            <span style={{
                                                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                                color: themeStyles.textSecondary,
                                                textTransform: 'capitalize'
                                            }}>
                                                {defaultLocation.currentWeather.description}
                                            </span>
                                            {defaultLocation.nickname && (
                                                <span style={{
                                                    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                                                    color: '#3b82f6',
                                                    fontWeight: '500'
                                                }}>
                                                    "{defaultLocation.nickname}"
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ textAlign: 'right' }} className="mobile-center">
                                            <span style={{
                                                fontSize: 'clamp(3rem, 8vw, 4rem)',
                                                fontWeight: '300',
                                                color: themeStyles.textPrimary,
                                                lineHeight: 1
                                            }}>
                                                {convertTemperature(
                                                    defaultLocation.currentWeather.temperature,
                                                    defaultLocation.currentWeather.temperatureType
                                                )}
                                                <sup style={{
                                                    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                                                    fontWeight: '400'
                                                }}>
                                                    °{unit.charAt(0).toUpperCase()}
                                                </sup>
                                            </span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="mobile-center" style={{ width: '100%', textAlign: 'center', color: themeStyles.textSecondary }}>
                                    <Cloud size={60} />
                                    <p style={{ margin: '1rem 0', fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>No Data Available</p>
                                </div>
                            )}

                            {defaultLocation?.isDefault && (
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    background: '#fbbf24',
                                    borderRadius: '50%',
                                    padding: '0.5rem',
                                    boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
                                }}>
                                    <Star size={16} style={{ color: 'white', fill: 'white' }} />
                                </div>
                            )}
                        </div>

                        {/* Mini Forecast Cards - Responsive Grid */}
                        <div className="grid-responsive-1 tablet-grid-2" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: 'clamp(0.75rem, 2vw, 1rem)'
                        }}>
                            {otherLocations.slice(0, 2).map((location) => (
                                <div key={location.userLocationId} style={{
                                    background: themeStyles.cardBackground,
                                    borderRadius: '20px',
                                    padding: 'clamp(1rem, 3vw, 1.5rem)',
                                    boxShadow: `0 15px 30px ${themeStyles.shadow}`,
                                    backdropFilter: 'blur(15px)',
                                    border: `1px solid ${themeStyles.border}`,
                                    position: 'relative',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        marginBottom: '1rem',
                                        flexWrap: 'wrap'
                                    }}>
                                        {location.currentWeather ? (
                                            <>
                                                {getWeatherIcon(location.currentWeather.description, 40)}
                                                <span style={{
                                                    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                                                    fontWeight: 'bold',
                                                    color: themeStyles.textPrimary
                                                }}>
                                                    {convertTemperature(
                                                        location.currentWeather.temperature,
                                                        location.currentWeather.temperatureType
                                                    )}
                                                    <sup>°{unit.charAt(0).toUpperCase()}</sup>
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Cloud size={40} />
                                                <span style={{
                                                    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                                                    fontWeight: 'bold',
                                                    color: themeStyles.textSecondary
                                                }}>
                                                    --<sup>°</sup>
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.25rem'
                                    }}>
                                        <span style={{
                                            fontWeight: '600',
                                            color: themeStyles.textPrimary,
                                            fontSize: 'clamp(1rem, 2.5vw, 1.125rem)'
                                        }}>
                                            {location.location.city}
                                        </span>
                                        <span style={{
                                            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                                            color: themeStyles.textSecondary,
                                            textTransform: 'capitalize'
                                        }}>
                                            {location.currentWeather?.description || 'No data'}
                                        </span>
                                    </div>

                                    {!location.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(location.userLocationId)}
                                            style={{
                                                position: 'absolute',
                                                top: '0.75rem',
                                                right: '0.75rem',
                                                background: 'transparent',
                                                border: 'none',
                                                padding: '0.25rem',
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                            title="Set as default"
                                        >
                                            <Star size={12} style={{ color: themeStyles.textSecondary }} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Today's Highlights - Responsive Grid */}
                        <div style={{ marginTop: 'clamp(1.5rem, 4vw, 2rem)' }}>
                            <h2 style={{
                                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                                fontWeight: 'bold',
                                color: themeStyles.textPrimary,
                                marginBottom: 'clamp(1rem, 3vw, 1.5rem)'
                            }}>
                                Today's Highlights
                            </h2>

                            <div className="grid-responsive-1 tablet-grid-2" style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: 'clamp(0.75rem, 2vw, 1rem)'
                            }}>
                                {defaultLocation?.currentWeather && (
                                    <>
                                        <div style={{
                                            background: themeStyles.cardBackground,
                                            borderRadius: '20px',
                                            padding: 'clamp(1rem, 3vw, 1.5rem)',
                                            boxShadow: `0 15px 30px ${themeStyles.shadow}`,
                                            backdropFilter: 'blur(15px)',
                                            border: `1px solid ${themeStyles.border}`,
                                            textAlign: 'center'
                                        }}>
                                            <Droplets size={32} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
                                            <h3 style={{
                                                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                                color: themeStyles.textSecondary,
                                                margin: '0 0 0.5rem 0'
                                            }}>
                                                Humidity
                                            </h3>
                                            <p style={{
                                                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                                                fontWeight: 'bold',
                                                color: themeStyles.textPrimary,
                                                margin: 0
                                            }}>
                                                {defaultLocation.currentWeather.humidity}%
                                            </p>
                                        </div>

                                        <div style={{
                                            background: themeStyles.cardBackground,
                                            borderRadius: '20px',
                                            padding: 'clamp(1rem, 3vw, 1.5rem)',
                                            boxShadow: `0 15px 30px ${themeStyles.shadow}`,
                                            backdropFilter: 'blur(15px)',
                                            border: `1px solid ${themeStyles.border}`,
                                            textAlign: 'center'
                                        }}>
                                            <Wind size={32} style={{ color: '#10b981', marginBottom: '1rem' }} />
                                            <h3 style={{
                                                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                                color: themeStyles.textSecondary,
                                                margin: '0 0 0.5rem 0'
                                            }}>
                                                Wind Speed
                                            </h3>
                                            <p style={{
                                                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                                                fontWeight: 'bold',
                                                color: themeStyles.textPrimary,
                                                margin: 0
                                            }}>
                                                {defaultLocation.currentWeather.windSpeed} km/h
                                            </p>
                                        </div>

                                        <div style={{
                                            background: themeStyles.cardBackground,
                                            borderRadius: '20px',
                                            padding: 'clamp(1rem, 3vw, 1.5rem)',
                                            boxShadow: `0 15px 30px ${themeStyles.shadow}`,
                                            backdropFilter: 'blur(15px)',
                                            border: `1px solid ${themeStyles.border}`,
                                            textAlign: 'center'
                                        }}>
                                            <Eye size={32} style={{ color: '#8b5cf6', marginBottom: '1rem' }} />
                                            <h3 style={{
                                                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                                color: themeStyles.textSecondary,
                                                margin: '0 0 0.5rem 0'
                                            }}>
                                                Visibility
                                            </h3>
                                            <p style={{
                                                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                                                fontWeight: 'bold',
                                                color: themeStyles.textPrimary,
                                                margin: 0
                                            }}>
                                                {defaultLocation.currentWeather.visibility} km
                                            </p>
                                        </div>

                                        <div style={{
                                            background: themeStyles.cardBackground,
                                            borderRadius: '20px',
                                            padding: 'clamp(1rem, 3vw, 1.5rem)',
                                            boxShadow: `0 15px 30px ${themeStyles.shadow}`,
                                            backdropFilter: 'blur(15px)',
                                            border: `1px solid ${themeStyles.border}`,
                                            textAlign: 'center'
                                        }}>
                                            <Gauge size={32} style={{ color: '#f59e0b', marginBottom: '1rem' }} />
                                            <h3 style={{
                                                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                                color: themeStyles.textSecondary,
                                                margin: '0 0 0.5rem 0'
                                            }}>
                                                Pressure
                                            </h3>
                                            <p style={{
                                                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                                                fontWeight: 'bold',
                                                color: themeStyles.textPrimary,
                                                margin: 0
                                            }}>
                                                {defaultLocation.currentWeather.pressure} hPa
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Other Cities Sidebar - Responsive */}
                    <div style={{ paddingTop: 'clamp(2rem, 5vw, 4rem)' }}>
                        <h2 style={{
                            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                            fontWeight: 'bold',
                            color: themeStyles.textPrimary,
                            marginBottom: 'clamp(1rem, 3vw, 1.5rem)'
                        }}>
                            Other Cities
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {otherLocations.map((location) => (
                                <div key={location.userLocationId} style={{
                                    background: themeStyles.cardBackground,
                                    borderRadius: '20px',
                                    padding: 'clamp(1rem, 3vw, 1.5rem)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    boxShadow: `0 15px 30px ${themeStyles.shadow}`,
                                    backdropFilter: 'blur(15px)',
                                    border: `1px solid ${themeStyles.border}`,
                                    position: 'relative',
                                    transition: 'all 0.3s ease',
                                    flexWrap: 'wrap',
                                    gap: '1rem'
                                }} className="mobile-stack">
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        flex: 1,
                                        minWidth: '200px'
                                    }}>
                                        {location.currentWeather ? (
                                            <>
                                                {getWeatherIcon(location.currentWeather.description, 48)}
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '0.25rem'
                                                }}>
                                                    <span style={{
                                                        fontWeight: '600',
                                                        color: themeStyles.textPrimary,
                                                        fontSize: 'clamp(1rem, 2.5vw, 1.125rem)'
                                                    }}>
                                                        {location.location.city}
                                                    </span>
                                                    <span style={{
                                                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                                                        color: themeStyles.textSecondary,
                                                        textTransform: 'capitalize'
                                                    }}>
                                                        {location.currentWeather.description}
                                                        {location.currentWeather.humidity && `. Humidity: ${location.currentWeather.humidity}%`}
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <Cloud size={48} />
                                                <div>
                                                    <span style={{
                                                        fontWeight: '600',
                                                        color: themeStyles.textPrimary,
                                                        fontSize: 'clamp(1rem, 2.5vw, 1.125rem)'
                                                    }}>
                                                        {location.location.city}
                                                    </span>
                                                    <span style={{
                                                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                                                        color: themeStyles.textSecondary
                                                    }}>
                                                        No data available
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div style={{
                                        textAlign: 'right',
                                        marginRight: '1rem'
                                    }} className="mobile-center">
                                        <span style={{
                                            fontSize: 'clamp(1.5rem, 4vw, 1.75rem)',
                                            fontWeight: 'bold',
                                            color: themeStyles.textPrimary
                                        }}>
                                            {location.currentWeather ?
                                                convertTemperature(
                                                    location.currentWeather.temperature,
                                                    location.currentWeather.temperatureType
                                                ) : '--'
                                            }
                                            <sup style={{
                                                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                                fontWeight: '500'
                                            }}>
                                                °{unit.charAt(0).toUpperCase()}
                                            </sup>
                                        </span>
                                    </div>

                                    {!location.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(location.userLocationId)}
                                            style={{
                                                position: 'absolute',
                                                top: '1rem',
                                                right: '1rem',
                                                background: 'transparent',
                                                border: 'none',
                                                padding: '0.5rem',
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                            title="Set as default"
                                        >
                                            <Star size={14} style={{ color: themeStyles.textSecondary }} />
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button
                                onClick={() => navigate('/locations')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '20px',
                                    padding: 'clamp(1rem, 3vw, 1.5rem)',
                                    fontWeight: '600',
                                    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 15px 30px rgba(59, 130, 246, 0.3)',
                                    backdropFilter: 'blur(10px)',
                                    marginTop: '0.5rem'
                                }}
                            >
                                <span>See More</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .mobile-relative {
                    position: relative !important;
                    top: auto !important;
                    right: auto !important;
                    margin-bottom: 2rem;
                }
                
                .mobile-mt-20 {
                    margin-top: 5rem;
                }
                
                .mobile-search-position {
                    position: relative !important;
                    top: auto !important;
                    right: auto !important;
                    width: 100% !important;
                    margin-bottom: 2rem;
                }
                
                .mobile-stack {
                    flex-direction: column !important;
                    text-align: center !important;
                }
                
                .mobile-center {
                    text-align: center !important;
                    align-items: center !important;
                }
                
                .mobile-hidden {
                    display: none;
                }
                
                @media (min-width: 768px) {
                    .mobile-relative {
                        top: 2rem !important;
                        margin-bottom: 0;
                    }
                    
                    .mobile-mt-20 {
                        margin-top: 1rem;
                    }
                    
                    .mobile-search-position {
                        top: 5rem !important;
                        width: min(400px, 90vw) !important;
                        margin-bottom: 0;
                    }
                    
                    .mobile-stack {
                        flex-direction: row !important;
                        text-align: left !important;
                    }
                    
                    .mobile-center {
                        text-align: right !important;
                        align-items: flex-end !important;
                    }
                    
                    .mobile-hidden {
                        display: inline;
                    }
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .spinning {
                    animation: spin 1s linear infinite;
                }
                
                .loading-spinner {
                    width: 2rem;
                    height: 2rem;
                    border: 3px solid #e5e7eb;
                    border-top: 3px solid #3b82f6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default WeatherDashboard;