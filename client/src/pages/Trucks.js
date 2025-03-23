import React, { useState, useEffect, useCallback } from 'react';
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

  // ✅ Wrap fetchTrucks in useCallback to avoid re-creation
  const fetchTrucks = useCallback(() => {
    axios.get('http://localhost:5555/trucks', { withCredentials: true })
      .then(response => setTrucks(response.data))
      .catch(err => handleError(err, 'Failed to fetch trucks.'));
  }, []);

  useEffect(() => {
    fetchTrucks();
  }, [fetchTrucks]); // ✅ Dependency is now correctly managed

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingTruck
      ? `http://localhost:5555/trucks/${editingTruck.id}`
      : 'http://localhost:5555/trucks';
    const method = editingTruck ? 'put' : 'post';

    axios[method](url, formData, { withCredentials: true })
      .then(() => {
        fetchTrucks();
        resetForm();
        setError('');
      })
      .catch(err => handleError(err, editingTruck ? 'Failed to update truck.' : 'Failed to create truck.'));
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
    axios.delete(`http://localhost:5555/trucks/${id}`, { withCredentials: true })
      .then(() => {
        fetchTrucks();
        setError('');
      })
      .catch(err => handleError(err, 'Failed to delete truck.'));
  };

  const handleGetById = (id) => {
    axios.get(`http://localhost:5555/trucks/${id}`, { withCredentials: true })
      .then(response => alert(JSON.stringify(response.data, null, 2)))
      .catch(err => handleError(err, 'Failed to fetch truck details.'));
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

  const handleError = (err, fallbackMessage) => {
    const backendMsg = err.response?.data?.error || err.response?.data?.message;
    setError(backendMsg || fallbackMessage);
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
