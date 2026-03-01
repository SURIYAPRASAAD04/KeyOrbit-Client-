import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { PQCkeyAPI as keyAPI } from '../../../services/api';

const KeyTable = ({ keys, selectedKeys, onSelectionChange, onKeyAction, onKeysUpdate }) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [actionLoading, setActionLoading] = useState({});

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success text-success-foreground', icon: 'CheckCircle' },
      expired: { color: 'bg-warning text-warning-foreground', icon: 'AlertTriangle' },
      revoked: { color: 'bg-error text-error-foreground', icon: 'XCircle' },
      rotated: { color: 'bg-info text-info-foreground', icon: 'RotateCw' },
      pending: { color: 'bg-muted text-muted-foreground', icon: 'Clock' },
      deleted: { color: 'bg-destructive text-destructive-foreground', icon: 'Trash2' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon name={config.icon} size={12} className="mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  const getAlgorithmBadge = (algorithm) => {
    const isQuantumResistant = algorithm?.toLowerCase()?.includes('kem') || 
                               algorithm?.toLowerCase()?.includes('dsa');
    
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isQuantumResistant 
          ? 'bg-accent/10 text-accent border border-accent/20'
          : 'bg-primary/10 text-primary border border-primary/20'
      }`}>
        {isQuantumResistant && <Icon name="Shield" size={12} className="mr-1" />}
        {algorithm}
      </div>
    );
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getDaysUntilExpiration = (expiresAt) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

const handleRevoke = async (keyId, keyName) => {
  if (!window.confirm(`Are you sure you want to revoke key "${keyName}"? This action cannot be undone.`)) {
    return;
  }

  setActionLoading(prev => ({ ...prev, [keyId]: 'revoke' }));
  try {
    // Make sure we're sending the correct Content-Type
    await keyAPI.revokeKey(keyId, 'User requested revocation');
    if (onKeysUpdate) onKeysUpdate();
  } catch (error) {
    console.error('Failed to revoke key:', error);
    alert('Failed to revoke key: ' + (error.response?.data?.error || error.message));
  } finally {
    setActionLoading(prev => ({ ...prev, [keyId]: null }));
  }
};

  const handleDelete = async (keyId, keyName) => {
    if (!window.confirm(`Are you sure you want to permanently delete key "${keyName}"? This action cannot be undone.`)) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [keyId]: 'delete' }));
    try {
      await keyAPI.deleteKey(keyId);
      if (onKeysUpdate) onKeysUpdate();
    } catch (error) {
      console.error('Failed to delete key:', error);
      alert('Failed to delete key: ' + (error.response?.data?.error || error.message));
    } finally {
      setActionLoading(prev => ({ ...prev, [keyId]: null }));
    }
  };

  const handleRotate = async (keyId, keyName) => {
    if (!window.confirm(`Are you sure you want to rotate key "${keyName}"? This will create a new version.`)) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [keyId]: 'rotate' }));
    try {
      await keyAPI.rotateKey(keyId);
      if (onKeysUpdate) onKeysUpdate();
    } catch (error) {
      console.error('Failed to rotate key:', error);
      alert('Failed to rotate key: ' + (error.response?.data?.error || error.message));
    } finally {
      setActionLoading(prev => ({ ...prev, [keyId]: null }));
    }
  };

  const handleDownload = async (keyId, keyName) => {
    setActionLoading(prev => ({ ...prev, [keyId]: 'download' }));
    try {
      const response = await keyAPI.downloadPublicKey(keyId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${keyName.replace(/\s+/g, '_')}_public_key.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [keyId]: null }));
    }
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
    navigate(`/key-details/${keyId}`);
  };

  const sortedKeys = [...keys]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === 'createdAt' || sortField === 'expiresAt' || sortField === 'lastUsed') {
      aValue = aValue ? new Date(aValue) : new Date(0);
      bValue = bValue ? new Date(bValue) : new Date(0);
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const isAllSelected = keys?.length > 0 && selectedKeys?.length === keys?.length;
  const isPartiallySelected = selectedKeys?.length > 0 && selectedKeys?.length < keys?.length;

  const canRevoke = (key) => {
    return key.status === 'active';
  };

  const canRotate = (key) => {
    return key.status === 'active' || key.status === 'expired';
  };

  const canDelete = (key) => {
    return key.status !== 'deleted';
  };

  return (
    <div className="glass-card rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              
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
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center space-x-2">
                  <span>Type</span>
                  {sortField === 'type' && (
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
              const loading = actionLoading[key?.id];

              return (
                <tr key={key?.id} className={isSelected ? 'bg-primary/5' : ''}>
                  
                  <td>
                    <div>
                      <div className="font-medium text-foreground">{key?.name}</div>
                      <div className="text-xs text-muted-foreground">{key?.keyId}</div>
                    </div>
                  </td>
                  <td>
                    {getAlgorithmBadge(key?.algorithm)}
                  </td>
                  <td>
                    <span className="text-sm capitalize">{key?.type}</span>
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
                  </td>
                  <td>
                    <div className="flex items-center space-x-1">
                      
                      {canRotate(key) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRotate(key?.id, key?.name)}
                          title="Rotate Key"
                          disabled={loading === 'rotate'}
                          loading={loading === 'rotate'}
                        >
                          <Icon name="RotateCw" size={16} />
                        </Button>
                      )}
                      
                      
                      {canRevoke(key) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRevoke(key?.id, key?.name)}
                          title="Revoke Key"
                          disabled={loading === 'revoke'}
                          loading={loading === 'revoke'}
                          className="text-warning hover:text-warning"
                        >
                          <Icon name="AlertTriangle" size={16} />
                        </Button>
                      )}
                      
                      {canDelete(key) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(key?.id, key?.name)}
                          title="Delete Key"
                          disabled={loading === 'delete'}
                          loading={loading === 'delete'}
                          className="text-error hover:text-error"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      )}
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
          const loading = actionLoading[key?.id];

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
                    disabled={key.status === 'deleted'}
                  />
                  <div>
                    <h4 className="font-medium text-foreground">{key?.name}</h4>
                    <p className="text-xs text-muted-foreground">{key?.keyId}</p>
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
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <span className="text-sm capitalize">{key?.type}</span>
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
                  disabled={loading}
                >
                  <Icon name="Eye" size={14} className="mr-2" />
                  Details
                </Button>
                
                <div className="flex items-center space-x-2">
                  {canRotate(key) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRotate(key?.id, key?.name)}
                      disabled={loading === 'rotate'}
                      loading={loading === 'rotate'}
                    >
                      <Icon name="RotateCw" size={16} />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(key?.id, key?.name)}
                    disabled={loading === 'download'}
                    loading={loading === 'download'}
                  >
                    <Icon name="Download" size={16} />
                  </Button>
                  
                  {canRevoke(key) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRevoke(key?.id, key?.name)}
                      disabled={loading === 'revoke'}
                      loading={loading === 'revoke'}
                      className="text-warning hover:text-warning"
                    >
                      <Icon name="AlertTriangle" size={16} />
                    </Button>
                  )}
                  
                  {canDelete(key) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(key?.id, key?.name)}
                      disabled={loading === 'delete'}
                      loading={loading === 'delete'}
                      className="text-error hover:text-error"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  )}
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
          <Button variant="outline" onClick={() => window.location.reload()}>
            <Icon name="RotateCcw" size={16} className="mr-2" />
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default KeyTable;