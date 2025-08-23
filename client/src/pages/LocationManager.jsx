import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { weatherAPI } from '../services/api';
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

    const locationCardStyle = {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        padding: '1.5rem',
        transition: 'all 0.3s ease'
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
        background: 'white',
        borderRadius: '1rem',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <div className="flex items-center justify-center max-w-6xl mx-auto">
                    <div style={cardStyle}>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 border-4 border-green-200 rounded-full border-t-green-600 animate-spin"></div>
                            <span className="text-gray-700">Loading locations...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div style={cardStyle} className="mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/weather')}
                                className="p-2 mr-4 transition-colors rounded-full hover:bg-gray-100"
                            >
                                <ArrowLeft size={20} className="text-gray-600" />
                            </button>
                            <div>
                                <h1 className="mb-2 text-3xl font-bold text-green-800">Manage Locations</h1>
                                <p className="text-gray-600">Select from available weather locations to track</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center px-6 py-3 font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                        >
                            <Plus size={20} className="mr-2" />
                            Add Location
                        </button>
                    </div>
                </div>

                {/* Locations Grid */}
                {locations.length === 0 ? (
                    <div style={cardStyle} className="text-center">
                        <MapPin size={64} className="mx-auto mb-4 text-gray-400" />
                        <h2 className="mb-2 text-2xl font-bold text-gray-800">No Locations Added</h2>
                        <p className="mb-6 text-gray-600">
                            Select your first location to start tracking weather data.
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center px-6 py-3 font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                        >
                            <Plus size={20} className="mr-2" />
                            Select Location
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
                                }}
                            >
                                {/* Location Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center flex-1">
                                        <MapPin size={20} className="flex-shrink-0 mr-3 text-green-600" />
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">
                                                {userLocation.location.city}
                                            </h3>
                                            <p className="text-gray-600">{userLocation.location.country}</p>
                                            {userLocation.nickname && (
                                                <p className="text-sm font-medium text-green-600">"{userLocation.nickname}"</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        {userLocation.isDefault ? (
                                            <div className="flex items-center px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                                                <Star size={12} className="mr-1 fill-current" />
                                                Default
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleSetDefault(userLocation.userLocationId, userLocation.location.city)}
                                                className="p-2 transition-colors rounded-full hover:bg-gray-100"
                                                title="Set as default"
                                            >
                                                <Star size={16} className="text-gray-400" />
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleRemoveLocation(userLocation.userLocationId, userLocation.location.city)}
                                            disabled={locations.length <= 1}
                                            className="p-2 transition-colors rounded-full hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={locations.length <= 1 ? "Cannot remove - you need at least one location" : "Remove location"}
                                        >
                                            <Trash2 size={16} className="text-red-500" />
                                        </button>
                                    </div>
                                </div>

                                {/* Coordinates */}
                                <div className="p-3 mb-4 rounded-lg bg-gray-50">
                                    <div className="mb-1 text-xs text-gray-600">Coordinates</div>
                                    <div className="font-mono text-sm text-gray-800">
                                        {userLocation.location.coordinates.latitude.toFixed(4)}, {userLocation.location.coordinates.longitude.toFixed(4)}
                                    </div>
                                </div>

                                {/* Weather Status */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {userLocation.currentWeather ? (
                                            <>
                                                <CheckCircle size={16} className="mr-2 text-green-500" />
                                                <span className="text-sm text-green-600">Weather data available</span>
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle size={16} className="mr-2 text-yellow-500" />
                                                <span className="text-sm text-yellow-600">No weather data</span>
                                            </>
                                        )}
                                    </div>

                                    <div className="text-xs text-gray-500">
                                        Added {new Date(userLocation.addedAt).toLocaleDateString()}
                                    </div>
                                </div>

                                {/* Quick Weather Info */}
                                {userLocation.currentWeather && (
                                    <div className="pt-4 mt-4 border-t border-gray-200">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">{userLocation.currentWeather.description}</span>
                                            <span className="font-medium text-gray-800">
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
                            <div className="p-6">
                                {/* Modal Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Add New Location</h2>
                                    <button
                                        onClick={handleCloseModal}
                                        className="p-2 transition-colors rounded-full hover:bg-gray-100"
                                    >
                                        <X size={20} className="text-gray-500" />
                                    </button>
                                </div>

                                {/* Search and Add Form */}
                                <form onSubmit={handleAddLocation} className="space-y-4">
                                    {/* Location Selection */}
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Select Location *
                                        </label>

                                        {loadingAvailable ? (
                                            <div className="flex items-center justify-center p-8 border border-gray-200 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <Loader size={20} className="text-green-500 animate-spin" />
                                                    <span className="text-gray-600">Loading available locations...</span>
                                                </div>
                                            </div>
                                        ) : availableLocations.length === 0 ? (
                                            <div className="p-8 text-center border border-gray-200 rounded-lg bg-gray-50">
                                                <MapPin size={32} className="mx-auto mb-2 text-gray-400" />
                                                <p className="text-gray-600">No more locations available</p>
                                                <p className="text-sm text-gray-500">You've already added all available locations</p>
                                            </div>
                                        ) : (
                                            <div className="overflow-y-auto bg-white border border-gray-200 rounded-lg max-h-64">
                                                {availableLocations.map((location, index) => (
                                                    <div
                                                        key={location._id || index}
                                                        className={`p-3 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors ${selectedLocation?._id === location._id
                                                                ? 'bg-green-50 border-l-4 border-l-green-500'
                                                                : 'hover:bg-gray-50'
                                                            }`}
                                                        onClick={() => handleLocationSelect(location)}
                                                    >
                                                        <div className="flex items-center">
                                                            <MapPin size={16} className={`mr-3 flex-shrink-0 ${selectedLocation?._id === location._id ? 'text-green-600' : 'text-gray-400'
                                                                }`} />
                                                            <div className="flex-1">
                                                                <div className={`font-medium ${selectedLocation?._id === location._id ? 'text-green-800' : 'text-gray-800'
                                                                    }`}>
                                                                    {location.city}
                                                                </div>
                                                                <div className="text-sm text-gray-600">{location.country}</div>
                                                                <div className="font-mono text-xs text-gray-500">
                                                                    {location.coordinates.latitude.toFixed(4)}, {location.coordinates.longitude.toFixed(4)}
                                                                </div>
                                                            </div>
                                                            {selectedLocation?._id === location._id && (
                                                                <CheckCircle size={16} className="flex-shrink-0 text-green-600" />
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
                                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                                Nickname (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={nickname}
                                                onChange={(e) => setNickname(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                placeholder="e.g. Home, Work, Vacation"
                                                maxLength={50}
                                            />
                                            <p className="mt-1 text-xs text-gray-500">Give this location a custom name for easy identification</p>
                                        </div>
                                    )}

                                    <div className="p-3 border-l-4 border-blue-400 rounded bg-blue-50">
                                        <div className="text-sm text-blue-800">
                                            <strong>How it works:</strong> Select from our available global locations and
                                            optionally give it a nickname for easy identification.
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4 space-x-3">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={addingLocation || !selectedLocation}
                                            className="flex items-center px-6 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {addingLocation ? (
                                                <>
                                                    <div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                                                    Adding...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus size={16} className="mr-2" />
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
        </div>
    );
};

export default LocationManager;