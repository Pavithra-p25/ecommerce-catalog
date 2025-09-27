import React, { useState, useEffect } from 'react';
import './Notification.css';

let showNotification;

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    showNotification = (message, type = 'info') => {
      const id = Date.now();
      const notification = { id, message, type };
      
      setNotifications(prev => [...prev, notification]);
      
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 5000);
    };
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
          onClick={() => removeNotification(notification.id)}
        >
          <span>{notification.message}</span>
          <button
            className="notification-close"
            onClick={(e) => {
              e.stopPropagation();
              removeNotification(notification.id);
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export const notify = {
  success: (message) => showNotification && showNotification(message, 'success'),
  error: (message) => showNotification && showNotification(message, 'error'),
  info: (message) => showNotification && showNotification(message, 'info'),
  warning: (message) => showNotification && showNotification(message, 'warning'),
};

export default Notification;
