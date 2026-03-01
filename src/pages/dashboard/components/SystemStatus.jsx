import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemStatus = () => {
  const systemComponents = [
    {
      id: 'kms-core',
      name: 'KMS Core Service',
      status: 'operational',
      uptime: '99.98%',
      lastCheck: new Date(Date.now() - 120000),
      description: 'Primary key management operations'
    },
    {
      id: 'hsm-cluster',
      name: 'HSM Cluster',
      status: 'operational',
      uptime: '99.99%',
      lastCheck: new Date(Date.now() - 60000),
      description: 'Hardware security module cluster'
    },
    {
      id: 'api-gateway',
      name: 'API Gateway',
      status: 'degraded',
      uptime: '99.85%',
      lastCheck: new Date(Date.now() - 180000),
      description: 'REST API endpoint services'
    },
    {
      id: 'audit-service',
      name: 'Audit Service',
      status: 'operational',
      uptime: '99.95%',
      lastCheck: new Date(Date.now() - 90000),
      description: 'Logging and compliance monitoring'
    },
    {
      id: 'backup-system',
      name: 'Backup System',
      status: 'maintenance',
      uptime: '99.90%',
      lastCheck: new Date(Date.now() - 300000),
      description: 'Key backup and recovery services'
    }
  ];

  const getStatusConfig = (status) => {
    const configs = {
      operational: {
        icon: 'CheckCircle',
        color: 'text-success',
        bgColor: 'bg-success/10',
        label: 'Operational'
      },
      degraded: {
        icon: 'AlertTriangle',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        label: 'Degraded'
      },
      maintenance: {
        icon: 'Settings',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        label: 'Maintenance'
      },
      outage: {
        icon: 'XCircle',
        color: 'text-error',
        bgColor: 'bg-error/10',
        label: 'Outage'
      }
    };
    return configs?.[status] || configs?.operational;
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) {
      return 'Just now';
    } else if (minutes < 60) {
      return `${minutes}m ago`;
    } else {
      const hours = Math.floor(minutes / 60);
      return `${hours}h ago`;
    }
  };

  const overallStatus = systemComponents?.every(comp => comp?.status === 'operational') 
    ? 'operational' 
    : systemComponents?.some(comp => comp?.status === 'outage')
    ? 'outage' :'degraded';

  const overallConfig = getStatusConfig(overallStatus);

  return (
    <div className="">
      
    </div>
  );
};

export default SystemStatus;