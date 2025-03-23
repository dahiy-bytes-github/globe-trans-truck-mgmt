// src/pages/Trucks.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Trucks = () => {
  const [trucks, setTrucks] = useState([]);
  const [editingTruck, setEditingTruck] = useState(null);
  const [formData, setFormData] = useState({
    plate_number: '',
    model: '',
    status: 'Available',
    current_driver_id: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrucks();
  }, []);

  const fetchTrucks = () => {
    axios.get('http://localhost:5000/trucks')
      .then(response => setTrucks(response.data))
      .catch(() => setError('Failed to fetch trucks.'));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create or update truck based on whether we're editing
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTruck) {
      axios.put(`http://localhost:5000/trucks/${editingTruck.id}`, formData)
        .then(() => {
          fetchTrucks();
          resetForm();
        })
        .catch(() => setError('Failed to update truck.'));
    } else {
      axios.post('http://localhost:5000/trucks', formData)
        .then(() => {
          fetchTrucks();
          resetForm();
        })
        .catch(() => setError('Failed to create truck.'));
    }
  };

  const handleEdit = (truck) => {
    setEditingTruck(truck);
    setFormData({
      plate_number: truck.plate_number,
      model: truck.model,
      status: truck.status,
      current_driver_id: truck.current_driver_id || ''
    });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/trucks/${id}`)
      .then(() => fetchTrucks())
      .catch(() => setError('Failed to delete truck.'));
  };

  // Read (view details) via a simple alert; in a real app you might use a modal or separate page
  const handleGetById = (id) => {
    axios.get(`http://localhost:5000/trucks/${id}`)
      .then(response => alert(JSON.stringify(response.data, null, 2)))
      .catch(() => setError('Failed to fetch truck details.'));
  };

  const resetForm = () => {
    setEditingTruck(null);
    setFormData({
      plate_number: '',
      model: '',
      status: 'Available',
      current_driver_id: ''
    });
  };

  return (
    <div>
      <h1>Trucks</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="plate_number"
          placeholder="Plate Number"
          value={formData.plate_number}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={formData.model}
          onChange={handleChange}
          required
        />
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="Available">Available</option>
          <option value="In Use">In Use</option>
          <option value="Maintenance">Maintenance</option>
        </select>
        <input
          type="number"
          name="current_driver_id"
          placeholder="Current Driver ID (optional)"
          value={formData.current_driver_id}
          onChange={handleChange}
        />
        <button type="submit">{editingTruck ? 'Update Truck' : 'Add Truck'}</button>
        {editingTruck && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <ul>
        {trucks.map(truck => (
          <li key={truck.id}>
            <p>
              <strong>ID:</strong> {truck.id} | <strong>Plate:</strong> {truck.plate_number} | <strong>Model:</strong> {truck.model} | <strong>Status:</strong> {truck.status} | <strong>Driver ID:</strong> {truck.current_driver_id || 'N/A'}
            </p>
            <button onClick={() => handleGetById(truck.id)}>View Details</button>
            <button onClick={() => handleEdit(truck)}>Edit</button>
            <button onClick={() => handleDelete(truck.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Trucks;
