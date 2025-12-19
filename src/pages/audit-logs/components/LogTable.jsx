import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LogTable = ({ logs, onRowExpand, expandedRows }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });

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
      key_generation: 'bg-success/10 text-success',
      key_rotation: 'bg-warning/10 text-warning',
      key_revocation: 'bg-error/10 text-error',
      user_login: 'bg-primary/10 text-primary',
      user_logout: 'bg-muted text-muted-foreground',
      policy_change: 'bg-accent/10 text-accent',
      access_denied: 'bg-error/10 text-error',
      api_access: 'bg-secondary/10 text-secondary'
    };
    return colors?.[eventType] || 'bg-muted text-muted-foreground';
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  const isRowExpanded = (logId) => expandedRows?.includes(logId);

  return (
    <div className="glass-card rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('timestamp')}
                  className="font-medium text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  Timestamp {getSortIcon('timestamp')}
                </Button>
              </th>
              <th className="px-4 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('eventType')}
                  className="font-medium text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  Event Type {getSortIcon('eventType')}
                </Button>
              </th>
              <th className="px-4 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('user')}
                  className="font-medium text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  User {getSortIcon('user')}
                </Button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
                  Resource
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
                  IP Address
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('outcome')}
                  className="font-medium text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  Outcome {getSortIcon('outcome')}
                </Button>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs?.map((log) => (
              <React.Fragment key={log?.id}>
                <tr className="hover:bg-muted/20 transition-colors duration-150">
                  <td className="px-4 py-3 text-sm text-foreground font-mono">
                    {formatTimestamp(log?.timestamp)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(log?.eventType)}`}>
                      {log?.eventType?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {log?.user === 'system' ? 'S' : log?.user?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <span>{log?.user === 'system' ? 'System' : log?.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                    {log?.resourceId}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                    {log?.ipAddress}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      {getOutcomeIcon(log?.outcome)}
                      <span className="text-sm capitalize">{log?.outcome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRowExpand(log?.id)}
                      iconName={isRowExpanded(log?.id) ? "ChevronUp" : "ChevronDown"}
                    />
                  </td>
                </tr>
                {isRowExpanded(log?.id) && (
                  <tr>
                    <td colSpan="7" className="px-4 py-4 bg-muted/10 border-t border-border">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Event Details</h4>
                            <div className="space-y-2 text-sm">
                              <div><span className="font-medium">Action:</span> {log?.action}</div>
                              <div><span className="font-medium">Session ID:</span> {log?.sessionId}</div>
                              <div><span className="font-medium">User Agent:</span> {log?.userAgent}</div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Request Context</h4>
                            <div className="space-y-2 text-sm">
                              <div><span className="font-medium">Request ID:</span> {log?.requestId}</div>
                              <div><span className="font-medium">Duration:</span> {log?.duration}ms</div>
                              <div><span className="font-medium">Response Code:</span> {log?.responseCode}</div>
                            </div>
                          </div>
                        </div>
                        {log?.details && (
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Additional Details</h4>
                            <pre className="bg-muted/50 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                              {JSON.stringify(log?.details, null, 2)}
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
        {logs?.map((log) => (
          <div key={log?.id} className="glass-card rounded-lg border border-border p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {getOutcomeIcon(log?.outcome)}
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(log?.eventType)}`}>
                    {log?.eventType?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground">{log?.action}</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  {formatTimestamp(log?.timestamp)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRowExpand(log?.id)}
                iconName={isRowExpanded(log?.id) ? "ChevronUp" : "ChevronDown"}
              />
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">User:</span>
                <span className="text-foreground">{log?.user}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IP:</span>
                <span className="text-foreground font-mono">{log?.ipAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resource:</span>
                <span className="text-foreground font-mono">{log?.resourceId}</span>
              </div>
            </div>

            {isRowExpanded(log?.id) && (
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Session ID:</span>
                    <span className="text-foreground font-mono">{log?.sessionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="text-foreground">{log?.duration}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response:</span>
                    <span className="text-foreground">{log?.responseCode}</span>
                  </div>
                </div>
                {log?.details && (
                  <div>
                    <h5 className="text-sm font-semibold text-foreground mb-2">Details</h5>
                    <pre className="bg-muted/50 p-2 rounded text-xs font-mono overflow-x-auto">
                      {JSON.stringify(log?.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogTable;