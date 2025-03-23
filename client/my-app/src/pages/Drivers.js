import React, { useState, useEffect, useCallback } from 'react';
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

  const getErrorMsg = (err, fallback = 'An error occurred.') => {
    return err.response?.data?.error || err.response?.data?.message || fallback;
  };

  // ✅ Wrap fetchDrivers in useCallback to prevent unnecessary re-creation
  const fetchDrivers = useCallback(() => {
    axios.get('http://localhost:5555/drivers', { withCredentials: true })
      .then(response => setDrivers(response.data))
      .catch(err => setError(getErrorMsg(err, 'Failed to fetch drivers.')));
  }, []);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]); // ✅ Correct dependency

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = editingDriver
      ? axios.put(`http://localhost:5555/drivers/${editingDriver.id}`, formData, { withCredentials: true })
      : axios.post('http://localhost:5555/drivers', formData, { withCredentials: true });

    request
      .then(() => {
        fetchDrivers();
        resetForm();
      })
      .catch(err => {
        setError(getErrorMsg(err, editingDriver ? 'Failed to update driver.' : 'Failed to create driver.'));
      });
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
    axios.delete(`http://localhost:5555/drivers/${id}`, { withCredentials: true })
      .then(() => fetchDrivers())
      .catch(err => setError(getErrorMsg(err, 'Failed to delete driver.')));
  };

  const handleGetById = (id) => {
    axios.get(`http://localhost:5555/drivers/${id}`, { withCredentials: true })
      .then(response => alert(JSON.stringify(response.data, null, 2)))
      .catch(err => setError(getErrorMsg(err, 'Failed to fetch driver details.')));
  };

  const resetForm = () => {
    setEditingDriver(null);
    setFormData({
      name: '',
      license_number: '',
      contact_info: '',
      assigned_truck_id: ''
    });
    setError('');
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
