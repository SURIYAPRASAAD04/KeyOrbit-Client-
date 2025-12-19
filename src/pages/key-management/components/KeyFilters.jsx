import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const KeyFilters = ({ filters, onFiltersChange, totalKeys, filteredKeys }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const algorithmOptions = [
    { value: '', label: 'All Algorithms' },
    { value: 'aes-256', label: 'AES-256' },
    { value: 'rsa-2048', label: 'RSA-2048' },
    { value: 'rsa-4096', label: 'RSA-4096' },
    { value: 'kyber-512', label: 'Kyber-512' },
    { value: 'kyber-768', label: 'Kyber-768' },
    { value: 'dilithium-2', label: 'Dilithium-2' },
    { value: 'dilithium-3', label: 'Dilithium-3' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
    { value: 'revoked', label: 'Revoked' },
    { value: 'pending', label: 'Pending' }
  ];

  const purposeOptions = [
    { value: '', label: 'All Purposes' },
    { value: 'encryption', label: 'Data Encryption' },
    { value: 'signing', label: 'Digital Signing' },
    { value: 'authentication', label: 'Authentication' },
    { value: 'key-exchange', label: 'Key Exchange' }
  ];

  const handleFilterChange = (field, value) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      algorithm: '',
      status: '',
      purpose: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="glass-card rounded-lg border border-border p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Filter Keys</h3>
            <p className="text-sm text-muted-foreground">
              Showing {filteredKeys} of {totalKeys} keys
            </p>
          </div>
          {hasActiveFilters && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-sm text-accent font-medium">Filters Active</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <Icon name="X" size={16} className="mr-2" />
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} className="mr-2" />
            {isExpanded ? 'Less' : 'More'} Filters
          </Button>
        </div>
      </div>
      {/* Search Bar - Always Visible */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search keys by name, ID, or description..."
          value={filters?.search}
          onChange={(e) => handleFilterChange('search', e?.target?.value)}
          className="w-full"
        />
      </div>
      {/* Advanced Filters */}
      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Algorithm"
            options={algorithmOptions}
            value={filters?.algorithm}
            onChange={(value) => handleFilterChange('algorithm', value)}
            placeholder="All Algorithms"
          />
          
          <Select
            label="Status"
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleFilterChange('status', value)}
            placeholder="All Statuses"
          />
          
          <Select
            label="Purpose"
            options={purposeOptions}
            value={filters?.purpose}
            onChange={(value) => handleFilterChange('purpose', value)}
            placeholder="All Purposes"
          />
          
          <div className="flex items-end">
            <Button variant="outline" className="w-full" onClick={() => setIsExpanded(!isExpanded)}>
              <Icon name="Filter" size={16} className="mr-2" />
              Advanced
            </Button>
          </div>
        </div>

        {/* Date Range Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
          <Input
            label="Created From"
            type="date"
            value={filters?.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
          />
          
          <Input
            label="Created To"
            type="date"
            value={filters?.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
          />
        </div>

        {/* Quick Filter Tags */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground mr-2">Quick filters:</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFilterChange('status', 'active')}
            className={filters?.status === 'active' ? 'bg-success/10 text-success' : ''}
          >
            Active Keys
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFilterChange('status', 'expired')}
            className={filters?.status === 'expired' ? 'bg-warning/10 text-warning' : ''}
          >
            Expired
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFilterChange('algorithm', 'kyber-512')}
            className={filters?.algorithm === 'kyber-512' ? 'bg-accent/10 text-accent' : ''}
          >
            Post-Quantum
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KeyFilters;