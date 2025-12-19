import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { 
  formatShortDateTimeIST,
  formatRelativeTime, 
  formatExpiryTime,
  getRemainingTime 
} from '../../../utils/dateUtils';

const TokenCard = ({ token, onView, onRegenerate, onRevoke }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'expired':
        return 'text-error bg-error/10';
      case 'revoked':
        return 'text-muted-foreground bg-muted/50';
      default:
        return 'text-warning bg-warning/10';
    }
  };

  const getExpiryColor = (expiresAt, status, daysUntilExpiry) => {
    if (status !== 'active' || !expiresAt) return 'text-foreground';
    
    if (daysUntilExpiry !== undefined && daysUntilExpiry !== null) {
      if (daysUntilExpiry <= 0) return 'text-error';
      if (daysUntilExpiry <= 7) return 'text-warning';
      return 'text-foreground';
    }
    
    const remaining = getRemainingTime(expiresAt);
    if (remaining.text === 'Expired') return 'text-error';
    if (remaining.days !== null && remaining.days <= 7) return 'text-warning';
    return 'text-foreground';
  };

  // Calculate success rate color
  const getSuccessRateColor = (rate) => {
    if (rate >= 99) return 'text-success';
    if (rate >= 95) return 'text-warning';
    return 'text-error';
  };

  // Calculate response time color
  const getResponseTimeColor = (time) => {
    if (time < 100) return 'text-success';
    if (time < 200) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="glass-card rounded-lg border border-border p-4 hover:shadow-orbital-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Key" size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {token?.name}
                </h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(token?.status)}`}>
                  {token?.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-1">
                {token?.description || 'No description'}
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-shrink-0 ml-2"
          title={isExpanded ? "Collapse details" : "Expand details"}
        >
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={16} 
          />
        </Button>
      </div>

      {/* Token Preview */}
      <div className="mb-3">
        <div className="text-xs text-muted-foreground mb-1">Token Preview</div>
        <div className="p-2 bg-muted/30 rounded text-xs font-mono text-foreground truncate">
          {token?.tokenPreview}...
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
        <div>
          <div className="text-muted-foreground">Created (IST)</div>
          <div className="text-foreground font-medium mt-1">
            {formatShortDateTimeIST(token?.createdAt)}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">Last Used</div>
          <div className="text-foreground font-medium mt-1">
            {formatRelativeTime(token?.lastUsed)}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">Expires</div>
          <div className={`font-medium mt-1 ${getExpiryColor(token?.expiresAt, token?.status, token?.daysUntilExpiry)}`}>
            {formatExpiryTime(token?.expiresAt, token?.expiresIn, token?.daysUntilExpiry)}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">API Calls</div>
          <div className="text-foreground font-medium mt-1">
            {token?.apiCalls?.toLocaleString() || '0'}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {token?.apiCalls > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
          <div>
            <div className="text-muted-foreground">Success Rate</div>
            <div className={`font-medium mt-1 ${getSuccessRateColor(token?.successRate || 100)}`}>
              {(token?.successRate || 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Avg Response</div>
            <div className={`font-medium mt-1 ${getResponseTimeColor(token?.avgResponseTime || 145)}`}>
              {token?.avgResponseTime || 145}ms
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-3">
        <Button
          variant="outline"
          size="xs"
          onClick={() => onView(token)}
          iconName="Eye"
          iconPosition="left"
          iconSize={14}
        >
          View
        </Button>
        {token?.status === 'active' && (
          <Button
            variant="outline"
            size="xs"
            onClick={() => onRegenerate(token)}
            iconName="RefreshCw"
            iconPosition="left"
            iconSize={14}
          >
            Regenerate
          </Button>
        )}
        <Button
          variant="destructive"
          size="xs"
          onClick={() => onRevoke(token)}
          iconName="Trash2"
          iconPosition="left"
          iconSize={14}
        >
          Revoke
        </Button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border pt-3 space-y-3">
          {/* Permissions */}
          {token?.permissions && token?.permissions?.length > 0 && (
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-2">Permissions</div>
              <div className="flex flex-wrap gap-1">
                {token?.permissions?.map((permission, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-primary/10 text-primary"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* IP Restrictions */}
          {token?.ipRestrictions && token?.ipRestrictions?.length > 0 && (
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-2">IP Restrictions</div>
              <div className="flex flex-wrap gap-1">
                {token?.ipRestrictions?.map((ip, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-secondary/10 text-secondary"
                  >
                    {ip}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Token only works from these IP addresses
              </p>
            </div>
          )}

          {/* Rate Limit */}
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Rate Limit</div>
            <div className="text-foreground text-xs">
              {token?.rateLimit?.toLocaleString() || '1000'} requests/hour
              {token?.hourlyUsage > 0 && (
                <div className="mt-1 w-full bg-muted/30 rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2" 
                    style={{ 
                      width: `${Math.min(((token?.hourlyUsage || 0) / (token?.rateLimit || 1000)) * 100, 100)}%` 
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Performance Details */}
          {token?.apiCalls > 0 && (
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-2">Performance</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                  <div className={`text-sm font-medium mt-1 ${getSuccessRateColor(token?.successRate || 100)}`}>
                    {(token?.successRate || 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Avg Response</div>
                  <div className={`text-sm font-medium mt-1 ${getResponseTimeColor(token?.avgResponseTime || 145)}`}>
                    {token?.avgResponseTime || 145}ms
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Peak Hour</div>
                  <div className="text-sm font-medium mt-1">
                    {token?.peakHourCalls || 0} calls
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Hourly Usage</div>
                  <div className="text-sm font-medium mt-1">
                    {token?.hourlyUsage || 0} calls
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Created Date Full */}
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Created At (IST)</div>
            <div className="text-foreground text-xs">
              {formatShortDateTimeIST(token?.createdAt)}
            </div>
          </div>

          {/* Expiry Details */}
          {token?.expiresAt && (
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1">Expires At (IST)</div>
              <div className="text-foreground text-xs">
                {formatShortDateTimeIST(token?.expiresAt)}
              </div>
              {token?.status === 'active' && (
                <div className="mt-2">
                  <div className="text-xs text-muted-foreground mb-1">Time Remaining</div>
                  <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    token?.daysUntilExpiry <= 0 ? 'bg-error/10 text-error' :
                    token?.daysUntilExpiry <= 7 ? 'bg-warning/10 text-warning' :
                    'bg-success/10 text-success'
                  }`}>
                    {token?.expiresIn || formatExpiryTime(token?.expiresAt, null, token?.daysUntilExpiry)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TokenCard;