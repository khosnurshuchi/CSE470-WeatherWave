const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: { width: '1rem', height: '1rem', borderWidth: '2px' },
    medium: { width: '2rem', height: '2rem', borderWidth: '3px' },
    large: { width: '3rem', height: '3rem', borderWidth: '4px' }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative'
  };

  const spinnerStyle = {
    ...sizeClasses[size],
    border: `${sizeClasses[size].borderWidth} solid rgba(255, 255, 255, 0.2)`,
    borderTop: `${sizeClasses[size].borderWidth} solid #fff`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const textStyle = {
    marginTop: '1rem',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.875rem',
    fontWeight: '500'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    borderRadius: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1
  };

  return (
    <div style={containerStyle}>
      {/* Animated Background Elements */}
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

      <div style={cardStyle}>
        <div style={spinnerStyle}></div>
        {text && (
          <p style={textStyle}>{text}</p>
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

export default LoadingSpinner;