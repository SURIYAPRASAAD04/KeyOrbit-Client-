import React, { useEffect, useState } from 'react';
import Icon from './AppIcon';

const SimpleNotification = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose,
  position = 'top-right' 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left': return 'top-6 left-6';
      case 'top-center': return 'top-6 left-1/2 transform -translate-x-1/2';
      case 'top-right': return 'top-6 right-6';
      case 'bottom-left': return 'bottom-6 left-6';
      case 'bottom-center': return 'bottom-6 left-1/2 transform -translate-x-1/2';
      case 'bottom-right': return 'bottom-6 right-6';
      default: return 'top-6 right-6';
    }
  };

  const getTypeClasses = () => {
    switch (type) {
      case 'success': return 'bg-success text-success-foreground border-success/20';
      case 'error': return 'bg-error text-error-foreground border-error/20';
      case 'warning': return 'bg-warning text-warning-foreground border-warning/20';
      case 'info': return 'bg-primary text-primary-foreground border-primary/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return 'CheckCircle';
      case 'error': return 'AlertCircle';
      case 'warning': return 'AlertTriangle';
      case 'info': return 'Info';
      default: return 'Info';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed z-50 min-w-80 max-w-md rounded-lg shadow-2xl border animate-slideInRight ${getPositionClasses()} ${getTypeClasses()}`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Icon name={getIcon()} size={20} className="mt-0.5" />
            <div>
              <p className="text-sm font-medium">{message}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose?.(), 300);
            }}
            className="ml-4 hover:opacity-80 transition-opacity"
          >
            <Icon name="X" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleNotification;