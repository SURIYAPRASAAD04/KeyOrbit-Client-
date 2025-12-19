import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const EditUserModal = ({ user, onClose, onUpdate }) => {
  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    department: user?.department || '',
    phone: user?.phone || '',
    status: user?.status || '',
    permissions: user?.permissions || []
  });
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { value: 'Administrator', label: 'Administrator', permissions: ['Read', 'Write', 'Admin', 'Audit'] },
    { value: 'Manager', label: 'Manager', permissions: ['Read', 'Write', 'Manage'] },
    { value: 'Developer', label: 'Developer', permissions: ['Read', 'Write'] },
    { value: 'Auditor', label: 'Auditor', permissions: ['Read', 'Audit'] },
    { value: 'Viewer', label: 'Viewer', permissions: ['Read'] }
  ];

  const departments = [
    'Security', 'Engineering', 'Operations', 'Compliance', 'Marketing', 'Sales'
  ];

  const statuses = [
    'Active', 'Inactive', 'Suspended', 'Pending'
  ];

  const handleInputChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    
    // Auto-set permissions based on role
    if (field === 'role') {
      const selectedRole = roles?.find(r => r?.value === value);
      setUserData(prev => ({
        ...prev,
        role: value,
        permissions: selectedRole?.permissions || []
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      onUpdate({ ...user, ...userData });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-lg max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Edit User</h2>
            <p className="text-sm text-muted-foreground">
              Update user information and permissions
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
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={userData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={userData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={userData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Role
                </label>
                <select
                  value={userData?.role}
                  onChange={(e) => handleInputChange('role', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  required
                >
                  {roles?.map((role) => (
                    <option key={role?.value} value={role?.value}>
                      {role?.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  value={userData?.status}
                  onChange={(e) => handleInputChange('status', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  required
                >
                  {statuses?.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Department
              </label>
              <select
                value={userData?.department}
                onChange={(e) => handleInputChange('department', e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                required
              >
                {departments?.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Permissions
              </label>
              <div className="flex flex-wrap gap-2">
                {userData?.permissions?.map((permission) => (
                  <span
                    key={permission}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary/10 text-primary"
                  >
                    {permission}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Permissions are automatically assigned based on the selected role.
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-orbital"></div>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Icon name="Save" size={16} />
                <span>Update User</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;