import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { PQCkeyAPI as keyAPI } from '../../../services/api';

const BulkActionsBar = ({ selectedKeys, onBulkAction, onClearSelection, onKeysUpdate }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState('');

  if (selectedKeys?.length === 0) return null;

  const bulkActions = [
    {
      id: 'rotate',
      label: 'Rotate Keys',
      icon: 'RotateCw',
      description: 'Generate new versions of selected keys',
      variant: 'default',
      requiresConfirm: true
    },
    {
      id: 'export',
      label: 'Export Public Keys',
      icon: 'Download',
      description: 'Download public keys as JSON file',
      variant: 'outline',
      requiresConfirm: false
    },
    {
      id: 'revoke',
      label: 'Revoke Keys',
      icon: 'AlertTriangle',
      description: 'Revoke selected keys',
      variant: 'warning',
      requiresConfirm: true
    },
    {
      id: 'delete',
      label: 'Delete Keys',
      icon: 'Trash2',
      description: 'Permanently delete selected keys',
      variant: 'destructive',
      requiresConfirm: true
    }
  ];

  const handleBulkAction = async (actionId) => {
    const action = bulkActions.find(a => a.id === actionId);
    
    if (action.requiresConfirm) {
      const confirmMessage = {
        rotate: `Are you sure you want to rotate ${selectedKeys.length} key(s)?`,
        revoke: `Are you sure you want to revoke ${selectedKeys.length} key(s)? This action cannot be undone.`,
        delete: `Are you sure you want to permanently delete ${selectedKeys.length} key(s)? This action cannot be undone.`
      }[actionId];

      if (!window.confirm(confirmMessage)) {
        return;
      }
    }

    setIsLoading(true);
    setActionType(actionId);
    
    try {
      if (actionId === 'export') {
        // Handle export
        const response = await keyAPI.downloadPublicKey(selectedKeys[0]);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `exported_keys_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
      } else if (actionId === 'revoke') {
        await keyAPI.bulkRevokeKeys(selectedKeys, 'Bulk revocation');
        
      } else if (actionId === 'delete') {
        await keyAPI.bulkDeleteKeys(selectedKeys);
        
      } else if (actionId === 'rotate') {
        // Handle individual rotations
        for (const keyId of selectedKeys) {
          await keyAPI.rotateKey(keyId);
        }
      }
      
      // Refresh keys
      if (onKeysUpdate) {
        await onKeysUpdate();
      }
      
      // Clear selection
      onClearSelection();
      
    } catch (error) {
      console.error(`Bulk ${actionId} failed:`, error);
      alert('Failed to perform bulk action: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
      setActionType('');
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-400">
      <div className="glass-card rounded-full border border-border shadow-orbital-lg px-6 py-3">
        <div className="flex items-center space-x-4">
          {/* Selection Info */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-sm font-medium text-foreground">
              {selectedKeys?.length} key{selectedKeys?.length !== 1 ? 's' : ''} selected
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Quick Actions */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBulkAction('export')}
              title="Export selected keys"
              loading={isLoading && actionType === 'export'}
              disabled={isLoading}
            >
              <Icon name="Download" size={16} className="mr-2" />
              Export
            </Button>

            {/* More Actions Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={isLoading}
              >
                <Icon name="MoreHorizontal" size={16} className="mr-2" />
                Actions
                <Icon name="ChevronDown" size={14} className="ml-2" />
              </Button>

              {isDropdownOpen && (
                <div className="absolute bottom-full mb-2 right-0 w-64 glass-card rounded-lg shadow-orbital-lg border border-border z-500">
                  <div className="p-2">
                    {bulkActions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => handleBulkAction(action.id)}
                        disabled={isLoading}
                        className={`w-full flex items-start p-3 rounded-lg text-left hover:bg-muted/30 transition-colors duration-150 ${
                          action.variant === 'destructive' ? 'hover:bg-error/10' : ''
                        } ${action.variant === 'warning' ? 'hover:bg-warning/10' : ''}`}
                      >
                        <Icon 
                          name={action.icon} 
                          size={16} 
                          className={`mr-3 mt-0.5 flex-shrink-0 ${
                            action.variant === 'destructive' ? 'text-error' :
                            action.variant === 'warning' ? 'text-warning' : 'text-foreground'
                          }`} 
                        />
                        <div>
                          <div className={`text-sm font-medium ${
                            action.variant === 'destructive' ? 'text-error' :
                            action.variant === 'warning' ? 'text-warning' : 'text-foreground'
                          }`}>
                            {action.label}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {action.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Clear Selection */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              title="Clear selection"
              disabled={isLoading}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Click outside handler */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-300" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default BulkActionsBar;