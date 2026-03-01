import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API } from '../../services/api';

const AcceptInvitation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('No invitation token provided');
      setLoading(false);
      return;
    }

    validateInvitation();
  }, [token]);

  const validateInvitation = async () => {
    try {
      setLoading(true);
      const response = await API.call(API.users.validateInvitation, token);
      
      if (response.success) {
        setInvitation(response.data.invitation);
        
        // Pre-fill email if available
        if (response.data.invitation.email) {
          const nameParts = response.data.invitation.name.split(' ');
          setFormData(prev => ({
            ...prev,
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || ''
          }));
        }
      } else {
        setError(response.error || 'Invalid invitation');
      }
    } catch (error) {
      setError('Error validating invitation');
      console.error('Error validating invitation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.firstName || !formData.lastName) {
      setSubmitError('First name and last name are required');
      return;
    }
    
    if (!formData.password) {
      setSubmitError('Password is required');
      return;
    }
    
    if (formData.password.length < 8) {
      setSubmitError('Password must be at least 8 characters');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setSubmitError('Passwords do not match');
      return;
    }
    
    try {
      setSubmitting(true);
      setSubmitError(null);
      
      const acceptData = {
        token: token,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        password: formData.password
      };
      
      const response = await API.call(API.users.acceptInvitation, acceptData);
      
      if (response.success) {
        // Store user session
        API.utils.setAuthData(response.data.user, response.data.token);
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setSubmitError(response.error || 'Failed to accept invitation');
      }
    } catch (error) {
      setSubmitError('Error accepting invitation');
      console.error('Error accepting invitation:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Validating invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass-card rounded-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-error">⚠</span>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Invalid Invitation</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="glass-card rounded-lg max-w-md w-full">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Join {invitation?.organization?.name}
            </h2>
            <p className="text-muted-foreground">
              You've been invited by {invitation?.invitedBy?.name} as {invitation?.role}
            </p>
          </div>

          {/* Invitation Info */}
          <div className="bg-primary/5 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="font-medium text-foreground">{invitation?.email}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Role</span>
              <span className="font-medium text-foreground">{invitation?.role}</span>
            </div>
            {invitation?.department && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Department</span>
                <span className="font-medium text-foreground">{invitation?.department}</span>
              </div>
            )}
          </div>

          {invitation?.message && (
            <div className="bg-muted/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground italic">"{invitation.message}"</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  required
                  minLength="8"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Must be at least 8 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
                <p className="text-sm text-error">{submitError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </>
              ) : (
                'Accept Invitation & Create Account'
              )}
            </button>
          </form>

          {/* Expiration Notice */}
          <p className="text-xs text-muted-foreground text-center mt-4">
            This invitation expires on {new Date(invitation?.expiresAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitation;