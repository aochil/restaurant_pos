// src/pages/Login.jsx

import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
      navigate("/");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">Log In</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Log In
        </button>
      </form>

      <p className="mt-3 text-center">
          Don't have an account? <Link to="/register">Sign up here </Link>
        </p>
    </div>
  );
}
