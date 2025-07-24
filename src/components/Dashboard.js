import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './Dashboard.css';
import './Backgrounds.css'; // Import the CSS file for backgrounds



function Dashboard() {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const [vehicles, setVehicles] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notifIndex, setNotifIndex] = useState(0);
  const navigate = useNavigate();

  // Check login state on mount and fetch vehicles
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        navigate('/login');
        return;
      }
      // Fetch vehicles for this user
      fetch(`${API_BASE_URL}}/api/vehicles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setVehicles(data);

          // Notification logic for every vehicle
          const notifs = [];
          const currentYear = new Date().getFullYear();

          data.forEach(vehicle => {
            // Service notification logic (existing)
            const last_service_km = Number(vehicle.last_service_km);
            const service_interval_km = Number(vehicle.service_interval_km);
            const current_km = Number(vehicle.current_mileage);

            if (
              !isNaN(last_service_km) && last_service_km > 0 &&
              !isNaN(service_interval_km) && service_interval_km > 0
            ) {
              const next_service_km = last_service_km + service_interval_km;
              const diff = current_km - next_service_km;
              if (
                !isNaN(current_km) &&
                ((diff > 0 && diff <= 200) || (diff < 0 && diff >= -200))
              ) {
                notifs.push({
                  id: vehicle.id + '-service',
                  name: vehicle.name,
                  diff,
                  message: diff > 0
                    ? `Reminder: Vehicle Service for ${vehicle.name} is overdue!`
                    : `Reminder: Vehicle Service for ${vehicle.name} is due in ${Math.abs(diff)} KM!`,
                  distance: Math.abs(diff)
                });
              }
            }

            // Pajak due notification logic (NEW)
            if (vehicle.pajak_due) {
              const pajakYear = new Date(vehicle.pajak_due).getFullYear();
              if (pajakYear === currentYear) {
                notifs.push({
                  id: vehicle.id + '-pajak',
                  name: vehicle.name,
                  diff: null,
                  message: `Reminder: Vehicle Tax ${vehicle.name} is due this year (${vehicle.pajak_due.slice(0, 10)})!`,
                  distance: null
                });
              }
            }
          });

          setNotifications(notifs);
          setNotifIndex(0); // Reset to first notification
        })
        .catch(() => setVehicles([]));
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      navigate('/login');
    }
  }, [navigate]);

  const handleNextNotification = () => {
    if (notifIndex < notifications.length - 1) {
      setNotifIndex(notifIndex + 1);
    } else {
      setNotifications([]);
      setNotifIndex(0);
    }
    // Only send notificationText
    notifyUser(' ');
  };

  const handleCloseNotification = () => {
    if (notifications.length > 0 && notifications[notifIndex]) {
      const notif = notifications[notifIndex];
      const vehicleId = notif.id.split('-')[0];
      const notificationType = notif.id.split('-')[1];
      updateVehicleOnNotification(vehicleId, notificationType);
    }
    if (notifIndex < notifications.length - 1) {
      setNotifIndex(notifIndex + 1);
    } else {
      setNotifications([]);
      setNotifIndex(0);
    }
  };

  const notifyUser = async (notificationText) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}}/api/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ notificationText }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert('Failed: ' + data.message + '\nError: ' + data.error);
      } else {
        // Optionally, you can remove this alert to avoid spamming the user
        // alert('Notification and email sent!');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Update vehicle data when a notification is sent
  const updateVehicleOnNotification = async (vehicleId, notificationType) => {
    const token = localStorage.getItem('token');
    const vehicle = vehicles.find(v => String(v.id) === String(vehicleId));
    if (!vehicle) return;

    let updateBody = {};

    if (notificationType === 'service') {
      // Set last_service_km to current_mileage
      updateBody.last_service_km = vehicle.current_mileage;
    }
    if (notificationType === 'pajak') {
      // Set pajak_due to next year (or any logic you want)
      const currentDue = new Date(vehicle.pajak_due);
      const nextYear = new Date(currentDue.setFullYear(currentDue.getFullYear() + 1));
      updateBody.pajak_due = nextYear.toISOString().slice(0, 10);
    }

    try {
      await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateBody),
      });
      // Refetch vehicles to update notifications
      fetch(`${API_BASE_URL}}/api/vehicles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setVehicles(data));
    } catch (err) {
      console.error('Failed to update vehicle after notification:', err);
    }
  };

  useEffect(() => {
    if (notifications.length > 0 && notifications[notifIndex]) {
      notifyUser(notifications[notifIndex].message);
    }
    // eslint-disable-next-line
  }, [notifications, notifIndex]);

  return (
    <div className="dashboard">
      {notifications.length > 0 && notifications[notifIndex] && (
        <div className="custom-popup-overlay" key={notifications[notifIndex].id}>
          <div className="custom-popup">
            <h1 className="popup-title">NOTIFICATION</h1>
            <p className="popup-message">{notifications[notifIndex].message}</p>
            <div className="popup-distance">
              {notifications[notifIndex].distance !== null ? `${notifications[notifIndex].distance} KM` : ''}
            </div>
            <div className="popup-buttons">
              {/* <button className="popup-btn" onClick={handleNextNotification}>REMIND ME</button> */}
              <button className="popup-btn" onClick={handleCloseNotification}>SERVICE DONE</button>
            </div>
          </div>
        </div>
      )}
      <h1>Vehicle Overview</h1>
      <div className="vehicle-list">
        {vehicles.map((vehicle) => (
          <Link key={vehicle.id} to={`/vehicle/${vehicle.id}`} className="vehicle-card-link">
            <div className="vehicle-card">
              <h3>{vehicle.name}</h3>
              <p>Mileage: {vehicle.current_mileage?.toLocaleString()} km</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;