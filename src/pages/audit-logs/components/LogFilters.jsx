import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const LogFilters = ({ filters, onFiltersChange, onExport, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const eventTypeOptions = [
    { value: 'all', label: 'All Events' },
    { value: 'key_generation', label: 'Key Generation' },
    { value: 'key_rotation', label: 'Key Rotation' },
    { value: 'key_revocation', label: 'Key Revocation' },
    { value: 'user_login', label: 'User Login' },
    { value: 'user_logout', label: 'User Logout' },
    { value: 'policy_change', label: 'Policy Change' },
    { value: 'access_denied', label: 'Access Denied' },
    { value: 'api_access', label: 'API Access' }
  ];

  const outcomeOptions = [
    { value: 'all', label: 'All Outcomes' },
    { value: 'success', label: 'Success' },
    { value: 'failure', label: 'Failure' },
    { value: 'warning', label: 'Warning' }
  ];

  const userOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'john.doe@company.com', label: 'John Doe' },
    { value: 'sarah.wilson@company.com', label: 'Sarah Wilson' },
    { value: 'mike.chen@company.com', label: 'Mike Chen' },
    { value: 'system', label: 'System' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const exportOptions = [
    { value: 'csv', label: 'Export as CSV' },
    { value: 'json', label: 'Export as JSON' },
    { value: 'pdf', label: 'Export as PDF' }
  ];

  return (
    <div className="glass-card rounded-lg border border-border p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Audit Log Filters</h3>
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
            {filters?.resultCount || 0} results
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {isExpanded ? 'Collapse' : 'Expand'} Filters
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Clear All
          </Button>
        </div>
      </div>
      {/* Quick Search */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search across all log fields (supports regex)..."
          value={filters?.search || ''}
          onChange={(e) => handleFilterChange('search', e?.target?.value)}
          className="w-full"
        />
      </div>
      {/* Expandable Filters */}
      {isExpanded && (
        <div className="space-y-4 border-t border-border pt-4">
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="datetime-local"
              label="Start Date"
              value={filters?.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
            />
            <Input
              type="datetime-local"
              label="End Date"
              value={filters?.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
            />
          </div>

          {/* Filter Selects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Event Type"
              options={eventTypeOptions}
              value={filters?.eventType || 'all'}
              onChange={(value) => handleFilterChange('eventType', value)}
              searchable
            />
            <Select
              label="User"
              options={userOptions}
              value={filters?.user || 'all'}
              onChange={(value) => handleFilterChange('user', value)}
              searchable
            />
            <Select
              label="Outcome"
              options={outcomeOptions}
              value={filters?.outcome || 'all'}
              onChange={(value) => handleFilterChange('outcome', value)}
            />
          </div>

          {/* IP Address Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              label="IP Address"
              placeholder="e.g., 192.168.1.100 or 192.168.1.*"
              value={filters?.ipAddress || ''}
              onChange={(e) => handleFilterChange('ipAddress', e?.target?.value)}
            />
            <Input
              type="text"
              label="Resource ID"
              placeholder="Filter by specific resource"
              value={filters?.resourceId || ''}
              onChange={(e) => handleFilterChange('resourceId', e?.target?.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <Button
                variant="default"
                size="sm"
                iconName="Search"
                iconPosition="left"
              >
                Apply Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Save"
                iconPosition="left"
              >
                Save Filter Set
              </Button>
            </div>
            <Select
              placeholder="Export Options"
              options={exportOptions}
              value=""
              onChange={onExport}
              className="w-48"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LogFilters;