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
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${overallConfig?.bgColor}`}>
            <Icon name={overallConfig?.icon} size={20} className={overallConfig?.color} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">System Status</h2>
            <p className={`text-sm font-medium ${overallConfig?.color}`}>
              {overallConfig?.label}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Overall Uptime</p>
          <p className="text-lg font-bold text-foreground">99.94%</p>
        </div>
      </div>
      {/* System Components */}
      <div className="space-y-3">
        {systemComponents?.map((component) => {
          const config = getStatusConfig(component?.status);
          return (
            <div
              key={component?.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors duration-150"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${config?.bgColor}`}>
                  <Icon name={config?.icon} size={12} className={config?.color} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    {component?.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {component?.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`text-xs font-medium ${config?.color}`}>
                    {config?.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {component?.uptime}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Checked {formatTime(component?.lastCheck)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {/* Status Legend */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Operational</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-muted-foreground">Degraded</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-muted-foreground">Maintenance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full"></div>
            <span className="text-muted-foreground">Outage</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;