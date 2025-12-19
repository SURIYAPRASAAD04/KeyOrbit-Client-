import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const NotificationPreferences = ({ userData }) => {
  const [preferences, setPreferences] = useState({
    // Email Notifications
    emailAlerts: true,
    securityAlerts: true,
    systemUpdates: false,
    auditReports: true,
    keyExpiry: true,
    loginAttempts: true,
    
    // In-App Notifications
    inAppAlerts: true,
    realTimeUpdates: true,
    taskReminders: false,
    
    // Delivery Settings
    emailFrequency: 'immediate',
    summaryReports: 'weekly',
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '08:00'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handlePreferenceChange = (e) => {
    const { name, checked, value, type } = e?.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setIsSaved(false);
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 1000);
  };

  const emailFrequencyOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'hourly', label: 'Hourly Summary' },
    { value: 'daily', label: 'Daily Summary' },
    { value: 'never', label: 'Never' }
  ];

  const summaryOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'never', label: 'Never' }
  ];

  return (
    <div className="space-y-8">
      {isSaved && (
        <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Check" size={16} className="text-success" />
            <p className="text-sm text-success">Notification preferences updated successfully!</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Email Notifications */}
        <div className="space-y-6">
          <div className="border-b border-border pb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <Icon name="Mail" size={20} className="mr-2" />
              Email Notifications
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Configure which email notifications you want to receive
            </p>
          </div>

          <div className="space-y-4">
            <Checkbox
              label={
                <div>
                  <div className="font-medium">Security Alerts</div>
                  <div className="text-xs text-muted-foreground">
                    Critical security events, suspicious activities, policy violations
                  </div>
                </div>
              }
              name="securityAlerts"
              checked={preferences?.securityAlerts}
              onChange={handlePreferenceChange}
            />

            <Checkbox
              label={
                <div>
                  <div className="font-medium">Login Attempts</div>
                  <div className="text-xs text-muted-foreground">
                    New login attempts, failed authentication, device changes
                  </div>
                </div>
              }
              name="loginAttempts"
              checked={preferences?.loginAttempts}
              onChange={handlePreferenceChange}
            />

            <Checkbox
              label={
                <div>
                  <div className="font-medium">Key Expiry Warnings</div>
                  <div className="text-xs text-muted-foreground">
                    Notifications when cryptographic keys are approaching expiration
                  </div>
                </div>
              }
              name="keyExpiry"
              checked={preferences?.keyExpiry}
              onChange={handlePreferenceChange}
            />

            <Checkbox
              label={
                <div>
                  <div className="font-medium">Audit Reports</div>
                  <div className="text-xs text-muted-foreground">
                    Compliance reports, audit summaries, regulatory updates
                  </div>
                </div>
              }
              name="auditReports"
              checked={preferences?.auditReports}
              onChange={handlePreferenceChange}
            />

            <Checkbox
              label={
                <div>
                  <div className="font-medium">System Updates</div>
                  <div className="text-xs text-muted-foreground">
                    Platform updates, maintenance schedules, feature releases
                  </div>
                </div>
              }
              name="systemUpdates"
              checked={preferences?.systemUpdates}
              onChange={handlePreferenceChange}
            />
          </div>

          {/* Email Frequency */}
          <div className="p-4 bg-muted/20 rounded-lg border border-border">
            <Select
              label="Email Delivery Frequency"
              name="emailFrequency"
              value={preferences?.emailFrequency}
              onChange={handlePreferenceChange}
              options={emailFrequencyOptions}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Security alerts are always sent immediately regardless of this setting
            </p>
          </div>
        </div>

        {/* In-App Notifications */}
        <div className="space-y-6">
          <div className="border-b border-border pb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <Icon name="Bell" size={20} className="mr-2" />
              In-App Notifications
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Control notifications that appear while using the application
            </p>
          </div>

          <div className="space-y-4">
            <Checkbox
              label={
                <div>
                  <div className="font-medium">Real-time Updates</div>
                  <div className="text-xs text-muted-foreground">
                    Live notifications for key operations and system events
                  </div>
                </div>
              }
              name="realTimeUpdates"
              checked={preferences?.realTimeUpdates}
              onChange={handlePreferenceChange}
            />

            <Checkbox
              label={
                <div>
                  <div className="font-medium">Task Reminders</div>
                  <div className="text-xs text-muted-foreground">
                    Reminders for pending approvals, key rotations, reviews
                  </div>
                </div>
              }
              name="taskReminders"
              checked={preferences?.taskReminders}
              onChange={handlePreferenceChange}
            />

            <Checkbox
              label={
                <div>
                  <div className="font-medium">General Alerts</div>
                  <div className="text-xs text-muted-foreground">
                    Non-critical system notifications and status updates
                  </div>
                </div>
              }
              name="inAppAlerts"
              checked={preferences?.inAppAlerts}
              onChange={handlePreferenceChange}
            />
          </div>
        </div>

        {/* Delivery Settings */}
        <div className="space-y-6">
          <div className="border-b border-border pb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <Icon name="Settings" size={20} className="mr-2" />
              Delivery Settings
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Advanced settings for notification delivery and timing
            </p>
          </div>

          <div className="space-y-6">
            {/* Summary Reports */}
            <div>
              <Select
                label="Summary Reports"
                name="summaryReports"
                value={preferences?.summaryReports}
                onChange={handlePreferenceChange}
                options={summaryOptions}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Receive consolidated reports of system activity
              </p>
            </div>

            {/* Quiet Hours */}
            <div className="space-y-4">
              <Checkbox
                label={
                  <div>
                    <div className="font-medium">Enable Quiet Hours</div>
                    <div className="text-xs text-muted-foreground">
                      Suppress non-critical notifications during specified hours
                    </div>
                  </div>
                }
                name="quietHours"
                checked={preferences?.quietHours}
                onChange={handlePreferenceChange}
              />

              {preferences?.quietHours && (
                <div className="grid grid-cols-2 gap-4 ml-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="quietStart"
                      value={preferences?.quietStart}
                      onChange={handlePreferenceChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="quietEnd"
                      value={preferences?.quietEnd}
                      onChange={handlePreferenceChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notification Test */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Test Notifications</p>
              <p className="text-sm text-muted-foreground">
                Send a test notification to verify your settings
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              iconName="Send"
            >
              Send Test
            </Button>
          </div>
        </div>

        {/* Save Changes */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            <Icon name="Info" size={14} className="inline mr-1" />
            Changes take effect immediately for new notifications
          </div>
          
          <Button
            type="submit"
            variant="default"
            loading={isLoading}
            iconName="Save"
            className="btn-glow"
          >
            {isLoading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NotificationPreferences;