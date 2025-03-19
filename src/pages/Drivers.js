// React Frontend for Truck System
// Includes Drivers, Trucks, Assignments, Authentication, and Role-Based Access

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Drivers.css";

// Drivers Page
function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDriver, setNewDriver] = useState({ name: "", license_number: "", contact_info: "", assigned_truck_id: "", created_at: "" });

  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "admin";

  useEffect(() => {
    axios.get("http://localhost:5000/drivers")
      .then(response => {
        setDrivers(response.data);
        setLoading(false);
      })
      .catch(() => setError("Failed to load drivers."));
  }, []);

  const handleInputChange = (e) => {
    setNewDriver((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/drivers", newDriver)
      .then(() => {
        setDrivers([...drivers, newDriver]);
        setNewDriver({ name: "", license_number: "", contact_info: "", assigned_truck_id: "", created_at: "" });
      })
      .catch(() => setError("Failed to add driver."));
  };

  return (
    <div className="drivers-list">
      <h2>Drivers</h2>
      {isAdmin && (
        <form className="driver-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" value={newDriver.name} onChange={handleInputChange} required />
          <input type="text" name="license_number" placeholder="License Number" value={newDriver.license_number} onChange={handleInputChange} required />
          <input type="text" name="contact_info" placeholder="Contact Info" value={newDriver.contact_info} onChange={handleInputChange} required />
          <input type="text" name="assigned_truck_id" placeholder="Assigned Truck ID" value={newDriver.assigned_truck_id} onChange={handleInputChange} required />
          <input type="datetime-local" name="created_at" placeholder="Created At" value={newDriver.created_at} onChange={handleInputChange} required />
          <button type="submit">Add Driver</button>
        </form>
      )}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>License</th><th>Contact</th><th>Assigned Truck</th><th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map(driver => (
            <tr key={driver.id}><td>{driver.id}</td><td>{driver.name}</td><td>{driver.license_number}</td><td>{driver.contact_info}</td><td>{driver.assigned_truck_id}</td><td>{driver.created_at}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Drivers;
