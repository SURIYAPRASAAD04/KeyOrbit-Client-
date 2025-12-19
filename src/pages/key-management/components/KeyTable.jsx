import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const KeyTable = ({ keys, selectedKeys, onSelectionChange, onKeyAction }) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success text-success-foreground', icon: 'CheckCircle' },
      expired: { color: 'bg-warning text-warning-foreground', icon: 'AlertTriangle' },
      revoked: { color: 'bg-error text-error-foreground', icon: 'XCircle' },
      pending: { color: 'bg-muted text-muted-foreground', icon: 'Clock' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;

    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} className="mr-1" />
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </div>
    );
  };

  const getAlgorithmBadge = (algorithm) => {
    const isQuantumResistant = algorithm?.toLowerCase()?.includes('kyber') || algorithm?.toLowerCase()?.includes('dilithium');
    
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isQuantumResistant 
          ? 'bg-accent/10 text-accent border border-accent/20' :'bg-primary/10 text-primary border border-primary/20'
      }`}>
        {isQuantumResistant && <Icon name="Shield" size={12} className="mr-1" />}
        {algorithm}
      </div>
    );
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(new Date(date));
  };

  const getDaysUntilExpiration = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(keys?.map(key => key?.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectKey = (keyId, checked) => {
    if (checked) {
      onSelectionChange([...selectedKeys, keyId]);
    } else {
      onSelectionChange(selectedKeys?.filter(id => id !== keyId));
    }
  };

  const handleViewDetails = (keyId) => {
    navigate('/key-details', { state: { keyId } });
  };

  const sortedKeys = [...keys]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === 'createdAt' || sortField === 'expiresAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const isAllSelected = keys?.length > 0 && selectedKeys?.length === keys?.length;
  const isPartiallySelected = selectedKeys?.length > 0 && selectedKeys?.length < keys?.length;

  return (
    <div className="glass-card rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isPartiallySelected}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th 
                className="cursor-pointer hover:bg-muted/30 transition-colors duration-150"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-2">
                  <span>Key Name</span>
                  {sortField === 'name' && (
                    <Icon name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} />
                  )}
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-muted/30 transition-colors duration-150"
                onClick={() => handleSort('algorithm')}
              >
                <div className="flex items-center space-x-2">
                  <span>Algorithm</span>
                  {sortField === 'algorithm' && (
                    <Icon name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} />
                  )}
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-muted/30 transition-colors duration-150"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-2">
                  <span>Status</span>
                  {sortField === 'status' && (
                    <Icon name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} />
                  )}
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-muted/30 transition-colors duration-150"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-2">
                  <span>Created</span>
                  {sortField === 'createdAt' && (
                    <Icon name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} />
                  )}
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-muted/30 transition-colors duration-150"
                onClick={() => handleSort('expiresAt')}
              >
                <div className="flex items-center space-x-2">
                  <span>Expires</span>
                  {sortField === 'expiresAt' && (
                    <Icon name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} />
                  )}
                </div>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedKeys?.map((key) => {
              const daysUntilExpiration = getDaysUntilExpiration(key?.expiresAt);
              const isSelected = selectedKeys?.includes(key?.id);

              return (
                <tr key={key?.id} className={isSelected ? 'bg-primary/5' : ''}>
                  <td>
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => handleSelectKey(key?.id, e?.target?.checked)}
                    />
                  </td>
                  <td>
                    <div>
                      <div className="font-medium text-foreground">{key?.name}</div>
                      <div className="text-xs text-muted-foreground">{key?.id}</div>
                    </div>
                  </td>
                  <td>
                    {getAlgorithmBadge(key?.algorithm)}
                  </td>
                  <td>
                    {getStatusBadge(key?.status)}
                  </td>
                  <td>
                    <div className="text-sm text-foreground">{formatDate(key?.createdAt)}</div>
                  </td>
                  <td>
                    <div className="text-sm text-foreground">{formatDate(key?.expiresAt)}</div>
                    {daysUntilExpiration <= 30 && daysUntilExpiration > 0 && (
                      <div className="text-xs text-warning font-medium">
                        Expires in {daysUntilExpiration} days
                      </div>
                    )}
                    {daysUntilExpiration <= 0 && (
                      <div className="text-xs text-error font-medium">
                        Expired
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(key?.id)}
                        title="View Details"
                      >
                        <Icon name="Eye" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onKeyAction('rotate', key?.id)}
                        title="Rotate Key"
                        disabled={key?.status !== 'active'}
                      >
                        <Icon name="RotateCw" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onKeyAction('download', key?.id)}
                        title="Download Public Key"
                      >
                        <Icon name="Download" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onKeyAction('revoke', key?.id)}
                        title="Revoke Key"
                        disabled={key?.status !== 'active'}
                        className="text-error hover:text-error"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-4 p-4">
        {sortedKeys?.map((key) => {
          const daysUntilExpiration = getDaysUntilExpiration(key?.expiresAt);
          const isSelected = selectedKeys?.includes(key?.id);

          return (
            <div
              key={key?.id}
              className={`glass-card rounded-lg border border-border p-4 ${
                isSelected ? 'ring-2 ring-primary/20 bg-primary/5' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={isSelected}
                    onChange={(e) => handleSelectKey(key?.id, e?.target?.checked)}
                  />
                  <div>
                    <h4 className="font-medium text-foreground">{key?.name}</h4>
                    <p className="text-xs text-muted-foreground">{key?.id}</p>
                  </div>
                </div>
                {getStatusBadge(key?.status)}
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Algorithm:</span>
                  {getAlgorithmBadge(key?.algorithm)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created:</span>
                  <span className="text-sm text-foreground">{formatDate(key?.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Expires:</span>
                  <div className="text-right">
                    <div className="text-sm text-foreground">{formatDate(key?.expiresAt)}</div>
                    {daysUntilExpiration <= 30 && daysUntilExpiration > 0 && (
                      <div className="text-xs text-warning font-medium">
                        {daysUntilExpiration} days left
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(key?.id)}
                >
                  <Icon name="Eye" size={14} className="mr-2" />
                  Details
                </Button>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onKeyAction('rotate', key?.id)}
                    disabled={key?.status !== 'active'}
                  >
                    <Icon name="RotateCw" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onKeyAction('download', key?.id)}
                  >
                    <Icon name="Download" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onKeyAction('revoke', key?.id)}
                    disabled={key?.status !== 'active'}
                    className="text-error hover:text-error"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Empty State */}
      {keys?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Key" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No keys found</h3>
          <p className="text-muted-foreground mb-4">
            No cryptographic keys match your current filters.
          </p>
          <Button variant="outline">
            <Icon name="RotateCcw" size={16} className="mr-2" />
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default KeyTable;