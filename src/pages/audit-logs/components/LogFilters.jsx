import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const LogFilters = ({ 
  filters, 
  onFiltersChange, 
  onApplyFilters,
  onExport, 
  onClearFilters,
  filterOptions,
  isLoading 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Prepare event type options
  const eventTypeOptions = [
    { value: 'all', label: 'All Events' },
    ...(filterOptions?.event_types || []).map(type => ({
      value: type,
      label: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }))
  ];

  // Prepare user options
  const userOptions = [
    { value: 'all', label: 'All Users' },
    ...(filterOptions?.users || []).map(user => ({
      value: user.id,
      label: user.name
    }))
  ];

  const outcomeOptions = [
    { value: 'all', label: 'All Outcomes' },
    { value: 'success', label: 'Success' },
    { value: 'failure', label: 'Failure' },
    { value: 'warning', label: 'Warning' }
  ];

  const exportOptions = [
    { value: 'csv', label: 'Export as CSV' },
    { value: 'json', label: 'Export as JSON' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleDateChange = (field, value) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const handleSearch = (e) => {
    handleFilterChange('search', e.target.value);
  };

  return (
    <div className="glass-card rounded-lg border border-border p-6">
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
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} className="mr-2" />
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            disabled={isLoading}
          >
            <Icon name="X" size={16} className="mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Search Bar - Always Visible */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search logs by IP, user agent, or metadata..."
          value={filters?.search || ''}
          onChange={handleSearch}
          className="w-full"
          leftIcon="Search"
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
              onChange={(e) => handleDateChange('startDate', e.target.value)}
            />
            <Input
              type="datetime-local"
              label="End Date"
              value={filters?.endDate || ''}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
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
              value={filters?.userId || 'all'}
              onChange={(value) => handleFilterChange('userId', value)}
              searchable
            />
            
            <Select
              label="Outcome"
              options={outcomeOptions}
              value={filters?.outcome || 'all'}
              onChange={(value) => handleFilterChange('outcome', value)}
            />
          </div>

          {/* IP Address and Resource ID Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              label="IP Address"
              placeholder="e.g., 192.168.1.100"
              value={filters?.ipAddress || ''}
              onChange={(e) => handleFilterChange('ipAddress', e.target.value)}
              leftIcon="Globe"
            />
            <Input
              type="text"
              label="Resource ID"
              placeholder="Filter by specific resource"
              value={filters?.resourceId || ''}
              onChange={(e) => handleFilterChange('resourceId', e.target.value)}
              leftIcon="Hash"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={onApplyFilters}
                loading={isLoading}
              >
                <Icon name="Search" size={16} className="mr-2" />
                Apply Filters
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log('Save filter set')}
              >
                <Icon name="Save" size={16} className="mr-2" />
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