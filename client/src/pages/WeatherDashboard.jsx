import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const WeatherDashboard = () => {
    const [locations, setLocations] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unit, setUnit] = useState('celsius');
    const [refreshing, setRefreshing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchWeatherData();
        fetchAlerts();
    }, [unit]);

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
        <section className="dashboard-section">
            <div className="home">
                {/* Header Controls */}
                <div className="header-controls">
                    <div className="unit-toggle">
                        <button 
                            className={unit === 'celsius' ? 'active' : ''}
                            onClick={handleUnitToggle}
                        >
                            °C
                        </button>
                        <button 
                            className={unit === 'fahrenheit' ? 'active' : ''}
                            onClick={handleUnitToggle}
                        >
                            °F
                        </button>
                    </div>
                    <button 
                        className="refresh-btn"
                        onClick={handleRefresh}
                        disabled={refreshing}
                    >
                        <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
                        Refresh
                    </button>
                    <button 
                        className="manage-btn"
                        onClick={() => navigate('/locations')}
                    >
                        <Settings2 size={16} />
                        Manage
                    </button>
                </div>

                {/* Weather Alerts */}
                {alerts.length > 0 && (
                    <div className="alerts-section">
                        <div className="alerts-header">
                            <AlertTriangle size={24} />
                            <h2>Weather Alerts</h2>
                        </div>
                        <div className="alerts-list">
                            {alerts.map((alert) => {
                                const alertStyle = getAlertColor(alert.severity);
                                return (
                                    <div
                                        key={alert._id}
                                        className="alert-item"
                                        style={{
                                            borderLeft: `4px solid ${alertStyle.borderColor}`,
                                            background: alertStyle.background,
                                            color: alertStyle.color
                                        }}
                                    >
                                        <div className="alert-content">
                                            <p className="alert-message">{alert.message}</p>
                                            <p className="alert-details">
                                                {alert.locationId?.city}, {alert.locationId?.country} • {alert.severity.toUpperCase()}
                                            </p>
                                        </div>
                                        <span className="alert-time">
                                            {new Date(alert.createdAt).toLocaleTimeString()}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="feed-1">
                    {/* Main Weather Card */}
                    <div className="feeds">
                        {defaultLocation?.currentWeather ? (
                            <>
                                {getWeatherIcon(defaultLocation.currentWeather.description, 80)}
                                <div className="main-weather-info">
                                    <div className="location-info">
                                        <span className="city">{defaultLocation.location.city}, {defaultLocation.location.country}</span>
                                        <span className="condition">{defaultLocation.currentWeather.description}</span>
                                        {defaultLocation.nickname && (
                                            <span className="nickname">"{defaultLocation.nickname}"</span>
                                        )}
                                    </div>
                                    <div className="temperature">
                                        <span>
                                            {convertTemperature(
                                                defaultLocation.currentWeather.temperature,
                                                defaultLocation.currentWeather.temperatureType
                                            )}
                                            <sup>°{unit.charAt(0).toUpperCase()}</sup>
                                        </span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Cloud size={80} />
                                <div className="main-weather-info">
                                    <div className="location-info">
                                        <span className="city">No Data Available</span>
                                        <span className="condition">Please wait...</span>
                                    </div>
                                    <div className="temperature">
                                        <span>--<sup>°</sup></span>
                                    </div>
                                </div>
                            </>
                        )}
                        {defaultLocation?.isDefault && (
                            <div className="default-badge">
                                <Star size={16} />
                            </div>
                        )}
                    </div>

                    {/* Mini Forecast Cards */}
                    <div className="feed">
                        {otherLocations.slice(0, 2).map((location) => (
                            <div key={location.userLocationId} className="mini-weather-card">
                                <div className="mini-weather-main">
                                    {location.currentWeather ? (
                                        <>
                                            {getWeatherIcon(location.currentWeather.description, 40)}
                                            <span className="mini-temp">
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
                                            <span className="mini-temp">--<sup>°</sup></span>
                                        </>
                                    )}
                                </div>
                                <div className="mini-weather-info">
                                    <span className="mini-city">{location.location.city}</span>
                                    <span className="mini-condition">
                                        {location.currentWeather?.description || 'No data'}
                                    </span>
                                </div>
                                {!location.isDefault && (
                                    <button
                                        className="set-default-btn"
                                        onClick={() => handleSetDefault(location.userLocationId)}
                                        title="Set as default"
                                    >
                                        <Star size={12} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Today's Highlights */}
                <div className="highlights">
                    <h2>Today's Highlights</h2>
                    <div className="all-highlights">
                        {defaultLocation?.currentWeather && (
                            <>
                                <div className="highlight-card">
                                    <div className="highlight-info">
                                        <Thermometer size={24} />
                                        <div>
                                            <span>Feels Like</span>
                                            <span>Normal</span>
                                        </div>
                                    </div>
                                    <div className="highlight-value">
                                        <span>
                                            {defaultLocation.currentWeather.feelsLike ? 
                                                convertTemperature(
                                                    defaultLocation.currentWeather.feelsLike,
                                                    defaultLocation.currentWeather.temperatureType
                                                ) : '--'
                                            }
                                            <sup>°{unit.charAt(0).toUpperCase()}</sup>
                                        </span>
                                    </div>
                                </div>

                                <div className="highlight-card">
                                    <div className="highlight-info">
                                        <Wind size={24} />
                                        <div>
                                            <span>Wind Speed</span>
                                            <span>Normal</span>
                                        </div>
                                    </div>
                                    <div className="highlight-value">
                                        <span>
                                            {defaultLocation.currentWeather.windSpeed}
                                            <sup>{defaultLocation.currentWeather.windSpeedType}</sup>
                                        </span>
                                    </div>
                                </div>

                                <div className="highlight-card">
                                    <div className="highlight-info">
                                        <Droplets size={24} />
                                        <div>
                                            <span>Humidity</span>
                                            <span>Normal</span>
                                        </div>
                                    </div>
                                    <div className="highlight-value">
                                        <span>
                                            {defaultLocation.currentWeather.humidity}
                                            <sup>%</sup>
                                        </span>
                                    </div>
                                </div>

                                {defaultLocation.currentWeather.visibility && (
                                    <div className="highlight-card">
                                        <div className="highlight-info">
                                            <Eye size={24} />
                                            <div>
                                                <span>Visibility</span>
                                                <span>Clear</span>
                                            </div>
                                        </div>
                                        <div className="highlight-value">
                                            <span>
                                                {defaultLocation.currentWeather.visibility}
                                                <sup>km</sup>
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {defaultLocation.currentWeather.pressure && (
                                    <div className="highlight-card">
                                        <div className="highlight-info">
                                            <Gauge size={24} />
                                            <div>
                                                <span>Pressure</span>
                                                <span>Normal</span>
                                            </div>
                                        </div>
                                        <div className="highlight-value">
                                            <span>
                                                {defaultLocation.currentWeather.pressure}
                                                <sup>mb</sup>
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="highlight-card">
                                    <div className="highlight-info">
                                        <Cloud size={24} />
                                        <div>
                                            <span>Condition</span>
                                            <span>Current</span>
                                        </div>
                                    </div>
                                    <div className="highlight-value condition-value">
                                        <span>{defaultLocation.currentWeather.description}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Other Cities */}
            <div className="cities">
                <h2>Other Cities</h2>
                <div className="all-cities">
                    {otherLocations.map((location) => (
                        <div key={location.userLocationId} className="city-card">
                            <div className="city-info">
                                {location.currentWeather ? (
                                    <>
                                        {getWeatherIcon(location.currentWeather.description, 48)}
                                        <div className="city-details">
                                            <span className="city-name">{location.location.city}</span>
                                            <span className="city-condition">
                                                {location.currentWeather.description}. 
                                                Humidity: {location.currentWeather.humidity}%
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Cloud size={48} />
                                        <div className="city-details">
                                            <span className="city-name">{location.location.city}</span>
                                            <span className="city-condition">No data available</span>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="city-temp">
                                <span>
                                    {location.currentWeather ? 
                                        convertTemperature(
                                            location.currentWeather.temperature,
                                            location.currentWeather.temperatureType
                                        ) : '--'
                                    }
                                    <sup>°{unit.charAt(0).toUpperCase()}</sup>
                                </span>
                            </div>
                            {!location.isDefault && (
                                <button
                                    className="city-default-btn"
                                    onClick={() => handleSetDefault(location.userLocationId)}
                                    title="Set as default"
                                >
                                    <Star size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button className="see-more-btn" onClick={() => navigate('/locations')}>
                        <span>See More</span>
                        <ArrowRight size={16} />
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
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 2rem;
                }

                .header-controls {
                    position: fixed;
                    top: 2rem;
                    right: 2rem;
                    display: flex;
                    gap: 1rem;
                    z-index: 100;
                }

                .unit-toggle {
                    display: flex;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 12px;
                    padding: 4px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    backdrop-filter: blur(10px);
                }

                .unit-toggle button {
                    padding: 8px 16px;
                    border: none;
                    background: transparent;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: #6b7280;
                }

                .unit-toggle button.active {
                    background: #3b82f6;
                    color: white;
                    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
                }

                .refresh-btn, .manage-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 8px 16px;
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: #374151;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    backdrop-filter: blur(10px);
                }

                .refresh-btn:hover, .manage-btn:hover {
                    background: rgba(255, 255, 255, 1);
                    transform: translateY(-1px);
                }

                .refresh-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .spinning {
                    animation: spin 1s linear infinite;
                }

                .alerts-section {
                    grid-column: 1 / -1;
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 24px;
                    padding: 2rem;
                    margin-bottom: 1rem;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }

                .alerts-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                }

                .alerts-header svg {
                    color: #eab308;
                }

                .alerts-header h2 {
                    font-size: 1.25rem;
                    font-weight: bold;
                    color: #1f2937;
                    margin: 0;
                }

                .alerts-list {
                    max-height: 200px;
                    overflow-y: auto;
                }

                .alert-item {
                    border-radius: 12px;
                    padding: 1rem;
                    margin-bottom: 0.75rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: start;
                }

                .alert-content {
                    flex: 1;
                }

                .alert-message {
                    font-weight: 600;
                    margin: 0 0 0.25rem 0;
                }

                .alert-details {
                    font-size: 0.875rem;
                    opacity: 0.75;
                    margin: 0;
                }

                .alert-time {
                    font-size: 0.75rem;
                    opacity: 0.6;
                    white-space: nowrap;
                }

                .feed-1 {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .feeds {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 32px;
                    padding: 3rem;
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    position: relative;
                }

                .main-weather-info {
                    display: flex;
                    flex: 1;
                    justify-content: space-between;
                    align-items: center;
                }

                .location-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .city {
                    font-size: 1.75rem;
                    font-weight: bold;
                    color: #1f2937;
                }

                .condition {
                    font-size: 1rem;
                    color: #6b7280;
                    text-transform: capitalize;
                }

                .nickname {
                    font-size: 0.875rem;
                    color: #3b82f6;
                    font-weight: 500;
                }

                .temperature {
                    text-align: right;
                }

                .temperature span {
                    font-size: 4rem;
                    font-weight: 300;
                    color: #1f2937;
                    line-height: 1;
                }

                .temperature sup {
                    font-size: 1.5rem;
                    font-weight: 400;
                }

                .default-badge {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: #fbbf24;
                    border-radius: 50%;
                    padding: 0.5rem;
                    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
                }

                .default-badge svg {
                    color: white;
                    fill: white;
                }

                .feed {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .mini-weather-card {
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    position: relative;
                    transition: all 0.3s ease;
                }

                .mini-weather-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                }

                .mini-weather-main {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .mini-temp {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #1f2937;
                }

                .mini-weather-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .mini-city {
                    font-weight: 600;
                    color: #1f2937;
                }

                .mini-condition {
                    font-size: 0.875rem;
                    color: #6b7280;
                    text-transform: capitalize;
                }

                .set-default-btn {
                    position: absolute;
                    top: 0.75rem;
                    right: 0.75rem;
                    background: transparent;
                    border: none;
                    padding: 0.25rem;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .set-default-btn:hover {
                    background: #f3f4f6;
                }

                .set-default-btn svg {
                    color: #9ca3af;
                }

                .highlights {
                    margin-top: 2rem;
                }

                .highlights h2 {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #1f2937;
                    margin-bottom: 1.5rem;
                }

                .all-highlights {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1rem;
                }

                .highlight-card {
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 20px;
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    transition: all 0.3s ease;
                }

                .highlight-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                }

                .highlight-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .highlight-info svg {
                    color: #3b82f6;
                }

                .highlight-info div {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .highlight-info span:first-child {
                    font-weight: 600;
                    color: #1f2937;
                }

                .highlight-info span:last-child {
                    font-size: 0.875rem;
                    color: #6b7280;
                }

                .highlight-value {
                    text-align: right;
                }

                .highlight-value span {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #1f2937;
                }

                .highlight-value sup {
                    font-size: 0.875rem;
                    font-weight: 500;
                }

                .condition-value span {
                    font-size: 1rem;
                    text-transform: capitalize;
                }

                .cities {
                    padding-top: 4rem;
                }

                .cities h2 {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #1f2937;
                    margin-bottom: 1.5rem;
                }

                .all-cities {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .city-card {
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 20px;
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    position: relative;
                    transition: all 0.3s ease;
                }

                .city-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                }

                .city-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex: 1;
                }

                .city-details {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .city-name {
                    font-weight: 600;
                    color: #1f2937;
                    font-size: 1.125rem;
                }

                .city-condition {
                    font-size: 0.875rem;
                    color: #6b7280;
                    text-transform: capitalize;
                }

                .city-temp {
                    text-align: right;
                    margin-right: 1rem;
                }

                .city-temp span {
                    font-size: 1.75rem;
                    font-weight: bold;
                    color: #1f2937;
                }

                .city-temp sup {
                    font-size: 1rem;
                    font-weight: 500;
                }

                .city-default-btn {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: transparent;
                    border: none;
                    padding: 0.5rem;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .city-default-btn:hover {
                    background: #f3f4f6;
                }

                .city-default-btn svg {
                    color: #9ca3af;
                }

                .see-more-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    background: linear-gradient(135deg, #3b82f6, #1e40af);
                    color: white;
                    border: none;
                    border-radius: 20px;
                    padding: 1.5rem;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 15px 30px rgba(59, 130, 246, 0.3);
                    backdrop-filter: blur(10px);
                    margin-top: 0.5rem;
                }

                .see-more-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.4);
                }

                @media (max-width: 1024px) {
                    .home {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }
                    
                    .header-controls {
                        position: static;
                        justify-self: end;
                        margin-bottom: 2rem;
                    }
                }

                @media (max-width: 768px) {
                    .dashboard-section {
                        padding: 1rem;
                    }
                    
                    .feeds {
                        padding: 2rem;
                        flex-direction: column;
                        text-align: center;
                        gap: 1.5rem;
                    }
                    
                    .main-weather-info {
                        flex-direction: column;
                        gap: 1rem;
                    }
                    
                    .temperature span {
                        font-size: 3rem;
                    }
                    
                    .feed {
                        grid-template-columns: 1fr;
                    }
                    
                    .all-highlights {
                        grid-template-columns: 1fr;
                    }
                    
                    .header-controls {
                        flex-wrap: wrap;
                        gap: 0.5rem;
                    }
                    
                    .city-card {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 1rem;
                    }
                    
                    .city-temp {
                        text-align: center;
                        margin-right: 0;
                    }
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </section>
    );
};

export default WeatherDashboard;