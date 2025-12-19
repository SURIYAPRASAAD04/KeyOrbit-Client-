import React from 'react';
import Icon from '../../../components/AppIcon';

const UserTable = ({ 
  users, 
  selectedUsers, 
  onSelectUser, 
  onSelectAll, 
  onEditUser, 
  onViewDetails, 
  onDeleteUser, 
  onResetPassword 
}) => {
  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'Active':
        return `${baseClasses} bg-success/10 text-success`;
      case 'Inactive':
        return `${baseClasses} bg-muted text-muted-foreground`;
      case 'Suspended':
        return `${baseClasses} bg-error/10 text-error`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const getRoleBadge = (role) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (role) {
      case 'Administrator':
        return `${baseClasses} bg-primary/10 text-primary`;
      case 'Manager':
        return `${baseClasses} bg-secondary/10 text-secondary`;
      case 'Developer':
        return `${baseClasses} bg-accent/10 text-accent`;
      case 'Auditor':
        return `${baseClasses} bg-warning/10 text-warning`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const getInitials = (name) => {
    return name?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase();
  };

  return (
    <div className="overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-12">
                <input
                  type="checkbox"
                  checked={selectedUsers?.length === users?.length}
                  onChange={onSelectAll}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-2 focus:ring-primary/20"
                />
              </th>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Department</th>
              <th>Last Activity</th>
              <th>Permissions</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr 
                key={user?.id} 
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => onViewDetails(user)}
              >
                <td onClick={(e) => e?.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedUsers?.includes(user?.id)}
                    onChange={() => onSelectUser(user?.id)}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-2 focus:ring-primary/20"
                  />
                </td>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {getInitials(user?.name)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={getRoleBadge(user?.role)}>
                    {user?.role}
                  </span>
                </td>
                <td>
                  <span className={getStatusBadge(user?.status)}>
                    {user?.status}
                  </span>
                </td>
                <td className="text-muted-foreground">{user?.department}</td>
                <td className="text-muted-foreground">{user?.lastActivity}</td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {user?.permissions?.slice(0, 2)?.map((permission, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground"
                      >
                        {permission}
                      </span>
                    ))}
                    {user?.permissions?.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{user?.permissions?.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td onClick={(e) => e?.stopPropagation()}>
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onEditUser(user)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
                      title="Edit User"
                    >
                      <Icon name="Edit" size={16} className="text-muted-foreground hover:text-foreground" />
                    </button>
                    <button
                      onClick={() => onResetPassword(user)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
                      title="Reset Password"
                    >
                      <Icon name="Key" size={16} className="text-muted-foreground hover:text-foreground" />
                    </button>
                    <button
                      onClick={() => onDeleteUser(user)}
                      className="p-2 hover:bg-error/10 rounded-lg transition-colors duration-200"
                      title="Delete User"
                    >
                      <Icon name="Trash2" size={16} className="text-muted-foreground hover:text-error" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {users?.map((user) => (
          <div
            key={user?.id}
            className="glass-card rounded-lg p-4 space-y-4"
            onClick={() => onViewDetails(user)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedUsers?.includes(user?.id)}
                  onChange={() => onSelectUser(user?.id)}
                  onClick={(e) => e?.stopPropagation()}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-2 focus:ring-primary/20"
                />
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {getInitials(user?.name)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1" onClick={(e) => e?.stopPropagation()}>
                <button
                  onClick={() => onEditUser(user)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
                >
                  <Icon name="Edit" size={16} className="text-muted-foreground" />
                </button>
                <button
                  onClick={() => onDeleteUser(user)}
                  className="p-2 hover:bg-error/10 rounded-lg transition-colors duration-200"
                >
                  <Icon name="Trash2" size={16} className="text-muted-foreground hover:text-error" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Role</p>
                <span className={getRoleBadge(user?.role)}>
                  {user?.role}
                </span>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <span className={getStatusBadge(user?.status)}>
                  {user?.status}
                </span>
              </div>
              <div>
                <p className="text-muted-foreground">Department</p>
                <p className="text-foreground">{user?.department}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Activity</p>
                <p className="text-foreground">{user?.lastActivity}</p>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground text-sm mb-2">Permissions</p>
              <div className="flex flex-wrap gap-1">
                {user?.permissions?.map((permission, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTable;