import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = 'default', loading = false }) => {
  if (!isOpen) return null;

  const getTypeConfig = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'AlertTriangle',
          iconColor: 'text-error',
          confirmVariant: 'destructive',
          confirmText: 'Delete'
        };
      case 'warning':
        return {
          icon: 'AlertCircle',
          iconColor: 'text-warning',
          confirmVariant: 'warning',
          confirmText: 'Continue'
        };
      default:
        return {
          icon: 'HelpCircle',
          iconColor: 'text-primary',
          confirmVariant: 'default',
          confirmText: 'Confirm'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md glass-card rounded-xl shadow-orbital-lg border border-border"
      >
        <div className="p-6">
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-muted/30">
            <Icon name={config?.icon} size={24} className={config?.iconColor} />
          </div>

          {/* Content */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              variant={config?.confirmVariant}
              onClick={onConfirm}
              loading={loading}
            >
              {loading ? 'Processing...' : config?.confirmText}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmationModal;