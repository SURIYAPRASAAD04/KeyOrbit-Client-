import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X, Sparkles } from 'lucide-react';

const NotificationToast = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose,
  position = 'bottom-right',
  index = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Entrance animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    if (duration > 0) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        setProgress((remaining / duration) * 100);
      }, 50);

      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose?.(), 400);
  };

  const getPositionClasses = () => {
    const positions = {
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
    };
    return positions[position] || positions['bottom-right'];
  };

  const getTypeStyles = () => {
    const styles = {
      success: {
        gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
        border: 'border-emerald-500/30',
        iconBg: 'bg-emerald-500/20',
        iconColor: 'text-emerald-600',
        progressBg: 'bg-emerald-500',
        glow: 'shadow-emerald-500/20',
      },
      error: {
        gradient: 'from-red-500/10 via-red-500/5 to-transparent',
        border: 'border-red-500/30',
        iconBg: 'bg-red-500/20',
        iconColor: 'text-red-600',
        progressBg: 'bg-red-500',
        glow: 'shadow-red-500/20',
      },
      warning: {
        gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
        border: 'border-amber-500/30',
        iconBg: 'bg-amber-500/20',
        iconColor: 'text-amber-600',
        progressBg: 'bg-amber-500',
        glow: 'shadow-amber-500/20',
      },
      info: {
        gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
        border: 'border-blue-500/30',
        iconBg: 'bg-blue-500/20',
        iconColor: 'text-blue-600',
        progressBg: 'bg-blue-500',
        glow: 'shadow-blue-500/20',
      },
    };
    return styles[type] || styles.info;
  };

  const getIcon = () => {
    const icons = {
      success: CheckCircle,
      error: AlertCircle,
      warning: AlertTriangle,
      info: Info,
    };
    const IconComponent = icons[type] || Info;
    return <IconComponent size={20} strokeWidth={2.5} />;
  };

  const styles = getTypeStyles();
  
  // Calculate transform based on index for stacking
  const stackOffset = index * 72;
  const scale = 1 - (index * 0.05);
  const opacity = 1 - (index * 0.15);

  return (
    <div 
      className={`fixed z-[9999] transition-all duration-400 ease-out ${getPositionClasses()}`}
      style={{
        transform: `translateY(-${stackOffset}px) scale(${isExiting ? 0.95 : (isVisible ? scale : 0.95)})`,
        opacity: isExiting ? 0 : (isVisible ? opacity : 0),
      }}
    >
      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-2xl blur-xl ${styles.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      {/* Main Card */}
      <div className={`group relative w-96 max-w-[calc(100vw-2rem)] backdrop-blur-xl bg-white/95 border-2 ${styles.border} rounded-2xl shadow-2xl overflow-hidden`}>
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} pointer-events-none`} />
        
        {/* Animated Border Accent */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${styles.progressBg} opacity-20`}>
          <div 
            className={`h-full ${styles.progressBg} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="relative p-4">
          <div className="flex items-start gap-3">
            {/* Icon with Animation */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${styles.iconBg} ${styles.iconColor} flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
              {getIcon()}
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-sm font-medium text-gray-900 leading-relaxed">
                {message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 group/close"
              aria-label="Close notification"
            >
              <X 
                size={16} 
                className="text-gray-400 group-hover/close:text-gray-600 transition-colors"
                strokeWidth={2.5}
              />
            </button>
          </div>

          {/* Progress Bar */}
          {duration > 0 && (
            <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${styles.progressBg} rounded-full transition-all duration-100 ease-linear shadow-lg`}
                style={{ 
                  width: `${progress}%`,
                }}
              />
            </div>
          )}
        </div>

        {/* Sparkle Effect on Success */}
        {type === 'success' && (
          <>
            <Sparkles 
              size={16} 
              className="absolute top-3 right-12 text-emerald-400 opacity-60 animate-pulse"
            />
            <Sparkles 
              size={12} 
              className="absolute top-6 right-16 text-emerald-300 opacity-40 animate-pulse"
              style={{ animationDelay: '0.3s' }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationToast;