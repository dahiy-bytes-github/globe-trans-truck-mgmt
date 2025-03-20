// React Frontend for Truck System
// Includes Drivers, Trucks, Assignments, Authentication, and Role-Based Access

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Trucks.css";

// Trucks Page
function Trucks() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTruck, setNewTruck] = useState({ model: "", plate_number: "", status: "Available", created_at: "" });

  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "admin";

  useEffect(() => {
    axios.get("http://localhost:5000/trucks")
      .then(response => {
        setTrucks(response.data);
        setLoading(false);
      })
      .catch(() => setError("Failed to load trucks."));
  }, []);

  const handleInputChange = (e) => {
    setNewTruck((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/trucks", newTruck)
      .then(() => {
        setTrucks([...trucks, newTruck]);
        setNewTruck({ model: "", plate_number: "", status: "Available", created_at: "" });
      })
      .catch(() => setError("Failed to add truck."));
  };

  return (
    <div className="trucks-list">
      <h2>Trucks</h2>
      {isAdmin && (
        <form className="truck-form" onSubmit={handleSubmit}>
          <input type="text" name="model" placeholder="Truck Model" value={newTruck.model} onChange={handleInputChange} required />
          <input type="text" name="plate_number" placeholder="Plate Number" value={newTruck.plate_number} onChange={handleInputChange} required />
          <select name="status" value={newTruck.status} onChange={handleInputChange} required>
            <option value="Available">Available</option>
            <option value="In Use">In Use</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <input type="datetime-local" name="created_at" value={newTruck.created_at} onChange={handleInputChange} required />
          <button type="submit">Add Truck</button>
        </form>
      )}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Plate Number</th><th>Model</th><th>Status</th><th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {trucks.map(truck => (
            <tr key={truck.id}><td>{truck.id}</td><td>{truck.plate_number}</td><td>{truck.model}</td><td>{truck.status}</td><td>{truck.created_at}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Trucks;