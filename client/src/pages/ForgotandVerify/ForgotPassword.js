import "./commonfv.css";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSend = async () => {
    if (!validateEmail(email)) {
      setMessage("");
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fv-container">
      <div className="fv-card">
        <h2>Forgot Password</h2>
        <input
          className="fv-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="fv-button"
          onClick={handleSend}
          disabled={loading}
          title="Send Reset Link"
        >
          {loading && <span className="fv-spinner"></span>}
          <span>Send Reset Link</span>
        </button>

        {message && <p className="fv-message">{message}</p>}
        {error && <p className="fv-error">{error}</p>}
      </div>
    </div>
  );
}
