import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SecurityAlerts = () => {
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  const alerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Key Expiration Warning',
      message: '3 production keys will expire within 7 days',
      timestamp: new Date(Date.now() - 1800000),
      actionRequired: true,
      details: `Affected Keys:\n• prod-aes-2023-001 (expires in 3 days)\n• api-rsa-2023-005 (expires in 5 days)\n• db-encrypt-2023-012 (expires in 7 days)`
    },
    {
      id: 2,
      type: 'warning',
      title: 'Unusual Access Pattern',
      message: 'Multiple failed authentication attempts detected',
      timestamp: new Date(Date.now() - 3600000),
      actionRequired: true,
      details: `Source IP: 192.168.1.100\nAttempts: 15 failed logins\nTime Range: Last 2 hours\nUser: john.doe@company.com`
    },
    {
      id: 3,
      type: 'info',
      title: 'Policy Update Available',
      message: 'New quantum-resistant algorithms are now supported',
      timestamp: new Date(Date.now() - 7200000),
      actionRequired: false,
      details: `New Algorithms:\n• Kyber-1024 (Key Encapsulation)\n• Dilithium-3 (Digital Signatures)\n• SPHINCS+ (Stateless Signatures)`
    },
    {
      id: 4,
      type: 'success',
      title: 'Backup Completed',
      message: 'Weekly key backup completed successfully',
      timestamp: new Date(Date.now() - 10800000),
      actionRequired: false,
      details: `Backup Details:\n• Keys Backed Up: 247\n• Backup Size: 2.3 MB\n• Storage: Encrypted S3 Bucket\n• Retention: 90 days`
    }
  ];

  const visibleAlerts = alerts?.filter(alert => !dismissedAlerts?.has(alert?.id));

  const dismissAlert = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const getAlertConfig = (type) => {
    const configs = {
      critical: {
        icon: 'AlertTriangle',
        bgColor: 'bg-error/10',
        textColor: 'text-error',
        borderColor: 'border-error/20'
      },
      warning: {
        icon: 'AlertCircle',
        bgColor: 'bg-warning/10',
        textColor: 'text-warning',
        borderColor: 'border-warning/20'
      },
      info: {
        icon: 'Info',
        bgColor: 'bg-primary/10',
        textColor: 'text-primary',
        borderColor: 'border-primary/20'
      },
      success: {
        icon: 'CheckCircle',
        bgColor: 'bg-success/10',
        textColor: 'text-success',
        borderColor: 'border-success/20'
      }
    };
    return configs?.[type] || configs?.info;
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return timestamp?.toLocaleDateString();
    }
  };

  return (
    <div className="">
      
    </div>
  );
};

export default SecurityAlerts;