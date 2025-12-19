import React from 'react';
import Icon from '../../../components/AppIcon';

const UserFilters = ({ filters, onFilterChange }) => {
  const handleFilterUpdate = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      role: '',
      status: '',
      department: '',
      activity: '',
      search: ''
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
        <h3 className="text-lg font-medium text-foreground">Filter Users</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <Icon name="X" size={16} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Search Users
          </label>
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={filters?.search}
              onChange={(e) => handleFilterUpdate('search', e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
            />
          </div>
        </div>

        {/* Role Filter */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Role
          </label>
          <select
            value={filters?.role}
            onChange={(e) => handleFilterUpdate('role', e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
          >
            <option value="">All Roles</option>
            <option value="Administrator">Administrator</option>
            <option value="Manager">Manager</option>
            <option value="Developer">Developer</option>
            <option value="Auditor">Auditor</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Status
          </label>
          <select
            value={filters?.status}
            onChange={(e) => handleFilterUpdate('status', e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Department
          </label>
          <select
            value={filters?.department}
            onChange={(e) => handleFilterUpdate('department', e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
          >
            <option value="">All Departments</option>
            <option value="Security">Security</option>
            <option value="Engineering">Engineering</option>
            <option value="Operations">Operations</option>
            <option value="Compliance">Compliance</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
      </div>

      {/* Active Filter Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters?.search && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary">
              Search: "{filters?.search}"
              <button
                onClick={() => handleFilterUpdate('search', '')}
                className="ml-1.5 hover:text-primary/70"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          {filters?.role && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary">
              Role: {filters?.role}
              <button
                onClick={() => handleFilterUpdate('role', '')}
                className="ml-1.5 hover:text-primary/70"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          {filters?.status && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary">
              Status: {filters?.status}
              <button
                onClick={() => handleFilterUpdate('status', '')}
                className="ml-1.5 hover:text-primary/70"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          {filters?.department && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary">
              Department: {filters?.department}
              <button
                onClick={() => handleFilterUpdate('department', '')}
                className="ml-1.5 hover:text-primary/70"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default UserFilters;