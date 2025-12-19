import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto">
          <Icon name="ShieldOff" size={40} className="text-error" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page. Please contact your administrator 
            if you believe this is an error.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Go Back
          </Button>
          
          <Button
            onClick={() => navigate('/dashboard')}
            variant="default"
            iconName="Home"
            iconPosition="left"
          >
            Go to Dashboard
          </Button>
        </div>

        <div className="p-4 bg-muted/20 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            Required permissions: Administrator or Security role
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;