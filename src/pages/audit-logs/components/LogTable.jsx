import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LogTable = ({ logs, onRowExpand, expandedRows, isLoading }) => {
  const getOutcomeIcon = (outcome) => {
    switch (outcome) {
      case 'success':
        return <Icon name="CheckCircle" size={16} className="text-success" />;
      case 'failure':
        return <Icon name="XCircle" size={16} className="text-error" />;
      case 'warning':
        return <Icon name="AlertTriangle" size={16} className="text-warning" />;
      default:
        return <Icon name="Info" size={16} className="text-muted-foreground" />;
    }
  };

  const getEventTypeColor = (eventType) => {
    const colors = {
      KEY_GENERATED: 'bg-success/10 text-success',
      KEY_ROTATED: 'bg-warning/10 text-warning',
      KEY_REVOKED: 'bg-error/10 text-error',
      KEY_DELETED: 'bg-error/10 text-error',
      KEY_ENCAPSULATE: 'bg-primary/10 text-primary',
      KEY_DECAPSULATE: 'bg-primary/10 text-primary',
      KEY_SIGN: 'bg-accent/10 text-accent',
      KEY_VERIFY: 'bg-accent/10 text-accent',
      USER_LOGIN: 'bg-primary/10 text-primary',
      USER_LOGOUT: 'bg-muted text-muted-foreground',
      USER_INVITED: 'bg-secondary/10 text-secondary',
      USER_UPDATED: 'bg-info/10 text-info',
      USER_DELETED: 'bg-error/10 text-error',
      PASSWORD_CHANGE: 'bg-warning/10 text-warning',
      MFA_ENABLED: 'bg-success/10 text-success',
      MFA_DISABLED: 'bg-warning/10 text-warning',
      API_TOKEN_CREATED: 'bg-accent/10 text-accent',
      API_TOKEN_REVOKED: 'bg-error/10 text-error',
      POLICY_CREATED: 'bg-primary/10 text-primary',
      POLICY_UPDATED: 'bg-info/10 text-info',
      POLICY_DELETED: 'bg-error/10 text-error',
      ACCESS_DENIED: 'bg-error/10 text-error'
    };
    
    const color = colors[eventType];
    return color || 'bg-muted text-muted-foreground';
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
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const isRowExpanded = (logId) => expandedRows?.includes(logId);

  if (isLoading) {
    return (
      <div className="glass-card rounded-lg border border-border p-12">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="glass-card rounded-lg border border-border p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <Icon name="FileText" size={48} className="text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No logs found</h3>
          <p className="text-muted-foreground max-w-md">
            No audit logs match your current filters. Try adjusting your search criteria or clearing the filters.
          </p>
          <Button variant="outline" className="mt-4">
            <Icon name="RotateCcw" size={16} className="mr-2" />
            Reset Filters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <span className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
                  Timestamp
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
                  Event Type
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
                  User
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
                  Action
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
                  IP Address
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
                  Outcome
                </span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
                  Details
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((log) => (
              <React.Fragment key={log.id}>
                <tr className="hover:bg-muted/20 transition-colors duration-150">
                  <td className="px-4 py-3 text-sm text-foreground font-mono whitespace-nowrap">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(log.event_type)}`}>
                      {log.event_type_display}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {log.user_initials || log.user?.charAt(0)?.toUpperCase() || 'S'}
                        </span>
                      </div>
                      <span className="text-sm text-foreground">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">{log.action}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                    {log.ip_address || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      {getOutcomeIcon(log.outcome)}
                      <span className="text-sm capitalize">{log.outcome}</span>
                      {log.severity === 'critical' && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getSeverityBadge('critical')}`}>
                          CRITICAL
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRowExpand(log.id)}
                    >
                      <Icon name={isRowExpanded(log.id) ? "ChevronUp" : "ChevronDown"} size={16} />
                    </Button>
                  </td>
                </tr>
                
                {isRowExpanded(log.id) && (
                  <tr className="bg-muted/10">
                    <td colSpan="7" className="px-4 py-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Event Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Event ID:</span>
                                <span className="text-foreground font-mono">{log.id}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Event Type:</span>
                                <span className="text-foreground">{log.event_type}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Timestamp:</span>
                                <span className="text-foreground">{formatTimestamp(log.timestamp)}</span>
                              </div>
                              {log.resource_id && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Resource ID:</span>
                                  <span className="text-foreground font-mono">{log.resource_id}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">User & Location</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">User:</span>
                                <span className="text-foreground">{log.user}</span>
                              </div>
                              {log.user_email && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Email:</span>
                                  <span className="text-foreground">{log.user_email}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">IP Address:</span>
                                <span className="text-foreground font-mono">{log.ip_address || '-'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">User Agent:</span>
                                <span className="text-foreground text-xs">{log.user_agent || '-'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Additional Info</h4>
                            <div className="space-y-2 text-sm">
                              {log.session_id && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Session ID:</span>
                                  <span className="text-foreground font-mono">{log.session_id}</span>
                                </div>
                              )}
                              {log.request_id && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Request ID:</span>
                                  <span className="text-foreground font-mono">{log.request_id}</span>
                                </div>
                              )}
                              {log.duration && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Duration:</span>
                                  <span className="text-foreground">{log.duration}ms</span>
                                </div>
                              )}
                              {log.response_code && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Response Code:</span>
                                  <span className="text-foreground">{log.response_code}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {log.details && Object.keys(log.details).length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Metadata</h4>
                            <pre className="bg-muted/50 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-4 p-4">
        {logs.map((log) => {
          const isExpanded = isRowExpanded(log.id);
          
          return (
            <div
              key={log.id}
              className={`glass-card rounded-lg border border-border p-4 ${
                isExpanded ? 'ring-2 ring-primary/20' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getOutcomeIcon(log.outcome)}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(log.event_type)}`}>
                      {log.event_type_display}
                    </span>
                    {log.severity === 'critical' && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getSeverityBadge('critical')}`}>
                        CRITICAL
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm font-medium text-foreground">{log.action}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    {formatTimestamp(log.timestamp)}
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRowExpand(log.id)}
                >
                  <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
                </Button>
              </div>

              {/* Basic Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User:</span>
                  <span className="text-foreground flex items-center">
                    <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mr-1">
                      <span className="text-xs font-medium text-primary">
                        {log.user_initials || log.user?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    {log.user}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IP:</span>
                  <span className="text-foreground font-mono">{log.ip_address || '-'}</span>
                </div>
                
                {log.resource_id && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resource:</span>
                    <span className="text-foreground font-mono">{log.resource_id}</span>
                  </div>
                )}
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground block">Event ID:</span>
                      <span className="text-foreground font-mono text-xs">{log.id}</span>
                    </div>
                    
                    {log.user_email && (
                      <div>
                        <span className="text-muted-foreground block">Email:</span>
                        <span className="text-foreground text-xs">{log.user_email}</span>
                      </div>
                    )}
                    
                    {log.session_id && (
                      <div>
                        <span className="text-muted-foreground block">Session:</span>
                        <span className="text-foreground font-mono text-xs">{log.session_id}</span>
                      </div>
                    )}
                    
                    {log.duration && (
                      <div>
                        <span className="text-muted-foreground block">Duration:</span>
                        <span className="text-foreground">{log.duration}ms</span>
                      </div>
                    )}
                  </div>
                  
                  {log.user_agent && (
                    <div>
                      <span className="text-muted-foreground text-sm block">User Agent:</span>
                      <span className="text-foreground text-xs">{log.user_agent}</span>
                    </div>
                  )}
                  
                  {log.details && Object.keys(log.details).length > 0 && (
                    <div>
                      <span className="text-muted-foreground text-sm block mb-1">Metadata:</span>
                      <pre className="bg-muted/50 p-2 rounded text-xs font-mono overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LogTable;