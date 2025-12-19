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
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={20} className="text-error" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Security Alerts</h2>
            <p className="text-sm text-muted-foreground">
              {visibleAlerts?.length} active alerts
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" iconName="Settings">
          Configure
        </Button>
      </div>
      {visibleAlerts?.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Shield" size={24} className="text-success" />
          </div>
          <h3 className="text-sm font-medium text-foreground mb-2">All Clear</h3>
          <p className="text-sm text-muted-foreground">No security alerts at this time</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
          {visibleAlerts?.map((alert) => {
            const config = getAlertConfig(alert?.type);
            return (
              <div
                key={alert?.id}
                className={`p-4 rounded-lg border ${config?.bgColor} ${config?.borderColor} transition-all duration-300`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config?.bgColor}`}>
                      <Icon name={config?.icon} size={16} className={config?.textColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-medium text-foreground">
                          {alert?.title}
                        </h3>
                        {alert?.actionRequired && (
                          <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full font-medium">
                            Action Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert?.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(alert?.timestamp)}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button className="text-xs text-primary hover:text-primary/80 transition-colors duration-150">
                            View Details
                          </button>
                          {alert?.actionRequired && (
                            <Button variant="outline" size="xs">
                              Take Action
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert?.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-150 ml-2"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>
                {/* Expandable Details */}
                <div className="mt-3 p-3 bg-muted/20 rounded-lg">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                    {alert?.details}
                  </pre>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* View All Alerts */}
      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="ghost" className="w-full" iconName="ArrowRight" iconPosition="right">
          View All Security Events
        </Button>
      </div>
    </div>
  );
};

export default SecurityAlerts;