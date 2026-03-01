import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ title, value, change, changeType, icon, description, onClick }) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return 'TrendingUp';
      case 'negative':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  return (
    <div 
      className={`glass-card rounded-lg border border-border p-6 transition-all duration-300 hover:shadow-orbital-lg cursor-pointer ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-${icon === 'Key' ? 'primary' : 'muted'}/10 rounded-lg flex items-center justify-center`}>
          <Icon name={icon} size={24} className={`text-${icon === 'Key' ? 'primary' : 'foreground'}`} />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${getChangeColor()}`}>
            <Icon name={getChangeIcon()} size={14} />
            <span>{change}</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;