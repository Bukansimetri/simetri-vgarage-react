import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './Login.css'; // Reuse Login styles


function ResetPassword() {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(data.message);
        setTimeout(() => navigate("/login"), 2000);
      } else setError(data.message);
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Reset Password</h2>
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
        {msg && <div style={{ color: "green" }}>{msg}</div>}
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}

export default ResetPassword;