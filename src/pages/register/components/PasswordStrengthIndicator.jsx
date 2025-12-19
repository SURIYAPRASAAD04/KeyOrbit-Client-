import React from 'react';
import Icon from '../../../components/AppIcon';

const PasswordStrengthIndicator = ({ password, strength }) => {
  const requirements = [
    { label: 'At least 8 characters', regex: /.{8,}/ },
    { label: 'One lowercase letter', regex: /[a-z]/ },
    { label: 'One uppercase letter', regex: /[A-Z]/ },
    { label: 'One number', regex: /\d/ },
    { label: 'One special character', regex: /[^a-zA-Z\d]/ }
  ];

  const getStrengthColor = () => {
    if (strength < 2) return 'bg-error';
    if (strength < 4) return 'bg-warning';
    return 'bg-success';
  };

  const getStrengthText = () => {
    if (strength < 2) return 'Weak';
    if (strength < 4) return 'Medium';
    return 'Strong';
  };

  if (!password) return null;

  return (
    <div className="mt-3 space-y-3">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Password Strength</span>
          <span className={`font-medium ${
            strength < 2 ? 'text-error' : 
            strength < 4 ? 'text-warning': 'text-success'
          }`}>
            {getStrengthText()}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-foreground">Requirements:</p>
        <div className="grid grid-cols-1 gap-1">
          {requirements?.map((req, index) => {
            const isMet = req?.regex?.test(password);
            return (
              <div
                key={index}
                className="flex items-center space-x-2 text-xs"
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center
                  ${isMet ? 'bg-success text-success-foreground' : 'bg-muted'}
                `}>
                  {isMet ? (
                    <Icon name="Check" size={10} />
                  ) : (
                    <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                  )}
                </div>
                <span className={isMet ? 'text-success' : 'text-muted-foreground'}>
                  {req?.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;