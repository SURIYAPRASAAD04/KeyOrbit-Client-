import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionsBar = ({ selectedKeys, onBulkAction, onClearSelection }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (selectedKeys?.length === 0) return null;

  const bulkActions = [
    {
      id: 'rotate',
      label: 'Rotate Keys',
      icon: 'RotateCw',
      description: 'Generate new versions of selected keys',
      variant: 'default'
    },
    {
      id: 'export',
      label: 'Export Public Keys',
      icon: 'Download',
      description: 'Download public keys as ZIP file',
      variant: 'outline'
    },
    {
      id: 'revoke',
      label: 'Revoke Keys',
      icon: 'Trash2',
      description: 'Permanently revoke selected keys',
      variant: 'destructive'
    }
  ];

  const handleBulkAction = (actionId) => {
    onBulkAction(actionId, selectedKeys);
    setIsDropdownOpen(false);
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
              >
                <Icon name="MoreHorizontal" size={16} className="mr-2" />
                Actions
                <Icon name="ChevronDown" size={14} className="ml-2" />
              </Button>

              {isDropdownOpen && (
                <div className="absolute bottom-full mb-2 right-0 w-64 glass-card rounded-lg shadow-orbital-lg border border-border z-500">
                  <div className="p-2">
                    {bulkActions?.map((action) => (
                      <button
                        key={action?.id}
                        onClick={() => handleBulkAction(action?.id)}
                        className={`w-full flex items-start p-3 rounded-lg text-left hover:bg-muted/30 transition-colors duration-150 ${
                          action?.variant === 'destructive' ? 'hover:bg-error/10' : ''
                        }`}
                      >
                        <Icon 
                          name={action?.icon} 
                          size={16} 
                          className={`mr-3 mt-0.5 flex-shrink-0 ${
                            action?.variant === 'destructive' ? 'text-error' : 'text-foreground'
                          }`} 
                        />
                        <div>
                          <div className={`text-sm font-medium ${
                            action?.variant === 'destructive' ? 'text-error' : 'text-foreground'
                          }`}>
                            {action?.label}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {action?.description}
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