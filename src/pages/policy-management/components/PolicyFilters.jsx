import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PolicyFilters = ({ filters, onFiltersChange, policiesCount }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Policies</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Filter" size={16} />
          <span>{policiesCount} policies found</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Icon 
            name="Search" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            type="text"
            placeholder="Search policies..."
            value={filters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="pl-10"
          />
        </div>

        {/* Policy Type Filter */}
        <Select
          value={filters?.type}
          onValueChange={(value) => handleFilterChange('type', value)}
        >
          <option value="all">All Types</option>
          <option value="compliance">Compliance</option>
          <option value="healthcare">Healthcare</option>
          <option value="privacy">Privacy</option>
          <option value="development">Development</option>
          <option value="security">Security</option>
        </Select>

        {/* Status Filter */}
        <Select
          value={filters?.status}
          onValueChange={(value) => handleFilterChange('status', value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="inactive">Inactive</option>
        </Select>

        {/* Scope Filter */}
        <Select
          value={filters?.scope}
          onValueChange={(value) => handleFilterChange('scope', value)}
        >
          <option value="all">All Scopes</option>
          <option value="organization">Organization</option>
          <option value="department">Department</option>
          <option value="global">Global</option>
        </Select>
      </div>
    </div>
  );
};

export default PolicyFilters;