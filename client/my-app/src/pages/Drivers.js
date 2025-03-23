// src/pages/Drivers.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [editingDriver, setEditingDriver] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    license_number: '',
    contact_info: '',
    assigned_truck_id: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = () => {
    axios.get('http://localhost:5000/drivers')
      .then(response => setDrivers(response.data))
      .catch(() => setError('Failed to fetch drivers.'));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDriver) {
      axios.put(`http://localhost:5000/drivers/${editingDriver.id}`, formData)
        .then(() => {
          fetchDrivers();
          resetForm();
        })
        .catch(() => setError('Failed to update driver.'));
    } else {
      axios.post('http://localhost:5000/drivers', formData)
        .then(() => {
          fetchDrivers();
          resetForm();
        })
        .catch(() => setError('Failed to create driver.'));
    }
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      license_number: driver.license_number,
      contact_info: driver.contact_info,
      assigned_truck_id: driver.assigned_truck_id || ''
    });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/drivers/${id}`)
      .then(() => fetchDrivers())
      .catch(() => setError('Failed to delete driver.'));
  };

  const handleGetById = (id) => {
    axios.get(`http://localhost:5000/drivers/${id}`)
      .then(response => alert(JSON.stringify(response.data, null, 2)))
      .catch(() => setError('Failed to fetch driver details.'));
  };

  const resetForm = () => {
    setEditingDriver(null);
    setFormData({
      name: '',
      license_number: '',
      contact_info: '',
      assigned_truck_id: ''
    });
  };

  return (
    <div>
      <h1>Drivers</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Driver Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="license_number"
          placeholder="License Number"
          value={formData.license_number}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contact_info"
          placeholder="Contact Info"
          value={formData.contact_info}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="assigned_truck_id"
          placeholder="Assigned Truck ID (optional)"
          value={formData.assigned_truck_id}
          onChange={handleChange}
        />
        <button type="submit">{editingDriver ? 'Update Driver' : 'Add Driver'}</button>
        {editingDriver && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <ul>
        {drivers.map(driver => (
          <li key={driver.id}>
            <p>
              <strong>ID:</strong> {driver.id} | <strong>Name:</strong> {driver.name} | <strong>License:</strong> {driver.license_number} | <strong>Contact:</strong> {driver.contact_info} | <strong>Assigned Truck:</strong> {driver.assigned_truck_id || 'N/A'}
            </p>
            <button onClick={() => handleGetById(driver.id)}>View Details</button>
            <button onClick={() => handleEdit(driver)}>Edit</button>
            <button onClick={() => handleDelete(driver.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Drivers;
