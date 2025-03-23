// src/pages/Login.js
import React, { useState } from "react";
import axios from "axios";
import "../Login.css";

function Login() {
  // Use username instead of email
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/login", formData)
      .then(response => {
        // Save role from response.data.user.role
        localStorage.setItem("role", response.data.user.role);
        window.location.href = "/";
      })
      .catch(() => setError("Invalid login credentials"));
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <input 
          type="text" 
          name="username" 
          placeholder="Username" 
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          onChange={handleChange} 
          required 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;