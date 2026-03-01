import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const Notification = ({ message, type, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300); // Allow fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return 'CheckCircle';
      case 'error': return 'AlertCircle';
      case 'warning': return 'AlertTriangle';
      case 'info': return 'Info';
      default: return 'Info';
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success': return 'bg-success/90';
      case 'error': return 'bg-error/90';
      case 'warning': return 'bg-warning/90';
      case 'info': return 'bg-primary/90';
      default: return 'bg-muted/90';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-6 right-6 z-50 min-w-80 max-w-md ${getBgColor()} text-white rounded-lg shadow-2xl animate-slideInRight`}>
      <div className="flex items-start p-4">
        <div className="flex-shrink-0">
          <Icon name={getIcon()} size={20} className="text-white" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300);
          }}
          className="ml-4 flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <Icon name="X" size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default Notification;

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showSuccess = (message, duration) => {
    return addNotification(message, 'success', duration);
  };

  const showError = (message, duration) => {
    return addNotification(message, 'error', duration);
  };

  const showWarning = (message, duration) => {
    return addNotification(message, 'warning', duration);
  };

  const showInfo = (message, duration) => {
    return addNotification(message, 'info', duration);
  };

  return (
    <>
      {children}
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </>
  );
};

// Hook for using notifications
export const useNotifications = () => {
  // This would be used in conjunction with Context in a real app
  // For simplicity, we'll export functions that can be imported directly
  return {
    showSuccess: (message, duration) => {
      // Implementation would go here
      console.log('Success:', message);
    },
    showError: (message, duration) => {
      console.log('Error:', message);
    },
    showWarning: (message, duration) => {
      console.log('Warning:', message);
    },
    showInfo: (message, duration) => {
      console.log('Info:', message);
    }
  };
};