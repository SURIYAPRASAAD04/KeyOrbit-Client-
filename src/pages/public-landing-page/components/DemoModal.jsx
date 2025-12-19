import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DemoModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    title: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    timezone: '',
    interests: [],
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
  ];

  const timezones = [
    'Eastern Time (ET)',
    'Central Time (CT)',
    'Mountain Time (MT)',
    'Pacific Time (PT)',
    'GMT/UTC',
    'Central European Time (CET)',
    'Other'
  ];

  const demoInterests = [
    'Key Management Dashboard',
    'API Integration',
    'Compliance Features',
    'Security Controls',
    'Performance & Scaling',
    'Pricing & Plans'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev?.interests?.includes(interest)
        ? prev?.interests?.filter(i => i !== interest)
        : [...prev?.interests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today?.toISOString()?.split('T')?.[0];
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="glass-card rounded-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="CheckCircle" size={32} className="text-success" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-4">
            Demo Scheduled!
          </h3>
          <p className="text-muted-foreground mb-6">
            Thank you for scheduling a demo. We've sent a calendar invite to {formData?.email} with the meeting details. Our team will contact you shortly to confirm.
          </p>
          <button
            onClick={onClose}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Schedule a Demo</h2>
            <p className="text-sm text-muted-foreground">
              Book a personalized demonstration of KeyOrbit KMS
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 max-h-96 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Business Email *
              </label>
              <input
                type="email"
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={formData?.company}
                onChange={(e) => handleInputChange('company', e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Job Title
              </label>
              <input
                type="text"
                value={formData?.title}
                onChange={(e) => handleInputChange('title', e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Timezone *
              </label>
              <select
                value={formData?.timezone}
                onChange={(e) => handleInputChange('timezone', e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                required
              >
                <option value="">Select timezone</option>
                {timezones?.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Preferred Date *
              </label>
              <input
                type="date"
                value={formData?.preferredDate}
                onChange={(e) => handleInputChange('preferredDate', e?.target?.value)}
                min={getMinDate()}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Preferred Time *
              </label>
              <select
                value={formData?.preferredTime}
                onChange={(e) => handleInputChange('preferredTime', e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                required
              >
                <option value="">Select time</option>
                {timeSlots?.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Demo Interests */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              What would you like to see in the demo? (Select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {demoInterests?.map((interest) => (
                <label
                  key={interest}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData?.interests?.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-sm text-foreground">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Message */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={formData?.message}
              onChange={(e) => handleInputChange('message', e?.target?.value)}
              placeholder="Any specific questions or requirements you'd like us to address during the demo..."
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="text-left">
            <p className="text-xs text-muted-foreground mb-1">
              Demo Duration: 30-45 minutes
            </p>
            <p className="text-xs text-muted-foreground">
              We'll send a calendar invite with meeting details
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !formData?.name || !formData?.email || !formData?.company || !formData?.preferredDate || !formData?.preferredTime || !formData?.timezone}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-orbital"></div>
                  <span>Scheduling...</span>
                </>
              ) : (
                <>
                  <Icon name="Calendar" size={16} />
                  <span>Schedule Demo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoModal;