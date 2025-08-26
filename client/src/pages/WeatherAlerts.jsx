import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { weatherAPI } from '../services/api';
import {
    AlertTriangle,
    Cloud,
    Eye,
    Check,
    X,
    RefreshCw,
    Calendar,
    MapPin,
    Thermometer,
    Wind,
    CloudRain,
    Snowflake,
    Sun,
    Zap,
    Shield,
    Mail,
    MailCheck,
    Clock,
    Filter,
    ChevronDown,
    ChevronUp,
    Home,
    ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

const WeatherAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedSeverity, setSelectedSeverity] = useState('all');
    const [selectedCondition, setSelectedCondition] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedAlert, setExpandedAlert] = useState(null);

    const navigate = useNavigate();
    const { theme, getThemeStyles } = useTheme();
    const themeStyles = getThemeStyles();

    useEffect(() => {
        fetchDefaultLocationAlerts();
    }, []);

    const fetchDefaultLocationAlerts = async () => {
        try {
            setLoading(true);
            const response = await weatherAPI.getDefaultLocationAlerts();
            setAlerts(response.data || []);
        } catch (error) {
            console.error('Error fetching alerts:', error);
            toast.error(error.message || 'Failed to fetch weather alerts');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchDefaultLocationAlerts();
        setRefreshing(false);
        toast.success('Weather alerts refreshed');
    };

    const handleMarkAsRead = async (alertId) => {
        try {
            await weatherAPI.markAlertAsRead(alertId);
            setAlerts(alerts.map(alert =>
                alert._id === alertId ? { ...alert, isRead: true } : alert
            ));
            toast.success('Alert marked as read');
        } catch (error) {
            toast.error('Failed to mark alert as read');
        }
    };

    const handleDismissAlert = async (alertId) => {
        try {
            await weatherAPI.dismissAlert(alertId);
            setAlerts(alerts.map(alert =>
                alert._id === alertId ? { ...alert, isActive: false } : alert
            ));
            toast.success('Alert dismissed');
        } catch (error) {
            toast.error('Failed to dismiss alert');
        }
    };

    const getAlertIcon = (condition, size = 24) => {
        const iconProps = { size, style: { flexShrink: 0 } };

        switch (condition) {
            case 'rain':
                return <CloudRain {...iconProps} style={{ color: '#3b82f6' }} />;
            case 'snow':
                return <Snowflake {...iconProps} style={{ color: '#e5e7eb' }} />;
            case 'extreme_heat':
                return <Sun {...iconProps} style={{ color: '#ef4444' }} />;
            case 'extreme_cold':
                return <Thermometer {...iconProps} style={{ color: '#06b6d4' }} />;
            case 'high_wind':
                return <Wind {...iconProps} style={{ color: '#10b981' }} />;
            case 'thunderstorm':
                return <Zap {...iconProps} style={{ color: '#8b5cf6' }} />;
            case 'fog':
                return <Eye {...iconProps} style={{ color: '#6b7280' }} />;
            case 'uv_warning':
                return <Sun {...iconProps} style={{ color: '#f59e0b' }} />;
            default:
                return <AlertTriangle {...iconProps} style={{ color: '#eab308' }} />;
        }
    };

    const getAlertColor = (severity) => {
        switch (severity) {
            case 'extreme':
                return {
                    background: theme === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
                    borderColor: '#ef4444',
                    textColor: theme === 'dark' ? '#fca5a5' : '#7f1d1d',
                    badgeColor: '#ef4444'
                };
            case 'high':
                return {
                    background: theme === 'dark' ? 'rgba(249, 115, 22, 0.15)' : 'rgba(249, 115, 22, 0.1)',
                    borderColor: '#f97316',
                    textColor: theme === 'dark' ? '#fdba74' : '#9a3412',
                    badgeColor: '#f97316'
                };
            case 'moderate':
                return {
                    background: theme === 'dark' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(234, 179, 8, 0.1)',
                    borderColor: '#eab308',
                    textColor: theme === 'dark' ? '#fde047' : '#713f12',
                    badgeColor: '#eab308'
                };
            default:
                return {
                    background: theme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
                    borderColor: '#3b82f6',
                    textColor: theme === 'dark' ? '#93c5fd' : '#1e3a8a',
                    badgeColor: '#3b82f6'
                };
        }
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            time: date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })
        };
    };

    const filteredAlerts = alerts.filter(alert => {
        const severityMatch = selectedSeverity === 'all' || alert.severity === selectedSeverity;
        const conditionMatch = selectedCondition === 'all' || alert.alertCondition === selectedCondition;
        return severityMatch && conditionMatch;
    });

    const severityOptions = [
        { value: 'all', label: 'All Severities' },
        { value: 'low', label: 'Low' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'high', label: 'High' },
        { value: 'extreme', label: 'Extreme' }
    ];

    const conditionOptions = [
        { value: 'all', label: 'All Conditions' },
        { value: 'rain', label: 'Rain' },
        { value: 'snow', label: 'Snow' },
        { value: 'extreme_heat', label: 'Extreme Heat' },
        { value: 'extreme_cold', label: 'Extreme Cold' },
        { value: 'high_wind', label: 'High Wind' },
        { value: 'thunderstorm', label: 'Thunderstorm' },
        { value: 'fog', label: 'Fog' },
        { value: 'uv_warning', label: 'UV Warning' }
    ];

    if (loading) {
        return (
            <section style={{
                minHeight: '100vh',
                background: themeStyles.background,
                padding: '2rem',
                fontFamily: '-apple-system, BlinkMacSystemFont, \'Segoe UI\', \'Roboto\', sans-serif',
                transition: 'all 0.3s ease'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    minHeight: '60vh'
                }}>
                    <div style={{
                        background: themeStyles.cardBackground,
                        borderRadius: '24px',
                        padding: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        boxShadow: `0 20px 40px ${themeStyles.shadow}`,
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${themeStyles.border}`
                    }}>
                        <div style={{
                            width: '2rem',
                            height: '2rem',
                            border: `3px solid ${themeStyles.border}`,
                            borderTop: `3px solid #3b82f6`,
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <span style={{ color: themeStyles.textPrimary }}>Loading weather alerts...</span>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section style={{
            minHeight: '100vh',
            background: themeStyles.background,
            padding: 'clamp(1rem, 3vw, 2rem)',
            fontFamily: '-apple-system, BlinkMacSystemFont, \'Segoe UI\', \'Roboto\', sans-serif',
            transition: 'all 0.3s ease'
        }}>
            <div className="container-responsive" style={{ maxWidth: '90rem', margin: '0 auto' }}>
                {/* Header Section */}
                <div style={{
                    background: themeStyles.cardBackground,
                    borderRadius: '24px',
                    padding: 'clamp(1.5rem, 4vw, 2rem)',
                    marginBottom: '2rem',
                    boxShadow: `0 20px 40px ${themeStyles.shadow}`,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${themeStyles.border}`
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <button
                                onClick={() => navigate('/weather')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem',
                                    background: 'transparent',
                                    border: `1px solid ${themeStyles.border}`,
                                    borderRadius: '12px',
                                    color: themeStyles.textSecondary,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = themeStyles.background;
                                    e.target.style.color = themeStyles.textPrimary;
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = themeStyles.textSecondary;
                                }}
                            >
                                <ArrowLeft size={20} />
                                <span className="mobile-hidden">Back</span>
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '3rem',
                                    height: '3rem',
                                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)'
                                }}>
                                    <AlertTriangle size={20} color="white" />
                                </div>
                                <div>
                                    <h1 style={{
                                        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                                        fontWeight: 'bold',
                                        color: themeStyles.textPrimary,
                                        margin: 0
                                    }}>
                                        Weather Alerts
                                    </h1>
                                    <p style={{
                                        fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                        color: themeStyles.textSecondary,
                                        margin: '0.25rem 0 0 0'
                                    }}>
                                        Alerts for your default location
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            flexWrap: 'wrap'
                        }}>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1rem',
                                    background: showFilters ? 'linear-gradient(135deg, #3b82f6, #1e40af)' : 'transparent',
                                    border: `1px solid ${themeStyles.border}`,
                                    borderRadius: '12px',
                                    color: showFilters ? 'white' : themeStyles.textSecondary,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                                }}
                            >
                                <Filter size={16} />
                                <span className="mobile-hidden">Filters</span>
                                {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1rem',
                                    background: 'transparent',
                                    border: `1px solid ${themeStyles.border}`,
                                    borderRadius: '12px',
                                    color: themeStyles.textSecondary,
                                    cursor: refreshing ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                                }}
                                onMouseEnter={(e) => {
                                    if (!refreshing) {
                                        e.target.style.background = themeStyles.background;
                                        e.target.style.color = themeStyles.textPrimary;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!refreshing) {
                                        e.target.style.background = 'transparent';
                                        e.target.style.color = themeStyles.textSecondary;
                                    }
                                }}
                            >
                                <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
                                <span className="mobile-hidden">Refresh</span>
                            </button>
                        </div>
                    </div>

                    {/* Filters Section */}
                    {showFilters && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1rem',
                            padding: '1rem',
                            background: themeStyles.background,
                            borderRadius: '16px',
                            border: `1px solid ${themeStyles.border}`
                        }}>
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: themeStyles.textSecondary,
                                    marginBottom: '0.5rem'
                                }}>
                                    Severity
                                </label>
                                <select
                                    value={selectedSeverity}
                                    onChange={(e) => setSelectedSeverity(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: themeStyles.cardBackground,
                                        border: `1px solid ${themeStyles.border}`,
                                        borderRadius: '8px',
                                        color: themeStyles.textPrimary,
                                        fontSize: '0.875rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {severityOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: themeStyles.textSecondary,
                                    marginBottom: '0.5rem'
                                }}>
                                    Condition
                                </label>
                                <select
                                    value={selectedCondition}
                                    onChange={(e) => setSelectedCondition(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: themeStyles.cardBackground,
                                        border: `1px solid ${themeStyles.border}`,
                                        borderRadius: '8px',
                                        color: themeStyles.textPrimary,
                                        fontSize: '0.875rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {conditionOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Stats Summary */}
                    {alerts.length > 0 && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                            gap: '1rem',
                            marginTop: '1.5rem'
                        }}>
                            <div style={{
                                padding: '1rem',
                                background: themeStyles.background,
                                borderRadius: '12px',
                                textAlign: 'center',
                                border: `1px solid ${themeStyles.border}`
                            }}>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: themeStyles.textPrimary
                                }}>
                                    {alerts.length}
                                </div>
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: themeStyles.textSecondary,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Total Alerts
                                </div>
                            </div>

                            <div style={{
                                padding: '1rem',
                                background: themeStyles.background,
                                borderRadius: '12px',
                                textAlign: 'center',
                                border: `1px solid ${themeStyles.border}`
                            }}>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: '#ef4444'
                                }}>
                                    {alerts.filter(a => a.isActive).length}
                                </div>
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: themeStyles.textSecondary,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Active
                                </div>
                            </div>

                            <div style={{
                                padding: '1rem',
                                background: themeStyles.background,
                                borderRadius: '12px',
                                textAlign: 'center',
                                border: `1px solid ${themeStyles.border}`
                            }}>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: '#f97316'
                                }}>
                                    {alerts.filter(a => !a.isRead).length}
                                </div>
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: themeStyles.textSecondary,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Unread
                                </div>
                            </div>

                            <div style={{
                                padding: '1rem',
                                background: themeStyles.background,
                                borderRadius: '12px',
                                textAlign: 'center',
                                border: `1px solid ${themeStyles.border}`
                            }}>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: alerts.filter(a => a.emailSent).length > 0 ? '#10b981' : '#6b7280'
                                }}>
                                    {alerts.filter(a => a.emailSent).length}
                                </div>
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: themeStyles.textSecondary,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Email Sent
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Alerts List */}
                {filteredAlerts.length === 0 ? (
                    <div style={{
                        background: themeStyles.cardBackground,
                        borderRadius: '24px',
                        padding: '3rem',
                        textAlign: 'center',
                        boxShadow: `0 20px 40px ${themeStyles.shadow}`,
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${themeStyles.border}`
                    }}>
                        <Shield size={64} style={{ color: themeStyles.textSecondary, marginBottom: '1rem' }} />
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: themeStyles.textPrimary,
                            marginBottom: '0.5rem'
                        }}>
                            No Weather Alerts
                        </h2>
                        <p style={{
                            color: themeStyles.textSecondary,
                            marginBottom: '1.5rem'
                        }}>
                            {alerts.length === 0 ?
                                'No weather alerts found for your default location.' :
                                'No alerts match the selected filters.'
                            }
                        </p>
                        <button
                            onClick={() => navigate('/weather')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                                color: 'white',
                                padding: '0.75rem 1.5rem',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
                            }}
                        >
                            <Home size={16} />
                            Go to Dashboard
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        {filteredAlerts.map((alert, index) => {
                            const alertStyle = getAlertColor(alert.severity);
                            const dateTime = formatDateTime(alert.createdAt);
                            const isExpanded = expandedAlert === alert._id;

                            return (
                                <div
                                    key={alert._id}
                                    style={{
                                        background: themeStyles.cardBackground,
                                        borderRadius: '20px',
                                        padding: '1.5rem',
                                        boxShadow: `0 15px 30px ${themeStyles.shadow}`,
                                        backdropFilter: 'blur(20px)',
                                        border: `2px solid ${alertStyle.borderColor}`,
                                        borderLeft: `6px solid ${alertStyle.borderColor}`,
                                        position: 'relative',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {/* Alert Header */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '1rem',
                                        marginBottom: isExpanded ? '1rem' : '0'
                                    }}>
                                        {getAlertIcon(alert.alertCondition, 32)}

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            marginBottom: '0.5rem',
                                            flexWrap: 'wrap'
                                        }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                background: alertStyle.badgeColor,
                                                color: 'white',
                                                borderRadius: '12px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                {alert.severity}
                                            </span>

                                            {!alert.isRead && (
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    background: '#3b82f6',
                                                    color: 'white',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600'
                                                }}>
                                                    NEW
                                                </span>
                                            )}

                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                                fontSize: '0.75rem',
                                                color: themeStyles.textSecondary
                                            }}>
                                                {alert.emailSent ? (
                                                    <>
                                                        <MailCheck size={14} style={{ color: '#10b981' }} />
                                                        <span style={{ color: '#10b981' }}>Email Sent</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Mail size={14} />
                                                        <span>Email Pending</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold',
                                            color: themeStyles.textPrimary,
                                            marginBottom: '0.5rem',
                                            lineHeight: '1.4'
                                        }}>
                                            {alert.message}
                                        </h3>

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            fontSize: '0.875rem',
                                            color: themeStyles.textSecondary,
                                            flexWrap: 'wrap'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem'
                                            }}>
                                                <Calendar size={14} />
                                                <span>{dateTime.date}</span>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem'
                                            }}>
                                                <Clock size={14} />
                                                <span>{dateTime.time}</span>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem'
                                            }}>
                                                <MapPin size={14} />
                                                <span>
                                                    {alert.locationId?.city}, {alert.locationId?.country}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            flexShrink: 0
                                        }}>
                                            <button
                                                onClick={() => setExpandedAlert(isExpanded ? null : alert._id)}
                                                style={{
                                                    padding: '0.5rem',
                                                    background: 'transparent',
                                                    border: `1px solid ${themeStyles.border}`,
                                                    borderRadius: '8px',
                                                    color: themeStyles.textSecondary,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                title={isExpanded ? 'Collapse' : 'Expand'}
                                            >
                                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>

                                            {!alert.isRead && (
                                                <button
                                                    onClick={() => handleMarkAsRead(alert._id)}
                                                    style={{
                                                        padding: '0.5rem',
                                                        background: 'transparent',
                                                        border: `1px solid ${themeStyles.border}`,
                                                        borderRadius: '8px',
                                                        color: themeStyles.textSecondary,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    title="Mark as read"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}

                                            {alert.isActive && (
                                                <button
                                                    onClick={() => handleDismissAlert(alert._id)}
                                                    style={{
                                                        padding: '0.5rem',
                                                        background: 'transparent',
                                                        border: `1px solid ${themeStyles.border}`,
                                                        borderRadius: '8px',
                                                        color: '#ef4444',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    title="Dismiss alert"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expanded Alert Details */}
                                    {isExpanded && (
                                        <div style={{
                                            padding: '1rem',
                                            background: alertStyle.background,
                                            borderRadius: '12px',
                                            border: `1px solid ${alertStyle.borderColor}40`
                                        }}>
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                                gap: '1rem'
                                            }}>
                                                <div>
                                                    <h4 style={{
                                                        fontSize: '0.875rem',
                                                        fontWeight: '600',
                                                        color: themeStyles.textSecondary,
                                                        marginBottom: '0.5rem',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}>
                                                        Alert Details
                                                    </h4>
                                                    <div style={{ fontSize: '0.875rem', color: themeStyles.textPrimary }}>
                                                        <p style={{ margin: '0.25rem 0' }}>
                                                            <strong>Condition:</strong> {alert.alertCondition.replace('_', ' ')}
                                                        </p>
                                                        <p style={{ margin: '0.25rem 0' }}>
                                                            <strong>Status:</strong> {alert.isActive ? 'Active' : 'Dismissed'}
                                                        </p>
                                                        <p style={{ margin: '0.25rem 0' }}>
                                                            <strong>Read Status:</strong> {alert.isRead ? 'Read' : 'Unread'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {alert.weatherDataId && (
                                                    <div>
                                                        <h4 style={{
                                                            fontSize: '0.875rem',
                                                            fontWeight: '600',
                                                            color: themeStyles.textSecondary,
                                                            marginBottom: '0.5rem',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.5px'
                                                        }}>
                                                            Weather Conditions
                                                        </h4>
                                                        <div style={{ fontSize: '0.875rem', color: themeStyles.textPrimary }}>
                                                            {alert.weatherDataId.temperature && (
                                                                <p style={{ margin: '0.25rem 0' }}>
                                                                    <strong>Temperature:</strong> {alert.weatherDataId.temperature}°{alert.weatherDataId.temperatureType?.charAt(0).toUpperCase()}
                                                                </p>
                                                            )}
                                                            {alert.weatherDataId.description && (
                                                                <p style={{ margin: '0.25rem 0' }}>
                                                                    <strong>Conditions:</strong> {alert.weatherDataId.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                <div>
                                                    <h4 style={{
                                                        fontSize: '0.875rem',
                                                        fontWeight: '600',
                                                        color: themeStyles.textSecondary,
                                                        marginBottom: '0.5rem',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}>
                                                        Email Notification
                                                    </h4>
                                                    <div style={{ fontSize: '0.875rem', color: themeStyles.textPrimary }}>
                                                        <p style={{ margin: '0.25rem 0' }}>
                                                            <strong>Status:</strong> {alert.emailSent ? 'Sent' : 'Pending'}
                                                        </p>
                                                        {alert.emailSentAt && (
                                                            <p style={{ margin: '0.25rem 0' }}>
                                                                <strong>Sent At:</strong> {formatDateTime(alert.emailSentAt).date} at {formatDateTime(alert.emailSentAt).time}
                                                            </p>
                                                        )}
                                                        <p style={{ margin: '0.25rem 0' }}>
                                                            <strong>Default Location:</strong> {alert.isForDefaultLocation ? 'Yes' : 'No'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 style={{
                                                        fontSize: '0.875rem',
                                                        fontWeight: '600',
                                                        color: themeStyles.textSecondary,
                                                        marginBottom: '0.5rem',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}>
                                                        Timeline
                                                    </h4>
                                                    <div style={{ fontSize: '0.875rem', color: themeStyles.textPrimary }}>
                                                        <p style={{ margin: '0.25rem 0' }}>
                                                            <strong>Started:</strong> {formatDateTime(alert.startTime).date} at {formatDateTime(alert.startTime).time}
                                                        </p>
                                                        {alert.endTime && (
                                                            <p style={{ margin: '0.25rem 0' }}>
                                                                <strong>Ended:</strong> {formatDateTime(alert.endTime).date} at {formatDateTime(alert.endTime).time}
                                                            </p>
                                                        )}
                                                        <p style={{ margin: '0.25rem 0' }}>
                                                            <strong>Created:</strong> {formatDateTime(alert.createdAt).date} at {formatDateTime(alert.createdAt).time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Alert Status Indicators */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.25rem',
                                        alignItems: 'flex-end'
                                    }}>
                                        {!alert.isActive && (
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                background: '#6b7280',
                                                color: 'white',
                                                borderRadius: '8px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600'
                                            }}>
                                                DISMISSED
                                            </span>
                                        )}
                                        {alert.isRead && (
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                background: '#10b981',
                                                color: 'white',
                                                borderRadius: '8px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600'
                                            }}>
                                                READ
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination or Load More could go here */}
                {filteredAlerts.length > 0 && filteredAlerts.length < alerts.length && (
                    <div style={{
                        textAlign: 'center',
                        marginTop: '2rem',
                        padding: '1rem',
                        color: themeStyles.textSecondary,
                        fontSize: '0.875rem'
                    }}>
                        Showing {filteredAlerts.length} of {alerts.length} alerts
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .spinning {
                    animation: spin 1s linear infinite;
                }

                .mobile-hidden {
                    display: inline;
                }

                @media (max-width: 767px) {
                    .mobile-hidden {
                        display: none !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default WeatherAlerts;