import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConfirmationModal = ({ 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  variant = 'default',
  onConfirm, 
  onCancel 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return {
          icon: 'AlertTriangle',
          iconColor: 'text-destructive',
          iconBg: 'bg-destructive/10',
          confirmButton: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
        };
      case 'warning':
        return {
          icon: 'AlertTriangle',
          iconColor: 'text-warning',
          iconBg: 'bg-warning/10',
          confirmButton: 'bg-warning hover:bg-warning/90 text-warning-foreground'
        };
      default:
        return {
          icon: 'CheckCircle',
          iconColor: 'text-primary',
          iconBg: 'bg-primary/10',
          confirmButton: 'bg-primary hover:bg-primary/90 text-primary-foreground'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card w-full max-w-md rounded-2xl border border-border">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full ${styles?.iconBg} flex items-center justify-center flex-shrink-0`}>
              <Icon name={styles?.icon} size={24} className={styles?.iconColor} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{message}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex items-center justify-end space-x-3">
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button 
            onClick={onConfirm}
            className={styles?.confirmButton}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;