import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RealTimeStream = ({ isStreaming, onToggleStream, onNotificationToggle, notificationsEnabled }) => {
  const [recentEvents, setRecentEvents] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Mock real-time events
  const mockEvents = [
    {
      id: Date.now() + 1,
      timestamp: new Date(),
      eventType: 'key_generation',
      user: 'sarah.wilson@company.com',
      action: 'Generated new AES-256 key',
      outcome: 'success',
      severity: 'info'
    },
    {
      id: Date.now() + 2,
      timestamp: new Date(Date.now() - 30000),
      eventType: 'user_login',
      user: 'mike.chen@company.com',
      action: 'User authentication successful',
      outcome: 'success',
      severity: 'info'
    },
    {
      id: Date.now() + 3,
      timestamp: new Date(Date.now() - 60000),
      eventType: 'access_denied',
      user: 'unknown@external.com',
      action: 'Attempted unauthorized key access',
      outcome: 'failure',
      severity: 'critical'
    }
  ];

  useEffect(() => {
    if (isStreaming) {
      setConnectionStatus('connecting');
      
      // Simulate connection establishment
      const connectTimer = setTimeout(() => {
        setConnectionStatus('connected');
        setRecentEvents(mockEvents);
      }, 1000);

      // Simulate periodic new events
      const eventTimer = setInterval(() => {
        const newEvent = {
          id: Date.now(),
          timestamp: new Date(),
          eventType: ['key_rotation', 'user_logout', 'policy_change']?.[Math.floor(Math.random() * 3)],
          user: ['john.doe@company.com', 'sarah.wilson@company.com', 'system']?.[Math.floor(Math.random() * 3)],
          action: 'Real-time event simulation',
          outcome: ['success', 'warning']?.[Math.floor(Math.random() * 2)],
          severity: ['info', 'warning']?.[Math.floor(Math.random() * 2)]
        };

        setRecentEvents(prev => [newEvent, ...prev?.slice(0, 9)]);
      }, 5000);

      return () => {
        clearTimeout(connectTimer);
        clearInterval(eventTimer);
      };
    } else {
      setConnectionStatus('disconnected');
      setRecentEvents([]);
    }
  }, [isStreaming]);

  const getEventIcon = (eventType) => {
    const icons = {
      key_generation: 'Plus',
      key_rotation: 'RotateCw',
      key_revocation: 'Trash2',
      user_login: 'LogIn',
      user_logout: 'LogOut',
      policy_change: 'Settings',
      access_denied: 'Shield'
    };
    return icons?.[eventType] || 'Activity';
  };

  const getEventColor = (outcome, severity) => {
    if (severity === 'critical') return 'text-error';
    if (outcome === 'failure') return 'text-error';
    if (outcome === 'warning' || severity === 'warning') return 'text-warning';
    return 'text-success';
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      info: 'bg-primary/10 text-primary',
      warning: 'bg-warning/10 text-warning',
      critical: 'bg-error/10 text-error'
    };
    return colors?.[severity] || colors?.info;
  };

  const formatTimestamp = (timestamp) => {
    return timestamp?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-success';
      case 'connecting':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Wifi';
      case 'connecting':
        return 'Loader';
      default:
        return 'WifiOff';
    }
  };

  return (
    <div className="glass-card rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Radio" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Real-Time Event Stream</h3>
          <div className="flex items-center space-x-2">
            <Icon 
              name={getConnectionStatusIcon()} 
              size={16} 
              className={`${getConnectionStatusColor()} ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`} 
            />
            <span className={`text-sm font-medium ${getConnectionStatusColor()}`}>
              {connectionStatus?.charAt(0)?.toUpperCase() + connectionStatus?.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={notificationsEnabled ? "default" : "outline"}
            size="sm"
            onClick={onNotificationToggle}
            iconName="Bell"
            iconPosition="left"
          >
            Notifications
          </Button>
          <Button
            variant={isStreaming ? "destructive" : "default"}
            size="sm"
            onClick={onToggleStream}
            iconName={isStreaming ? "Square" : "Play"}
            iconPosition="left"
          >
            {isStreaming ? 'Stop' : 'Start'} Stream
          </Button>
        </div>
      </div>
      {/* Connection Info */}
      {isStreaming && (
        <div className="mb-4 p-3 bg-muted/20 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground">Events received:</span>
              <span className="font-medium text-foreground">{recentEvents?.length}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground">Last update:</span>
              <span className="font-medium text-foreground">
                {recentEvents?.length > 0 ? formatTimestamp(recentEvents?.[0]?.timestamp) : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Event Stream */}
      <div className="space-y-3">
        {!isStreaming && (
          <div className="text-center py-8">
            <Icon name="Radio" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">Real-Time Streaming Disabled</h4>
            <p className="text-muted-foreground mb-4">
              Start the stream to monitor security events as they happen
            </p>
            <Button
              variant="default"
              onClick={onToggleStream}
              iconName="Play"
              iconPosition="left"
            >
              Start Streaming
            </Button>
          </div>
        )}

        {isStreaming && connectionStatus === 'connecting' && (
          <div className="text-center py-8">
            <Icon name="Loader" size={48} className="text-warning mx-auto mb-4 animate-spin" />
            <h4 className="text-lg font-medium text-foreground mb-2">Connecting to Event Stream</h4>
            <p className="text-muted-foreground">Establishing secure connection...</p>
          </div>
        )}

        {isStreaming && connectionStatus === 'connected' && recentEvents?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">Monitoring Events</h4>
            <p className="text-muted-foreground">Waiting for new security events...</p>
          </div>
        )}

        {recentEvents?.map((event, index) => (
          <div 
            key={event?.id}
            className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-300 ${
              index === 0 ? 'bg-primary/5 border border-primary/20' : 'bg-muted/20'
            }`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              event?.severity === 'critical' ? 'bg-error/10' :
              event?.severity === 'warning' ? 'bg-warning/10' : 'bg-success/10'
            }`}>
              <Icon 
                name={getEventIcon(event?.eventType)} 
                size={16} 
                className={getEventColor(event?.outcome, event?.severity)}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-foreground">{event?.action}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityBadge(event?.severity)}`}>
                  {event?.severity}
                </span>
                {index === 0 && (
                  <span className="px-2 py-0.5 bg-accent/10 text-accent rounded-full text-xs font-medium animate-pulse">
                    NEW
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span>{event?.user}</span>
                <span>•</span>
                <span>{formatTimestamp(event?.timestamp)}</span>
                <span>•</span>
                <span className="capitalize">{event?.outcome}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Stream Controls */}
      {isStreaming && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">Live streaming active</span>
              </div>
              {notificationsEnabled && (
                <div className="flex items-center space-x-2">
                  <Icon name="Bell" size={14} className="text-accent" />
                  <span className="text-muted-foreground">Desktop notifications enabled</span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Export Stream
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeStream;