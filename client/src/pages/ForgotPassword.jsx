// src/pages/ForgotPassword.jsx

import { useState } from "react";
import { authAPI } from "../services/api";
import { Mail, Shield, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authAPI.forgotPassword(email); // call your backend
      setSent(true);
      toast.success("Password reset link sent to your email!");
    } catch (error) {
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };
  
  // Updated styles to match dashboard theme
  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "3rem 1rem",
    position: "relative",
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    padding: "2.5rem",
    borderRadius: "1.5rem",
    maxWidth: "28rem",
    margin: "0 auto",
    width: "100%",
    textAlign: "center",
    color: "#fff",
    position: "relative",
    zIndex: 1
  };

  const logoStyle = {
    width: "4rem",
    height: "4rem",
    background: sent
      ? "rgba(16, 185, 129, 0.8)"
      : "rgba(59, 130, 246, 0.8)",
    borderRadius: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1.5rem",
    boxShadow: sent 
      ? "0 10px 25px rgba(16, 185, 129, 0.4)"
      : "0 10px 25px rgba(59, 130, 246, 0.4)",
    backdropFilter: "blur(10px)"
  };

  const titleStyle = {
    fontSize: "2.25rem",
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    marginBottom: "1rem",
  };

  const inputContainerStyle = {
    position: "relative",
    marginBottom: "1.5rem",
  };

  const inputStyle = {
    width: "100%",
    paddingLeft: "3rem",
    paddingRight: "1rem",
    paddingTop: "1rem",
    paddingBottom: "1rem",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "0.75rem",
    transition: "all 0.3s ease",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
    color: "#fff",
  };

  const inputFocusStyle = {
    ...inputStyle,
    border: "1px solid rgba(255, 255, 255, 0.4)",
    background: "rgba(255, 255, 255, 0.15)",
    boxShadow: "0 0 0 4px rgba(255, 255, 255, 0.1)",
  };

  const iconStyle = {
    position: "absolute",
    left: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    width: "1.25rem",
    height: "1.25rem",
    color: "rgba(255, 255, 255, 0.8)",
  };

  const buttonStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem 1.5rem",
    background: loading
      ? "rgba(156, 163, 175, 0.8)"
      : "rgba(59, 130, 246, 0.8)",
    color: "white",
    fontSize: "1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "0.75rem",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 30px rgba(59, 130, 246, 0.3)",
    marginTop: "1rem",
    backdropFilter: "blur(10px)"
  };

  const messageStyle = {
    fontSize: "0.875rem", 
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: "1.5",
    marginBottom: "1rem"
  };

  return (
    <div style={containerStyle}>
      {/* Animated Background Elements - matching dashboard */}
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
        <div style={logoStyle}>
          {sent ? (
            <CheckCircle color="white" size={32} />
          ) : (
            <Shield color="white" size={32} />
          )}
        </div>

        <h2 style={titleStyle}>
          {sent ? "Check your email" : "Forgot Password"}
        </h2>

        {sent ? (
          <>
            <p style={messageStyle}>
              If an account with that email exists, we've sent a reset link.  
              Please check your inbox and spam folder.
            </p>
            
            {/* Success Features */}
            <div style={{ 
              marginTop: '1.5rem', 
              paddingTop: '1.5rem', 
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.75rem' }}>
                📧 Next steps
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem', color: '#fff' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    marginRight: '0.25rem',
                    animation: 'pulse 2s infinite'
                  }} />
                  Check Email
                </span>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    marginRight: '0.25rem',
                    animation: 'pulse 2s infinite',
                    animationDelay: '0.5s'
                  }} />
                  Click Link
                </span>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    marginRight: '0.25rem',
                    animation: 'pulse 2s infinite',
                    animationDelay: '1s'
                  }} />
                  Reset Password
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <p style={messageStyle}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div style={inputContainerStyle}>
                <Mail style={iconStyle} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={email ? inputFocusStyle : inputStyle}
                  placeholder="Enter your email"
                />
              </div>
              <button 
                type="submit" 
                style={buttonStyle} 
                disabled={loading}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.background = 'rgba(37, 99, 235, 0.9)';
                    e.target.style.boxShadow = '0 6px 40px rgba(59, 130, 246, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.background = 'rgba(59, 130, 246, 0.8)';
                    e.target.style.boxShadow = '0 4px 30px rgba(59, 130, 246, 0.3)';
                  }
                }}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            {/* Help Section */}
            <div style={{ 
              marginTop: '1.5rem', 
              paddingTop: '1.5rem', 
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.75rem' }}>
                🔒 Secure password reset process
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem', color: '#fff' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    backgroundColor: '#3b82f6',
                    borderRadius: '50%',
                    marginRight: '0.25rem',
                    animation: 'pulse 2s infinite'
                  }} />
                  Encrypted
                </span>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    backgroundColor: '#3b82f6',
                    borderRadius: '50%',
                    marginRight: '0.25rem',
                    animation: 'pulse 2s infinite',
                    animationDelay: '0.5s'
                  }} />
                  Time Limited
                </span>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    backgroundColor: '#3b82f6',
                    borderRadius: '50%',
                    marginRight: '0.25rem',
                    animation: 'pulse 2s infinite',
                    animationDelay: '1s'
                  }} />
                  Safe & Secure
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        
        input:focus::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;