import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { 
  formatDateForTable, 
  formatRelativeTime, 
  formatExpiryTime,
  getTimezoneInfo 
} from '../../../utils/dateUtils';

const TokenTable = ({ tokens, onView, onRegenerate, onRevoke }) => {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showTimezoneInfo, setShowTimezoneInfo] = useState(false);
  
  const timezoneInfo = getTimezoneInfo();

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTokens = [...tokens]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === 'createdAt' || sortField === 'lastUsed' || sortField === 'expiresAt') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

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

  const SortHeader = ({ field, children }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors duration-150"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <div className="flex flex-col">
          <Icon
            name="ChevronUp"
            size={12}
            className={`${
              sortField === field && sortDirection === 'asc' ?'text-primary' :'text-muted-foreground/50'
            }`}
          />
          <Icon
            name="ChevronDown"
            size={12}
            className={`-mt-1 ${
              sortField === field && sortDirection === 'desc' ?'text-primary' :'text-muted-foreground/50'
            }`}
          />
        </div>
      </div>
    </th>
  );

  return (
    <div className="glass-card rounded-lg border border-border overflow-hidden">
      {/* Timezone Info Banner */}
      {showTimezoneInfo && (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Globe" size={12} />
            <span>All times displayed in your local timezone: {timezoneInfo.timezone} ({timezoneInfo.offset})</span>
          </div>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setShowTimezoneInfo(false)}
            className="h-6 w-6"
          >
            <Icon name="X" size={12} />
          </Button>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th colSpan="8" className="px-6 py-2 text-left text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>Times displayed in {timezoneInfo.offset}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setShowTimezoneInfo(!showTimezoneInfo)}
                    className="h-6 px-2 text-xs"
                  >
                    {showTimezoneInfo ? 'Hide Timezone' : 'Show Timezone'}
                  </Button>
                </div>
              </th>
            </tr>
            <tr>
              <SortHeader field="name">Token Name</SortHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Permissions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <SortHeader field="createdAt">Created</SortHeader>
              <SortHeader field="lastUsed">Last Used</SortHeader>
              <SortHeader field="expiresAt">Expires In</SortHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                API Calls
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedTokens?.map((token) => (
              <tr
                key={token?.id}
                className="hover:bg-muted/20 transition-colors duration-150"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                      <Icon name="Key" size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {token?.name}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {token?.tokenPreview}...
                      </div>
                      {token?.description && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {token.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {token?.permissions?.slice(0, 2)?.map((permission, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-secondary/10 text-secondary"
                      >
                        {permission}
                      </span>
                    ))}
                    {token?.permissions?.length > 2 && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-muted/50 text-muted-foreground">
                        +{token?.permissions?.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(token?.status)}`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      token?.status === 'active' ? 'bg-success' :
                      token?.status === 'expired' ? 'bg-error' :
                      token?.status === 'revoked' ? 'bg-muted-foreground' : 'bg-warning'
                    }`} />
                    {token?.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {formatDateForTable(token?.createdAtIST || token?.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {formatRelativeTime(token?.lastUsed)}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {formatExpiryTime(token?.expiresAt, token?.expiresIn, token?.daysUntilExpiry)}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {token?.apiCalls?.toLocaleString() || '0'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(token)}
                      className="h-8 w-8"
                      title="View token details"
                    >
                      <Icon name="Eye" size={14} />
                    </Button>
                    {token?.status === 'active' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRegenerate(token)}
                        className="h-8 w-8"
                        title="Regenerate token"
                      >
                        <Icon name="RefreshCw" size={14} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRevoke(token)}
                      className="h-8 w-8 text-error hover:text-error hover:bg-error/10"
                      title="Revoke token"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TokenTable;