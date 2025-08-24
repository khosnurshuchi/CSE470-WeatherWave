import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { weatherAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import {
    MapPin,
    Plus,
    Trash2,
    Star,
    ArrowLeft,
    AlertCircle,
    CheckCircle,
    X,
    Loader
} from 'lucide-react';
import toast from 'react-hot-toast';

const LocationManager = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addingLocation, setAddingLocation] = useState(false);

    // Location selection states
    const [availableLocations, setAvailableLocations] = useState([]);
    const [loadingAvailable, setLoadingAvailable] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [nickname, setNickname] = useState('');

    const { theme, getThemeStyles } = useTheme();
    const themeStyles = getThemeStyles();

    const navigate = useNavigate();

    useEffect(() => {
        fetchLocations();
    }, []);

    // Fetch available locations when modal opens
    useEffect(() => {
        if (showAddModal) {
            fetchAvailableLocations();
        }
    }, [showAddModal]);

    const fetchLocations = async () => {
        try {
            setLoading(true);
            const response = await weatherAPI.getLocations();
            setLocations(response.data || []);
        } catch (error) {
            console.error('Error fetching locations:', error);
            toast.error(error.message || 'Failed to fetch locations');
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableLocations = async () => {
        try {
            setLoadingAvailable(true);
            // Get all available locations
            const response = await weatherAPI.getAllLocations();

            // Filter out locations that user already has
            const userLocationIds = locations.map(ul => ul.location._id);
            const available = (response.data || []).filter(location =>
                !userLocationIds.includes(location._id)
            );

            setAvailableLocations(available);
        } catch (error) {
            console.error('Error fetching available locations:', error);
            toast.error('Failed to load available locations');
            setAvailableLocations([]);
        } finally {
            setLoadingAvailable(false);
        }
    };

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
    };

    const handleAddLocation = async (e) => {
        e.preventDefault();

        if (!selectedLocation) {
            toast.error('Please select a location from the search results');
            return;
        }

        try {
            setAddingLocation(true);
            const locationData = {
                city: selectedLocation.city,
                country: selectedLocation.country,
                coordinates: selectedLocation.coordinates,
                isDefault: locations.length === 0,
                nickname: nickname.trim() || null
            };

            await weatherAPI.addLocation(locationData);
            toast.success(`${locationData.city} added successfully`);

            // Reset form
            setSelectedLocation(null);
            setNickname('');
            setShowAddModal(false);
            fetchLocations();
        } catch (error) {
            toast.error(error.message || 'Failed to add location');
        } finally {
            setAddingLocation(false);
        }
    };

    const handleRemoveLocation = async (userLocationId, locationName) => {
        if (locations.length <= 1) {
            toast.error('You must have at least one location');
            return;
        }

        const confirmed = window.confirm(`Are you sure you want to remove ${locationName}?`);
        if (!confirmed) return;

        try {
            await weatherAPI.removeLocation(userLocationId);
            toast.success(`${locationName} removed successfully`);
            fetchLocations();
        } catch (error) {
            toast.error(error.message || 'Failed to remove location');
        }
    };

    const handleSetDefault = async (userLocationId, locationName) => {
        try {
            await weatherAPI.setDefaultLocation(userLocationId);
            toast.success(`${locationName} set as default location`);
            fetchLocations();
        } catch (error) {
            toast.error(error.message || 'Failed to set default location');
        }
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setSelectedLocation(null);
        setNickname('');
        setAvailableLocations([]);
    };

    // Updated styles matching Dashboard theme
    const containerStyle = {
        minHeight: '100vh',
        background: themeStyles.background,
        padding: 'clamp(1rem, 3vw, 2rem)',
        position: 'relative',
        transition: 'all 0.3s ease'
    };

    const cardStyle = {
        background: themeStyles.cardBackground,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${themeStyles.border}`,
        boxShadow: `0 8px 40px ${themeStyles.shadow}`,
        borderRadius: '1.5rem',
        padding: 'clamp(1.5rem, 4vw, 2rem)',
        marginBottom: '1.5rem',
        color: themeStyles.textPrimary
    };

    const locationCardStyle = {
        background: themeStyles.cardBackground,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${themeStyles.border}`,
        boxShadow: `0 8px 40px ${themeStyles.shadow}`,
        borderRadius: '1rem',
        padding: 'clamp(1rem, 3vw, 1.5rem)',
        transition: 'all 0.3s ease',
        color: themeStyles.textPrimary
    };

    const titleStyle = {
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        fontWeight: 'bold',
        margin: '0 0 0.5rem 0',
        color: themeStyles.textPrimary,
        textShadow: `2px 2px 4px ${themeStyles.shadow}`
    };

    const buttonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        fontSize: '0.875rem',
        fontWeight: '600',
        border: 'none',
        borderRadius: '0.75rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textDecoration: 'none',
        color: 'white'
    };

    const primaryButtonStyle = {
        ...buttonStyle,
        background: 'rgba(59, 130, 246, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 30px rgba(59, 130, 246, 0.3)'
    };

    const secondaryButtonStyle = {
        ...buttonStyle,
        background: 'rgba(107, 114, 128, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 30px rgba(107, 114, 128, 0.3)'
    };

    const dangerButtonStyle = {
        ...buttonStyle,
        background: 'rgba(220, 38, 38, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 30px rgba(220, 38, 38, 0.3)'
    };

    const modalStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '1rem'
    };

    const modalContentStyle = {
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '1rem',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        color: '#fff'
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        transition: 'all 0.2s ease',
        outline: 'none',
        boxSizing: 'border-box',
        background: 'rgba(255, 255, 255, 0.1)',
        color: '#fff',
        backdropFilter: 'blur(10px)'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: '0.5rem'
    };

    if (loading) {
        return (
            <div style={containerStyle}>
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

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '96rem', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={cardStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: '2rem',
                                height: '2rem',
                                border: '4px solid rgba(255, 255, 255, 0.3)',
                                borderTop: '4px solid #fff',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }} />
                            <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Loading locations...</span>
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
                `}</style>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
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

            <div style={{ maxWidth: '96rem', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div style={cardStyle}>
                    <div className="mobile-stack" style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center' }} className="mobile-full-width mobile-center">
                            <button
                                onClick={() => navigate('/weather')}
                                style={{
                                    padding: '0.5rem',
                                    marginRight: '1rem',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    backdropFilter: 'blur(10px)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                                    e.target.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                    e.target.style.transform = 'scale(1)';
                                }}
                            >
                                <ArrowLeft size={20} style={{ color: '#fff' }} />
                            </button>
                            <div>
                                <h1 style={titleStyle}>Manage Locations</h1>
                                <p style={{ color: 'rgba(255, 255, 255, 0.95)', margin: 0 }}>Select from available weather locations to track</p>
                            </div>
                        </div>
                        <button className="mobile-full-width"
                            onClick={() => setShowAddModal(true)}
                            style={primaryButtonStyle}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.02)';
                                e.target.style.background = 'rgba(37, 99, 235, 0.9)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.background = 'rgba(59, 130, 246, 0.8)';
                            }}
                        >
                            <Plus size={20} />
                            Add Location
                        </button>
                    </div>
                </div>

                {/* Locations Grid */}
                {locations.length === 0 ? (
                    <div style={{ ...cardStyle, textAlign: 'center' }}>
                        <MapPin size={64} style={{ margin: '0 auto 1rem', color: 'rgba(255, 255, 255, 0.5)' }} />
                        <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
                            No Locations Added
                        </h2>
                        <p style={{ marginBottom: '1.5rem', color: 'rgba(255, 255, 255, 0.95)', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
                            Select your first location to start tracking weather data.
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            style={primaryButtonStyle}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.02)';
                                e.target.style.background = 'rgba(37, 99, 235, 0.9)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.background = 'rgba(59, 130, 246, 0.8)';
                            }}
                        >
                            <Plus size={20} />
                            Select Location
                        </button>
                    </div>
                ) : (
                    <div className="container-responsive" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: 'clamp(1rem, 3vw, 1.5rem)'
                    }}>
                        {locations.map((userLocation) => (
                            <div
                                key={userLocation.userLocationId}
                                style={locationCardStyle}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
                                }}
                            >
                                {/* Location Header */}
                                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                        <MapPin size={20} style={{ flexShrink: 0, marginRight: '0.75rem', color: '#4ade80' }} />
                                        <div>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#fff', margin: 0, textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                                                {userLocation.location.city}
                                            </h3>
                                            <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: '0.125rem 0 0 0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>{userLocation.location.country}</p>
                                            {userLocation.nickname && (
                                                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4ade80', margin: '0.125rem 0 0 0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
                                                    "{userLocation.nickname}"
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {userLocation.isDefault ? (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '0.25rem 0.5rem',
                                                fontSize: '0.75rem',
                                                fontWeight: '500',
                                                color: '#fff',
                                                background: 'rgba(251, 191, 36, 0.8)',
                                                borderRadius: '1rem',
                                                backdropFilter: 'blur(10px)'
                                            }}>
                                                <Star size={12} style={{ marginRight: '0.25rem', color: '#fff', fill: '#fff' }} />
                                                Default
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleSetDefault(userLocation.userLocationId, userLocation.location.city)}
                                                style={{
                                                    padding: '0.5rem',
                                                    background: 'rgba(255, 255, 255, 0.2)',
                                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                                    borderRadius: '50%',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    backdropFilter: 'blur(10px)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                                                    e.target.style.transform = 'scale(1.05)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                                    e.target.style.transform = 'scale(1)';
                                                }}
                                                title="Set as default"
                                            >
                                                <Star size={16} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleRemoveLocation(userLocation.userLocationId, userLocation.location.city)}
                                            disabled={locations.length <= 1}
                                            style={{
                                                padding: '0.5rem',
                                                background: 'rgba(255, 255, 255, 0.2)',
                                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                                borderRadius: '50%',
                                                cursor: locations.length <= 1 ? 'not-allowed' : 'pointer',
                                                opacity: locations.length <= 1 ? 0.5 : 1,
                                                transition: 'all 0.2s ease',
                                                backdropFilter: 'blur(10px)'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (locations.length > 1) {
                                                    e.target.style.background = 'rgba(239, 68, 68, 0.8)';
                                                    e.target.style.transform = 'scale(1.05)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (locations.length > 1) {
                                                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                                    e.target.style.transform = 'scale(1)';
                                                }
                                            }}
                                            title={locations.length <= 1 ? "Cannot remove - you need at least one location" : "Remove location"}
                                        >
                                            <Trash2 size={16} style={{ color: '#ef4444' }} />
                                        </button>
                                    </div>
                                </div>

                                {/* Coordinates */}
                                <div style={{
                                    padding: '0.75rem',
                                    marginBottom: '1rem',
                                    borderRadius: '0.5rem',
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <div style={{ marginBottom: '0.25rem', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: '600' }}>Coordinates</div>
                                    <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: '#fff', fontWeight: '500', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
                                        {userLocation.location.coordinates.latitude.toFixed(4)}, {userLocation.location.coordinates.longitude.toFixed(4)}
                                    </div>
                                </div>

                                {/* Weather Status */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        {userLocation.currentWeather ? (
                                            <>
                                                <CheckCircle size={16} style={{ marginRight: '0.5rem', color: '#10b981' }} />
                                                <span style={{ fontSize: '0.875rem', color: '#10b981' }}>Weather data available</span>
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle size={16} style={{ marginRight: '0.5rem', color: '#eab308' }} />
                                                <span style={{ fontSize: '0.875rem', color: '#eab308' }}>No weather data</span>
                                            </>
                                        )}
                                    </div>

                                    <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: '500' }}>
                                        Added {new Date(userLocation.addedAt).toLocaleDateString()}
                                    </div>
                                </div>

                                {/* Quick Weather Info */}
                                {userLocation.currentWeather && (
                                    <div style={{
                                        paddingTop: '1rem',
                                        marginTop: '1rem',
                                        borderTop: '1px solid rgba(255, 255, 255, 0.2)'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            fontSize: '0.875rem'
                                        }}>
                                            <span style={{ color: 'rgba(255, 255, 255, 0.9)', textTransform: 'capitalize', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
                                                {userLocation.currentWeather.description}
                                            </span>
                                            <span style={{ fontWeight: '500', color: '#fff', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                                                {userLocation.currentWeather.temperature}°{userLocation.currentWeather.temperatureType.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Location Modal */}
                {showAddModal && (
                    <div style={modalStyle} onClick={handleCloseModal}>
                        <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                            <div style={{ padding: '1.5rem' }}>
                                {/* Modal Header */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>Add New Location</h2>
                                    <button
                                        onClick={handleCloseModal}
                                        style={{
                                            padding: '0.5rem',
                                            background: 'rgba(255, 255, 255, 0.2)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                                            e.target.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                            e.target.style.transform = 'scale(1)';
                                        }}
                                    >
                                        <X size={20} style={{ color: '#fff' }} />
                                    </button>
                                </div>

                                {/* Search and Add Form */}
                                <form onSubmit={handleAddLocation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {/* Location Selection */}
                                    <div>
                                        <label style={labelStyle}>
                                            Select Location *
                                        </label>

                                        {loadingAvailable ? (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '2rem',
                                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                                borderRadius: '0.5rem',
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                backdropFilter: 'blur(10px)'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <Loader size={20} style={{ color: '#fff', animation: 'spin 1s linear infinite' }} />
                                                    <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Loading available locations...</span>
                                                </div>
                                            </div>
                                        ) : availableLocations.length === 0 ? (
                                            <div style={{
                                                padding: '2rem',
                                                textAlign: 'center',
                                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                                borderRadius: '0.5rem',
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                backdropFilter: 'blur(10px)'
                                            }}>
                                                <MapPin size={32} style={{ margin: '0 auto 0.5rem', color: 'rgba(255, 255, 255, 0.5)' }} />
                                                <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 0.25rem 0' }}>No more locations available</p>
                                                <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>You've already added all available locations</p>
                                            </div>
                                        ) : (
                                            <div style={{
                                                maxHeight: '16rem',
                                                overflowY: 'auto',
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                                borderRadius: '0.5rem',
                                                backdropFilter: 'blur(10px)'
                                            }}>
                                                {availableLocations.map((location, index) => (
                                                    <div
                                                        key={location._id || index}
                                                        style={{
                                                            padding: '0.75rem',
                                                            borderBottom: index < availableLocations.length - 1 ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            background: selectedLocation?._id === location._id ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
                                                            borderLeft: selectedLocation?._id === location._id ? '4px solid rgba(59, 130, 246, 0.8)' : '4px solid transparent'
                                                        }}
                                                        onClick={() => handleLocationSelect(location)}
                                                        onMouseEnter={(e) => {
                                                            if (selectedLocation?._id !== location._id) {
                                                                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (selectedLocation?._id !== location._id) {
                                                                e.target.style.background = 'transparent';
                                                            }
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <MapPin size={16} style={{
                                                                marginRight: '0.75rem',
                                                                flexShrink: 0,
                                                                color: selectedLocation?._id === location._id ? 'rgba(59, 130, 246, 0.8)' : 'rgba(255, 255, 255, 0.5)'
                                                            }} />
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{
                                                                    fontWeight: '500',
                                                                    color: selectedLocation?._id === location._id ? '#fff' : 'rgba(255, 255, 255, 0.9)'
                                                                }}>
                                                                    {location.city}
                                                                </div>
                                                                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>{location.country}</div>
                                                                <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                                                                    {location.coordinates.latitude.toFixed(4)}, {location.coordinates.longitude.toFixed(4)}
                                                                </div>
                                                            </div>
                                                            {selectedLocation?._id === location._id && (
                                                                <CheckCircle size={16} style={{ flexShrink: 0, color: 'rgba(59, 130, 246, 0.8)' }} />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Nickname Input - Only show when location is selected */}
                                    {selectedLocation && (
                                        <div>
                                            <label style={labelStyle}>
                                                Nickname (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={nickname}
                                                onChange={(e) => setNickname(e.target.value)}
                                                style={inputStyle}
                                                placeholder="e.g. Home, Work, Vacation"
                                                maxLength={50}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = 'rgba(59, 130, 246, 0.8)';
                                                    e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.2)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                            <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', margin: '0.25rem 0 0 0' }}>
                                                Give this location a custom name for easy identification
                                            </p>
                                        </div>
                                    )}

                                    <div style={{
                                        padding: '0.75rem',
                                        borderLeft: '4px solid rgba(59, 130, 246, 0.8)',
                                        borderRadius: '0.25rem',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        backdropFilter: 'blur(10px)'
                                    }}>
                                        <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                                            <strong>How it works:</strong> Select from our available global locations and
                                            optionally give it a nickname for easy identification.
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', gap: '0.75rem' }}>
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            style={secondaryButtonStyle}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = 'scale(1.02)';
                                                e.target.style.background = 'rgba(75, 85, 99, 0.9)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = 'scale(1)';
                                                e.target.style.background = 'rgba(107, 114, 128, 0.8)';
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={addingLocation || !selectedLocation}
                                            style={{
                                                ...primaryButtonStyle,
                                                opacity: (addingLocation || !selectedLocation) ? 0.5 : 1,
                                                cursor: (addingLocation || !selectedLocation) ? 'not-allowed' : 'pointer'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!addingLocation && selectedLocation) {
                                                    e.target.style.transform = 'scale(1.02)';
                                                    e.target.style.background = 'rgba(37, 99, 235, 0.9)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!addingLocation && selectedLocation) {
                                                    e.target.style.transform = 'scale(1)';
                                                    e.target.style.background = 'rgba(59, 130, 246, 0.8)';
                                                }
                                            }}
                                        >
                                            {addingLocation ? (
                                                <>
                                                    <div style={{
                                                        width: '1rem',
                                                        height: '1rem',
                                                        border: '2px solid rgba(255, 255, 255, 0.3)',
                                                        borderTop: '2px solid white',
                                                        borderRadius: '50%',
                                                        animation: 'spin 1s linear infinite'
                                                    }} />
                                                    Adding...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus size={16} />
                                                    Add Location
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
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
            `}</style>
        </div>
    );
};

export default LocationManager;