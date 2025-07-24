import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./VehicleDetail.css";

function VehicleDetail() {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetch(`${API_BASE_URL}/api/vehicles/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Vehicle not found");
        return res.json();
      })
      .then((data) => setVehicle(data))
      .catch((err) => setError(err.message));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/api/vehicles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete vehicle");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div>{error}</div>;
  if (!vehicle) return <div>Loading...</div>;

  return (
    <div className="vehicle-detail-container">
      <h1 className="title">Vehicle Detail</h1>
      <div className="form-grid">
        <div className="field">
          <label>Name</label>
          <input value={vehicle.name} readOnly />
        </div>
        <div className="field">
          <label>
            <i>Current Mileage</i>
          </label>
          <input value={vehicle.current_mileage} readOnly />
        </div>
        <div className="field">
          <label>Last Service KM</label>
          <input value={vehicle.last_service_km} readOnly />
        </div>
        <div className="field">
          <label>Service Interval KM</label>
          <input value={vehicle.service_interval_km} readOnly />
        </div>
        <div className="field">
          <label>Tax Due</label>
          <input
            value={vehicle.pajak_due ? vehicle.pajak_due.slice(0, 10) : ""}
            readOnly
            type="date"
          />
        </div>
      </div>

      <button className="back-button" onClick={() => navigate("/")}>
        Back to Home
      </button>
      <button className="back-button" onClick={() => navigate(`/vehicle/${vehicle.id}/edit`)}>
        Edit Vehicle
      </button>
      <button
        className="back-button"
        onClick={handleDelete}
      >
        Delete Vehicle
      </button>
    </div>
  );
}

export default VehicleDetail;
