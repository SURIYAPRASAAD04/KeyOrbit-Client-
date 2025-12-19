import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TokenFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  resultCount 
}) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const permissionOptions = [
    'key:read',
    'key:write',
    'key:delete',
    'key:rotate',
    'audit:read',
    'admin:all'
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
    { value: 'revoked', label: 'Revoked' }
  ];

  const usageOptions = [
    { value: '', label: 'All Usage' },
    { value: 'recent', label: 'Used Recently' },
    { value: 'unused', label: 'Never Used' },
    { value: 'inactive', label: 'Inactive (30+ days)' }
  ];

  const hasActiveFilters = Object.values(filters)?.some(value => 
    Array.isArray(value) ? value?.length > 0 : value !== ''
  );

  return (
    <div className="glass-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
          {resultCount !== undefined && (
            <span className="text-sm text-muted-foreground">
              ({resultCount} {resultCount === 1 ? 'token' : 'tokens'})
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
            iconSize={14}
          >
            Clear All
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <Input
            type="search"
            placeholder="Search tokens..."
            value={filters?.search || ''}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters?.status || ''}
            onChange={(e) => handleFilterChange('status', e?.target?.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {statusOptions?.map((option) => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Usage Filter */}
        <div>
          <select
            value={filters?.usage || ''}
            onChange={(e) => handleFilterChange('usage', e?.target?.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {usageOptions?.map((option) => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Expiration Filter */}
        <div>
          <select
            value={filters?.expiration || ''}
            onChange={(e) => handleFilterChange('expiration', e?.target?.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">All Expiration</option>
            <option value="expiring">Expiring Soon</option>
            <option value="expired">Expired</option>
            <option value="never">Never Expires</option>
          </select>
        </div>
      </div>
      {/* Permission Filters */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          Permissions
        </label>
        <div className="flex flex-wrap gap-2">
          {permissionOptions?.map((permission) => (
            <button
              key={permission}
              onClick={() => {
                const currentPermissions = filters?.permissions || [];
                const newPermissions = currentPermissions?.includes(permission)
                  ? currentPermissions?.filter(p => p !== permission)
                  : [...currentPermissions, permission];
                handleFilterChange('permissions', newPermissions);
              }}
              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                (filters?.permissions || [])?.includes(permission)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              {permission}
              {(filters?.permissions || [])?.includes(permission) && (
                <Icon name="X" size={14} className="ml-1" />
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Filter" size={14} />
            <span>Active filters:</span>
            <div className="flex flex-wrap gap-1">
              {filters?.search && (
                <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                  Search: "{filters?.search}"
                </span>
              )}
              {filters?.status && (
                <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                  Status: {filters?.status}
                </span>
              )}
              {filters?.usage && (
                <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                  Usage: {filters?.usage}
                </span>
              )}
              {filters?.expiration && (
                <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                  Expiration: {filters?.expiration}
                </span>
              )}
              {(filters?.permissions || [])?.map((permission) => (
                <span
                  key={permission}
                  className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                >
                  {permission}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenFilters;