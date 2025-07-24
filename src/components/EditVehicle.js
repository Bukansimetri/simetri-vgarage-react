import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./VehicleDetail.css";

function EditVehicle() {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/api/vehicles/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Vehicle not found");
        return res.json();
      })
      .then((data) => setVehicle(data))
      .catch((err) => setError(err.message));
  }, [id]);

  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/api/vehicles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(vehicle),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update vehicle");
        return res.json();
      })
      .then(() => navigate(`/vehicle/${id}`))
      .catch((err) => setError(err.message));
  };

  if (error) return <div>{error}</div>;
  if (!vehicle) return <div>Loading...</div>;

  return (
    <div className="edit-vehicle-container bg-edit-vehicle">
      <div className="vehicle-detail-container">
        <h1 className="title">Edit Vehicle</h1>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field">
            <label>Name</label>
            <input
              name="name"
              value={vehicle.name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field">
            <label>
              <i>Current Mileage</i>
            </label>
            <input
              name="current_mileage"
              value={vehicle.current_mileage || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field">
            <label>Last Service KM</label>
            <input
              name="last_service_km"
              value={vehicle.last_service_km || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field">
            <label>Service Interval KM</label>
            <input
              name="service_interval_km"
              value={vehicle.service_interval_km || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field">
            <label>Pajak Due</label>
            <input
              type="date"
              name="pajak_due"
              value={vehicle.pajak_due ? vehicle.pajak_due.slice(0, 10) : ""}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="back-button"
            style={{ marginTop: 0 }}
          >
            Save
          </button>
        </form>
        <button
          className="back-button"
          style={{ marginTop: 20 }}
          type="button"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditVehicle;