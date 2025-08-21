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
  
  // Styles (copied from Login/Register theme)
  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "3rem 1rem",
    position: "relative",
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
    padding: "2.5rem",
    borderRadius: "1.5rem",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    border: "1px solid rgba(16, 185, 129, 0.2)",
    maxWidth: "28rem",
    margin: "0 auto",
    width: "100%",
    textAlign: "center",
  };

  const logoStyle = {
    width: "4rem",
    height: "4rem",
    background: sent
      ? "linear-gradient(135deg, #10b981, #047857)"
      : "linear-gradient(135deg, #047857, #065f46)",
    borderRadius: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1.5rem",
    boxShadow: "0 10px 25px rgba(4, 120, 87, 0.3)",
  };

  const titleStyle = {
    fontSize: "2.25rem",
    fontWeight: "bold",
    textAlign: "center",
    background: "linear-gradient(135deg, #047857, #065f46)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
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
    border: "2px solid #d1d5db",
    borderRadius: "0.75rem",
    transition: "all 0.3s ease",
    background: "white",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const inputFocusStyle = {
    ...inputStyle,
    border: "2px solid #047857",
    boxShadow: "0 0 0 4px rgba(4, 120, 87, 0.1)",
  };

  const iconStyle = {
    position: "absolute",
    left: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    width: "1.25rem",
    height: "1.25rem",
    color: "#047857",
  };

  const buttonStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem 1.5rem",
    background: loading
      ? "#9ca3af"
      : "linear-gradient(135deg, #047857, #065f46)",
    color: "white",
    fontSize: "1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "0.75rem",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 14px 0 rgba(4, 120, 87, 0.5)",
    marginTop: "1rem",
  };

  return (
    <div style={containerStyle}>
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
          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            If an account with that email exists, we’ve sent a reset link.  
            Please check your inbox.
          </p>
        ) : (
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
            <button type="submit" style={buttonStyle} disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
