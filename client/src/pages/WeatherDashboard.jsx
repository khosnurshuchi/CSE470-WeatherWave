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
    Plus
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
            await weatherAPI.setDefaultLocation(userLocationId); // CHANGED: now uses userLocationId
            toast.success('Default location updated');
            fetchWeatherData();
        } catch (error) {
            toast.error(error.message || 'Failed to set default location');
        }
    };

    const getWeatherIcon = (description, size = 24) => {
        const desc = description?.toLowerCase() || '';
        if (desc.includes('rain')) return <CloudRain size={size} className="text-blue-500" />;
        if (desc.includes('snow')) return <Snowflake size={size} className="text-blue-200" />;
        if (desc.includes('cloud')) return <Cloud size={size} className="text-gray-500" />;
        if (desc.includes('clear') || desc.includes('sunny')) return <Sun size={size} className="text-yellow-500" />;
        return <Cloud size={size} className="text-gray-500" />;
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
            case 'extreme': return 'bg-red-100 border-red-500 text-red-800';
            case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
            case 'moderate': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
            default: return 'bg-blue-100 border-blue-500 text-blue-800';
        }
    };

    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)',
        padding: '2rem 1rem'
    };

    const cardStyle = {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        padding: '2rem'
    };

    const weatherCardStyle = {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        padding: '1.5rem',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
    };

    const alertCardStyle = {
        borderRadius: '0.75rem',
        padding: '1rem',
        marginBottom: '0.75rem',
        borderLeft: '4px solid'
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <div className="flex items-center justify-center mx-auto max-w-7xl">
                    <div style={cardStyle}>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 border-4 border-green-200 rounded-full border-t-green-600 animate-spin"></div>
                            <span className="text-gray-700">Loading weather data...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // No locations - redirect to location manager
    if (!locations.length) {
        return (
            <div style={containerStyle}>
                <div className="max-w-4xl mx-auto">
                    <div style={cardStyle} className="text-center">
                        <MapPin size={64} className="mx-auto mb-4 text-gray-400" />
                        <h2 className="mb-2 text-2xl font-bold text-gray-800">No Locations Added</h2>
                        <p className="mb-6 text-gray-600">
                            You need to add at least one location to view weather data.
                        </p>
                        <button
                            onClick={() => navigate('/locations')}
                            className="inline-flex items-center px-6 py-3 font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                        >
                            <Plus size={20} className="mr-2" />
                            Add Your First Location
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div style={cardStyle} className="mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold text-green-800">Weather Dashboard</h1>
                            <p className="text-gray-600">Stay updated with weather conditions across your locations</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            {/* Temperature Unit Toggle */}
                            <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                                <button
                                    onClick={handleUnitToggle}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${unit === 'celsius'
                                        ? 'bg-green-600 text-white'
                                        : 'text-gray-600 hover:text-green-600'
                                        }`}
                                >
                                    °C
                                </button>
                                <button
                                    onClick={handleUnitToggle}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${unit === 'fahrenheit'
                                        ? 'bg-green-600 text-white'
                                        : 'text-gray-600 hover:text-green-600'
                                        }`}
                                >
                                    °F
                                </button>
                            </div>

                            {/* Refresh Button */}
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="flex items-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>

                            {/* Manage Locations Button */}
                            <button
                                onClick={() => navigate('/locations')}
                                className="flex items-center px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                            >
                                <Settings2 size={16} className="mr-2" />
                                Manage Locations
                            </button>
                        </div>
                    </div>
                </div>

                {/* Weather Alerts */}
                {alerts.length > 0 && (
                    <div style={cardStyle} className="mb-6">
                        <div className="flex items-center mb-4">
                            <AlertTriangle className="mr-2 text-yellow-600" size={24} />
                            <h2 className="text-xl font-bold text-gray-800">Weather Alerts</h2>
                        </div>
                        <div className="overflow-y-auto max-h-48">
                            {alerts.map((alert) => (
                                <div
                                    key={alert._id}
                                    className={`${alertCardStyle} ${getAlertColor(alert.severity)}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-medium">{alert.message}</p>
                                            <p className="text-sm opacity-75">
                                                {alert.locationId?.city}, {alert.locationId?.country} • {alert.severity.toUpperCase()}
                                            </p>
                                        </div>
                                        <span className="text-xs opacity-60">
                                            {new Date(alert.createdAt).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Weather Cards Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {locations.map((userLocation) => ( // CHANGED: userLocation instead of location
                        <div
                            key={userLocation.userLocationId} // CHANGED: use userLocationId as key
                            style={weatherCardStyle}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
                            }}
                        >
                            {/* Location Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <MapPin size={20} className="mr-2 text-green-600" />
                                    <div>
                                        <h3 className="font-bold text-gray-800">
                                            {userLocation.location.city} {/* CHANGED: access nested location data */}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {userLocation.location.country} {/* CHANGED: access nested location data */}
                                        </p>
                                        {/* ADD NICKNAME DISPLAY */}
                                        {userLocation.nickname && (
                                            <p className="text-xs font-medium text-green-600">"{userLocation.nickname}"</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {userLocation.isDefault && (
                                        <Star size={16} className="text-yellow-500 fill-current" />
                                    )}
                                    {!userLocation.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(userLocation.userLocationId)}
                                            className="p-1 transition-colors rounded-full hover:bg-gray-100"
                                            title="Set as default"
                                        >
                                            <Star size={16} className="text-gray-400" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {userLocation.currentWeather ? (
                                <>
                                    {/* Main Weather Info */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            {getWeatherIcon(userLocation.currentWeather.description, 32)}
                                            <div className="ml-3">
                                                <div className="text-3xl font-bold text-gray-800">
                                                    {convertTemperature(
                                                        userLocation.currentWeather.temperature,
                                                        userLocation.currentWeather.temperatureType
                                                    )}°{unit.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="text-sm text-gray-600 capitalize">
                                                    {userLocation.currentWeather.description}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600">Feels like</div>
                                            <div className="text-lg font-semibold text-gray-700">
                                                {userLocation.currentWeather.feelsLike &&
                                                    convertTemperature(
                                                        userLocation.currentWeather.feelsLike,
                                                        userLocation.currentWeather.temperatureType
                                                    )
                                                }°{unit.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Weather Details Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="flex items-center">
                                            <Wind size={16} className="mr-2 text-gray-500" />
                                            <div>
                                                <div className="text-xs text-gray-600">Wind</div>
                                                <div className="text-sm font-medium">
                                                    {userLocation.currentWeather.windSpeed} {userLocation.currentWeather.windSpeedType}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <Droplets size={16} className="mr-2 text-blue-500" />
                                            <div>
                                                <div className="text-xs text-gray-600">Humidity</div>
                                                <div className="text-sm font-medium">{userLocation.currentWeather.humidity}%</div>
                                            </div>
                                        </div>

                                        {userLocation.currentWeather.visibility && (
                                            <div className="flex items-center">
                                                <Eye size={16} className="mr-2 text-gray-500" />
                                                <div>
                                                    <div className="text-xs text-gray-600">Visibility</div>
                                                    <div className="text-sm font-medium">{userLocation.currentWeather.visibility} km</div>
                                                </div>
                                            </div>
                                        )}

                                        {userLocation.currentWeather.pressure && (
                                            <div className="flex items-center">
                                                <Gauge size={16} className="mr-2 text-gray-500" />
                                                <div>
                                                    <div className="text-xs text-gray-600">Pressure</div>
                                                    <div className="text-sm font-medium">{userLocation.currentWeather.pressure} mb</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Last Updated */}
                                    <div className="pt-3 text-xs text-center text-gray-500 border-t border-gray-200">
                                        Last updated: {new Date(userLocation.currentWeather.updatedAt).toLocaleString()}
                                    </div>
                                </>
                            ) : (
                                <div className="py-8 text-center">
                                    <Cloud size={32} className="mx-auto mb-2 text-gray-400" />
                                    <p className="text-gray-600">No weather data available</p>
                                    <p className="text-sm text-gray-500">Data will be updated soon</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Quick Stats */}
                <div style={cardStyle} className="mt-6">
                    <h3 className="mb-4 text-lg font-bold text-gray-800">Quick Stats</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="p-4 rounded-lg bg-green-50">
                            <div className="flex items-center">
                                <MapPin className="mr-3 text-green-600" size={24} />
                                <div>
                                    <div className="text-sm text-gray-600">Total Locations</div>
                                    <div className="text-2xl font-bold text-green-600">{locations.length}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-yellow-50">
                            <div className="flex items-center">
                                <AlertTriangle className="mr-3 text-yellow-600" size={24} />
                                <div>
                                    <div className="text-sm text-gray-600">Active Alerts</div>
                                    <div className="text-2xl font-bold text-yellow-600">{alerts.length}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-blue-50">
                            <div className="flex items-center">
                                <Thermometer className="mr-3 text-blue-600" size={24} />
                                <div>
                                    <div className="text-sm text-gray-600">Temperature Unit</div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        °{unit.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherDashboard;