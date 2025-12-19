import React from 'react';
import Icon from '../../../components/AppIcon';

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => {
  const getActionIcon = () => {
    if (title?.toLowerCase()?.includes('delete')) return 'Trash2';
    if (title?.toLowerCase()?.includes('reset')) return 'Key';
    if (title?.toLowerCase()?.includes('suspend')) return 'Pause';
    if (title?.toLowerCase()?.includes('activate')) return 'CheckCircle';
    return 'AlertTriangle';
  };

  const getActionColor = () => {
    if (title?.toLowerCase()?.includes('delete')) return 'text-error';
    if (title?.toLowerCase()?.includes('suspend')) return 'text-warning';
    if (title?.toLowerCase()?.includes('activate')) return 'text-success';
    return 'text-primary';
  };

  const getButtonStyle = () => {
    if (title?.toLowerCase()?.includes('delete')) {
      return 'bg-error text-error-foreground hover:bg-error/90';
    }
    return 'bg-primary text-primary-foreground hover:bg-primary/90';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="p-6 text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center`}>
            <Icon name={getActionIcon()} size={32} className={getActionColor()} />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${getButtonStyle()}`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;