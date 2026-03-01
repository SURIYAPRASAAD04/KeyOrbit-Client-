import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RealTimeStream = ({ 
  events, 
  isStreaming, 
  onToggleStream, 
  onNotificationToggle, 
  notificationsEnabled 
}) => {
  const getEventIcon = (eventType) => {
    const icons = {
      KEY_GENERATED: 'Plus',
      KEY_ROTATED: 'RotateCw',
      KEY_REVOKED: 'Trash2',
      KEY_DELETED: 'Trash2',
      USER_LOGIN: 'LogIn',
      USER_LOGOUT: 'LogOut',
      USER_INVITED: 'UserPlus',
      PASSWORD_CHANGE: 'Key',
      MFA_ENABLED: 'Shield',
      MFA_DISABLED: 'Shield',
      API_TOKEN_CREATED: 'Key',
      API_TOKEN_REVOKED: 'XCircle',
      POLICY_CREATED: 'FilePlus',
      POLICY_UPDATED: 'Edit',
      POLICY_DELETED: 'FileMinus',
      ACCESS_DENIED: 'Shield'
    };
    return icons[eventType] || 'Activity';
  };

  const getEventColor = (outcome, severity) => {
    if (severity === 'critical') return 'text-error';
    if (outcome === 'failure') return 'text-error';
    if (outcome === 'warning' || severity === 'warning') return 'text-warning';
    return 'text-success';
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      critical: 'bg-error/10 text-error border border-error/20',
      warning: 'bg-warning/10 text-warning border border-warning/20',
      info: 'bg-primary/10 text-primary border border-primary/20'
    };
    return colors[severity] || colors.info;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getConnectionStatusColor = () => {
    return isStreaming ? 'text-success' : 'text-muted-foreground';
  };

  const getConnectionStatusIcon = () => {
    return isStreaming ? 'Wifi' : 'WifiOff';
  };

  return (
    <div className="glass-card rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`${getConnectionStatusColor()} transition-colors duration-300`}>
            <Icon name={getConnectionStatusIcon()} size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Real-Time Event Stream</h3>
            <p className="text-sm text-muted-foreground">
              {isStreaming ? 'Live - Streaming events' : 'Stream paused'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onNotificationToggle}
          >
            <Icon 
              name={notificationsEnabled ? "Bell" : "BellOff"} 
              size={16} 
              className="mr-2" 
            />
            {notificationsEnabled ? 'Notifications On' : 'Notifications Off'}
          </Button>
          
          <Button
            variant={isStreaming ? 'destructive' : 'default'}
            size="sm"
            onClick={onToggleStream}
          >
            <Icon 
              name={isStreaming ? "Square" : "Play"} 
              size={16} 
              className="mr-2" 
            />
            {isStreaming ? 'Stop Stream' : 'Start Stream'}
          </Button>
        </div>
      </div>

      {/* Event Stream */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Activity" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No Events</h4>
            <p className="text-muted-foreground">
              {isStreaming 
                ? 'Waiting for events...' 
                : 'Start the stream to see real-time events'}
            </p>
          </div>
        ) : (
          events.map((event, index) => (
            <div
              key={event.id || index}
              className="flex items-start space-x-3 p-3 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors duration-150"
            >
              {/* Icon */}
              <div className={`mt-1 ${getEventColor(event.outcome, event.severity)}`}>
                <Icon name={getEventIcon(event.event_type)} size={18} />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-mono text-muted-foreground">
                    {formatTimestamp(event.timestamp)}
                  </span>
                  {event.severity === 'critical' && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getSeverityBadge('critical')}`}>
                      CRITICAL
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-foreground font-medium">
                  {event.action || event.event_type_display}
                </p>
                
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {event.user}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className={`text-xs capitalize ${getEventColor(event.outcome, event.severity)}`}>
                    {event.outcome}
                  </span>
                </div>
              </div>
              
              {/* Animated dot for new events */}
              {index === 0 && isStreaming && (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            Showing {events.length} most recent events
          </div>
          {isStreaming && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-success">Live</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeStream;