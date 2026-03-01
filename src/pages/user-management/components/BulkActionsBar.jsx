import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const BulkActionsBar = ({ selectedCount, onBulkAction, selectedUserIds }) => {
  const [showActions, setShowActions] = useState(false);

  const handleBulkAction = (action) => {
    onBulkAction(action, selectedUserIds);
    setShowActions(false);
  };

  return (
    <div className="glass-card rounded-lg p-4 mb-4 relative z-50"> {/* Added z-50 here too */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="font-medium text-foreground">
              {selectedCount} user{selectedCount > 1 ? 's' : ''} selected
            </span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            <span>Bulk Actions</span>
            <Icon 
              name={showActions ? "ChevronUp" : "ChevronDown"} 
              size={16} 
            />
          </button>

          {/* Dropdown Menu with extremely high z-index */}
          {showActions && (
            <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-orbital-lg z-[9999]"> {/* Increased z-index */}
              <div className="py-2">
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                >
                  <Icon name="CheckCircle" size={16} className="mr-3 text-success" />
                  <span>Activate Users</span>
                </button>
                <button
                  onClick={() => handleBulkAction('deactivate')}
                  className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                >
                  <Icon name="XCircle" size={16} className="mr-3 text-muted-foreground" />
                  <span>Deactivate Users</span>
                </button>
                <button
                  onClick={() => handleBulkAction('suspend')}
                  className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                >
                  <Icon name="Pause" size={16} className="mr-3 text-warning" />
                  <span>Suspend Users</span>
                </button>
                
                <div className="border-t border-border my-1"></div>
                <button
                  onClick={() => handleBulkAction('resetPasswords')}
                  className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                >
                  <Icon name="Key" size={16} className="mr-3 text-primary" />
                  <span>Reset Passwords</span>
                </button>
                <div className="border-t border-border my-1"></div>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors duration-200"
                >
                  <Icon name="Trash2" size={16} className="mr-3" />
                  <span>Delete Users</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;