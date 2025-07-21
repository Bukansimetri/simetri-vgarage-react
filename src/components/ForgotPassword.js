import React, { useState } from "react";
import './Login.css'; // Reuse Login styles

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) setMsg(data.message);
      else setError(data.message + (data.error ? ` (${data.error})` : ""));
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
        {msg && <div style={{ color: "green" }}>{msg}</div>}
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}

export default ForgotPassword;