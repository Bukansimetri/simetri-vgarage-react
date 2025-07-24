import React, { useState } from 'react';
import './AddVehicle.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const AddVehicle = () => {
  const [form, setForm] = useState({
    name: '',
    current_mileage: '',
    last_service_km: '',
    service_interval_km: '',
    pajak_due: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Vehicle registered!');
        setForm({
          name: '',
          current_mileage: '',
          last_service_km: '',
          service_interval_km: '',
          pajak_due: ''
        });
      } else {
        alert(data.message || 'Failed to register vehicle.');
      }
    } catch (err) {
      alert('Server error. Please try again later.');
    }
  };

  return (
    <div className="vehicle-form-container">
      <form className="vehicle-form" onSubmit={handleSubmit}>
        <h2>ADD VEHICLE DATA</h2>

        <div className="form-row">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <input
            type="number"
            name="current_mileage"
            placeholder="Current Mileage"
            value={form.current_mileage}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <input
            type="number"
            name="last_service_km"
            placeholder="Last Service KM"
            value={form.last_service_km}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            type="number"
            name="service_interval_km"
            placeholder="Service Interval KM"
            value={form.service_interval_km}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label htmlFor="pajak_due" style={{ fontWeight: 'bold' }}>
            Tax Date
          </label>
          <input
            type="date"
            id="pajak_due"
            name="pajak_due"
            placeholder="Pajak Due"
            value={form.pajak_due}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="register-btn">Register vehicle</button>
      </form>
    </div>
  );
};

export default AddVehicle;
