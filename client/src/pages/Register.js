import React, { useState } from "react";
import axios from "axios";
import "../Register.css"; // Make sure the CSS file exists in this path

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "Fleet Manager"
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:5555/register", formData, {
      withCredentials: true
    })
      .then(() => {
        alert("Registration successful!");
        window.location.href = "/login";
      })
      .catch((err) => {
        const message = err.response?.data?.error || "Error registering user";
        setError(message);
      });
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
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
        <select name="role" onChange={handleChange} required>
          <option value="Fleet Manager">Fleet Manager</option>
          <option value="Admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
