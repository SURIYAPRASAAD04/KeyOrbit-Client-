import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import UserTable from './components/UserTable';
import UserFilters from './components/UserFilters';
import BulkActionsBar from './components/BulkActionsBar';
import InviteUserModal from './components/InviteUserModal';
import EditUserModal from './components/EditUserModal';
import UserDetailsModal from './components/UserDetailsModal';
import ConfirmationModal from './components/ConfirmationModal';
import NotificationToast from '../../components/NotificationToast';
import { API } from '../../services/api';

const UserManagement = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [notification, setNotification] = useState(null);
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    department: '',
    activity: '',
    search: ''
  });
  const [activeTab, setActiveTab] = useState('users');
  const [invitations, setInvitations] = useState([]);
  const [loadingInvitations, setLoadingInvitations] = useState(false);

  const [notifications, setNotifications] = useState([]);

const showNotification = (message, type = 'info', duration = 5000) => {
  const id = Date.now();
  setNotifications(prev => [...prev, { id, message, type, duration }]);
  
  if (duration > 0) {
    setTimeout(() => {
      closeNotification(id);
    }, duration);
  }
  
  return id;
};

const closeNotification = (id) => {
  setNotifications(prev => prev.filter(n => n.id !== id));
};

  // Load users from API
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await API.call(API.users.getUsers);
      
      if (response.success) {
        const formattedUsers = response.data.users?.map(user => 
          API.userHelpers.formatUserForDisplay(user)
        ) || [];
        
        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
      } else {
        setError(response.error || 'Failed to load users');
        showNotification('Failed to load users', 'error');
      }
    } catch (error) {
      setError('Error loading users');
      showNotification('Error loading users', 'error');
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await API.call(API.users.getUserStats);
      if (response.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Load invitations
  const loadInvitations = async () => {
    try {
      setLoadingInvitations(true);
      const response = await API.call(API.users.getInvitations);
      
      if (response.success) {
        setInvitations(response.data.invitations || []);
      }
    } catch (error) {
      console.error('Error loading invitations:', error);
      showNotification('Failed to load invitations', 'error');
    } finally {
      setLoadingInvitations(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadUsers();
    loadStats();
    loadInvitations();
  }, []);

  // Filter users based on applied filters
  useEffect(() => {
    let filtered = users;

    if (filters?.search) {
      filtered = filtered?.filter(user =>
        user?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        user?.email?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        user?.department?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        user?.displayName?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    if (filters?.role) {
      filtered = filtered?.filter(user => user?.role === filters?.role);
    }

    if (filters?.status) {
      filtered = filtered?.filter(user => user?.status === filters?.status);
    }

    if (filters?.department) {
      filtered = filtered?.filter(user => user?.department === filters?.department);
    }

    setFilteredUsers(filtered);
  }, [users, filters]);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev?.includes(userId) 
        ? prev?.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers?.length === filteredUsers?.length ? [] : filteredUsers?.map(user => user?.id)
    );
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleViewUserDetails = async (user) => {
    try {
      setSelectedUser(user);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error loading user details:', error);
      showNotification('Failed to load user details', 'error');
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setConfirmAction({
      type: 'delete',
      title: 'Delete User',
      message: `Are you sure you want to delete ${user?.displayName || user?.name}? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const response = await API.call(API.users.deleteUser, user.id);
          if (response.success) {
            await loadUsers();
            await loadStats();
            setSelectedUsers([]);
            showNotification('User deleted successfully', 'success');
          } else {
            showNotification(response.error || 'Failed to delete user', 'error');
          }
        } catch (error) {
          console.error('Error deleting user:', error);
          showNotification('Failed to delete user', 'error');
        }
      }
    });
    setShowConfirmModal(true);
  };

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    setConfirmAction({
      type: 'reset',
      title: 'Reset Password',
      message: `Reset password for ${user?.displayName || user?.name}? They will receive an email with instructions.`,
      onConfirm: async () => {
        try {
          const response = await API.call(API.users.adminResetPassword, user.id);
          if (response.success) {
            showNotification('Password reset email sent successfully', 'success');
          } else {
            showNotification(response.error || 'Failed to reset password', 'error');
          }
        } catch (error) {
          console.error('Error resetting password:', error);
          showNotification('Failed to reset password', 'error');
        }
      }
    });
    setShowConfirmModal(true);
  };

  const handleBulkAction = (action, userIds) => {
    let title, message, onConfirm;
    
    switch (action) {
      case 'activate':
        title = 'Activate Users';
        message = `Activate ${userIds?.length} selected user(s)?`;
        onConfirm = async () => {
          try {
            const response = await API.call(API.users.bulkUserActions, {
              action: 'activate',
              userIds
            });
            if (response.success) {
              await loadUsers();
              await loadStats();
              setSelectedUsers([]);
              showNotification(`Activated ${response.data.affected_count || userIds.length} user(s)`, 'success');
            } else {
              showNotification(response.error || 'Failed to activate users', 'error');
            }
          } catch (error) {
            console.error('Error activating users:', error);
            showNotification('Failed to activate users', 'error');
          }
        };
        break;
      
      case 'deactivate':
        title = 'Deactivate Users';
        message = `Deactivate ${userIds?.length} selected user(s)?`;
        onConfirm = async () => {
          try {
            const response = await API.call(API.users.bulkUserActions, {
              action: 'deactivate',
              userIds
            });
            if (response.success) {
              await loadUsers();
              await loadStats();
              setSelectedUsers([]);
              showNotification(`Deactivated ${response.data.affected_count || userIds.length} user(s)`, 'success');
            } else {
              showNotification(response.error || 'Failed to deactivate users', 'error');
            }
          } catch (error) {
            console.error('Error deactivating users:', error);
            showNotification('Failed to deactivate users', 'error');
          }
        };
        break;
      
      case 'suspend':
        title = 'Suspend Users';
        message = `Suspend ${userIds?.length} selected user(s)?`;
        onConfirm = async () => {
          try {
            const response = await API.call(API.users.bulkUserActions, {
              action: 'suspend',
              userIds
            });
            if (response.success) {
              await loadUsers();
              await loadStats();
              setSelectedUsers([]);
              showNotification(`Suspended ${response.data.affected_count || userIds.length} user(s)`, 'success');
            } else {
              showNotification(response.error || 'Failed to suspend users', 'error');
            }
          } catch (error) {
            console.error('Error suspending users:', error);
            showNotification('Failed to suspend users', 'error');
          }
        };
        break;
      
      case 'changeRole':
        const role = prompt('Enter new role (admin, manager, developer, auditor, viewer, user):');
        if (!role) return;
        
        title = 'Change User Role';
        message = `Change role to "${role}" for ${userIds?.length} selected user(s)?`;
        onConfirm = async () => {
          try {
            const response = await API.call(API.users.bulkUserActions, {
              action: 'changeRole',
              userIds,
              role
            });
            if (response.success) {
              await loadUsers();
              await loadStats();
              setSelectedUsers([]);
              showNotification(`Updated role for ${response.data.affected_count || userIds.length} user(s)`, 'success');
            } else {
              showNotification(response.error || 'Failed to update user roles', 'error');
            }
          } catch (error) {
            console.error('Error updating user roles:', error);
            showNotification('Failed to update user roles', 'error');
          }
        };
        break;
      
      case 'changeDepartment':
        const department = prompt('Enter new department:');
        if (!department) return;
        
        title = 'Change Department';
        message = `Change department to "${department}" for ${userIds?.length} selected user(s)?`;
        onConfirm = async () => {
          try {
            const response = await API.call(API.users.bulkUserActions, {
              action: 'changeDepartment',
              userIds,
              department
            });
            if (response.success) {
              await loadUsers();
              await loadStats();
              setSelectedUsers([]);
              showNotification(`Updated department for ${response.data.affected_count || userIds.length} user(s)`, 'success');
            } else {
              showNotification(response.error || 'Failed to update departments', 'error');
            }
          } catch (error) {
            console.error('Error updating departments:', error);
            showNotification('Failed to update departments', 'error');
          }
        };
        break;
      
      case 'delete':
        title = 'Delete Users';
        message = `Delete ${userIds?.length} selected user(s)? This action cannot be undone.`;
        onConfirm = async () => {
          try {
            const response = await API.call(API.users.bulkUserActions, {
              action: 'delete',
              userIds
            });
            if (response.success) {
              await loadUsers();
              await loadStats();
              setSelectedUsers([]);
              showNotification(`Deleted ${response.data.affected_count || userIds.length} user(s)`, 'success');
            } else {
              showNotification(response.error || 'Failed to delete users', 'error');
            }
          } catch (error) {
            console.error('Error deleting users:', error);
            showNotification('Failed to delete users', 'error');
          }
        };
        break;
      
      case 'resetPasswords':
        title = 'Reset Passwords';
        message = `Send password reset emails to ${userIds?.length} selected user(s)?`;
        onConfirm = async () => {
          try {
            // Note: This endpoint needs to be implemented in the backend
            const response = await API.call(API.users.bulkResetPasswords, { userIds });
            if (response.success) {
              showNotification(`Password reset emails sent to ${response.data.success_count || userIds.length} user(s)`, 'success');
            } else {
              showNotification(response.error || 'Failed to reset passwords', 'error');
            }
          } catch (error) {
            console.error('Error resetting passwords:', error);
            showNotification('Failed to reset passwords', 'error');
          }
        };
        break;
      
      case 'sendInvites':
        // For bulk invites, we need to collect email addresses
        // This would typically open a modal with a form
        showNotification('Bulk invite feature would open a form to collect email addresses', 'info');
        return;
      
      default:
        return;
    }
    
    setConfirmAction({
      type: action,
      title,
      message,
      onConfirm
    });
    setShowConfirmModal(true);
  };

  const handleInviteUser = async (userData) => {
    try {
      const invitationData = {
        email: userData.email,
        role: userData.role,
        name: userData.name,
        phone: userData.phone,
        department: userData.department,
        message: userData.message
      };
      
      const response = await API.call(API.users.inviteUser, invitationData);
      
      if (response.success) {
        // Refresh data
        await Promise.all([
          loadUsers(),
          loadStats(),
          loadInvitations()
        ]);
        
        // Show success notification
        showNotification(response.data?.message || 'Invitation sent successfully!', 'success');
        
        // Return success to modal
        return { 
          success: true, 
          message: response.data?.message || 'Invitation sent successfully' 
        };
      } else {
        let errorMessage = response.error || 'Failed to send invitation';
        
        // Map common errors to user-friendly messages
        const errorMap = {
          'User already exists in this organization': 'This user is already a member of your organization.',
          'Invitation already sent to this email': 'An invitation has already been sent to this email address.',
          'Invalid email format': 'Please enter a valid email address.',
          'Invalid role': 'Please select a valid role.',
          'Insufficient permissions': 'You do not have permission to invite users.',
          'Organization not found': 'Organization not found. Please contact support.',
          'User with this email already exists': 'A user with this email already exists.'
        };
        
        errorMessage = errorMap[errorMessage] || errorMessage;
        
        // Return error to modal
        return { 
          success: false, 
          error: errorMessage 
        };
      }
    } catch (error) {
      console.error('Error inviting user:', error);
      
      let errorMessage = 'Failed to send invitation';
      
      if (error.response?.data?.error) {
        const serverError = error.response.data.error;
        
        const errorMap = {
          'User already exists in this organization': 'This user is already a member of your organization.',
          'Invitation already sent to this email': 'An invitation has already been sent to this email address.',
          'Invalid email format': 'Please enter a valid email address.',
          'Invalid role': 'Please select a valid role.',
          'Insufficient permissions': 'You do not have permission to invite users.',
          'Organization not found': 'Organization not found. Please contact support.',
          'User with this email already exists': 'A user with this email already exists.'
        };
        
        errorMessage = errorMap[serverError] || serverError;
      }
      
      showNotification(errorMessage, 'error');
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      // Prepare update data
      const updateData = {};
      
      if (updatedUser.name !== selectedUser.name) {
        updateData.name = updatedUser.name;
      }
      if (updatedUser.phone !== selectedUser.phone) {
        updateData.phone = updatedUser.phone;
      }
      if (updatedUser.department !== selectedUser.department) {
        updateData.department = updatedUser.department;
      }
      if (updatedUser.role !== selectedUser.role) {
        updateData.role = updatedUser.role.toLowerCase();
      }
      if (updatedUser.status !== selectedUser.status) {
        updateData.status = updatedUser.status.toLowerCase();
      }
      
      // Only send if there are changes
      if (Object.keys(updateData).length === 0) {
        showNotification('No changes to update', 'info');
        return;
      }
      
      const response = await API.call(API.users.updateUser, updatedUser.id, updateData);
      if (response.success) {
        await loadUsers();
        await loadStats();
        setShowEditModal(false);
        setSelectedUser(null);
        showNotification('User updated successfully', 'success');
      } else {
        showNotification(response.error || 'Failed to update user', 'error');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      showNotification('Failed to update user', 'error');
    }
  };

  const handleConfirmAction = () => {
    if (confirmAction?.onConfirm) {
      confirmAction.onConfirm();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
    setSelectedUser(null);
  };

  // Handle invitation actions
  const handleResendInvitation = async (invitationId) => {
    try {
      const response = await API.call(API.users.resendInvitation, invitationId);
      if (response.success) {
        await loadInvitations();
        showNotification('Invitation resent successfully', 'success');
      } else {
        showNotification(response.error || 'Failed to resend invitation', 'error');
      }
    } catch (error) {
      console.error('Error resending invitation:', error);
      showNotification('Failed to resend invitation', 'error');
    }
  };

  const handleCancelInvitation = async (invitationId) => {
    try {
      const response = await API.call(API.users.cancelInvitation, invitationId);
      if (response.success) {
        await loadInvitations();
        showNotification('Invitation cancelled successfully', 'success');
      } else {
        showNotification(response.error || 'Failed to cancel invitation', 'error');
      }
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      showNotification('Failed to cancel invitation', 'error');
    }
  };

  // Format role for display
  const formatRole = (role) => {
    return API.userHelpers.normalizeRole(role);
  };

  // Format time until expiry
  const formatTimeUntil = (expiresAt) => {
    if (!expiresAt) return 'Never';
    
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diffMs = expiry - now;
    
    if (diffMs <= 0) return 'Expired';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`;
    } else if (diffHours > 0) {
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffHours}h ${diffMinutes}m`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}m`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Notification */}
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => closeNotification(notification.id)}
          position="bottom-right"
        />
      ))}

      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'}`}>
        <Header onMenuToggle={handleSidebarToggle} isSidebarCollapsed={isSidebarCollapsed} />
        
        <main className="pt-16 lg:pt-16">
          <div className="p-6 space-y-6">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <Breadcrumb />
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  User Management
                </h1>
                <p className="text-muted-foreground">
                  Manage organizational users with role-based access control and security monitoring.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {stats && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-sm font-medium text-foreground">
                      {stats.totalUsers || 0} Active
                    </p>
                  </div>
                )}
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="btn-glow bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-primary/90 transition-colors duration-200"
                >
                  <span className="text-lg">+</span>
                  <span>Invite User</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="glass-card rounded-lg p-1">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    activeTab === 'users'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  Users ({users.length})
                </button>
                <button
                  onClick={() => setActiveTab('invitations')}
                  className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    activeTab === 'invitations'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  Pending Invitations ({invitations.length})
                </button>
              </div>
            </div>

            {/* Users Tab */}
            {activeTab === 'users' && (
              <>
                {/* Filters */}
                <UserFilters 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />

                {/* Bulk Actions */}
                {selectedUsers?.length > 0 && (
                  <BulkActionsBar
                    selectedCount={selectedUsers?.length}
                    onBulkAction={handleBulkAction}
                    selectedUserIds={selectedUsers}
                  />
                )}

                {/* Loading State */}
                {loading && (
                  <div className="glass-card rounded-lg p-12 text-center">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading users...</p>
                  </div>
                )}

                {/* Error State */}
                {error && !loading && (
                  <div className="glass-card rounded-lg p-6 bg-error/10 border border-error/20">
                    <div className="flex items-center space-x-3">
                      <span className="text-error text-xl">⚠</span>
                      <div>
                        <h3 className="font-medium text-foreground">Error Loading Users</h3>
                        <p className="text-sm text-muted-foreground">{error}</p>
                        <button
                          onClick={loadUsers}
                          className="mt-2 text-sm text-primary hover:text-primary/80"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Users Table */}
                {!loading && !error && (
                  <div className="glass-card rounded-lg overflow-hidden relative z-10">
                    <UserTable
                      users={filteredUsers}
                      selectedUsers={selectedUsers}
                      onSelectUser={handleSelectUser}
                      onSelectAll={handleSelectAll}
                      onEditUser={handleEditUser}
                      onViewDetails={handleViewUserDetails}
                      onDeleteUser={handleDeleteUser}
                      onResetPassword={handleResetPassword}
                    />
                  </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredUsers?.length === 0 && (
                  <div className="glass-card rounded-lg p-12 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">👥</span>
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">No Users Found</h3>
                    <p className="text-muted-foreground mb-6">
                      {users?.length === 0 
                        ? "Get started by inviting your first user to the organization." 
                        : "No users match your current filter criteria. Try adjusting your filters."
                      }
                    </p>
                    {users?.length === 0 && (
                      <button
                        onClick={() => setShowInviteModal(true)}
                        className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
                      >
                        Invite First User
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Invitations Tab */}
            {activeTab === 'invitations' && (
              <>
                {/* Invitations Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-foreground">Pending Invitations</h3>
                    <p className="text-sm text-muted-foreground">
                      Invitations that have been sent but not yet accepted
                    </p>
                  </div>
                  <button
                    onClick={loadInvitations}
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    disabled={loadingInvitations}
                  >
                    Refresh
                  </button>
                </div>

                {/* Loading Invitations */}
                {loadingInvitations && (
                  <div className="glass-card rounded-lg p-8 text-center">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading invitations...</p>
                  </div>
                )}

                {/* Invitations List */}
                {!loadingInvitations && invitations.length > 0 && (
                  <div className="space-y-4">
                    {invitations.map(invitation => (
                      <div key={invitation.id} className="glass-card rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">
                                  {invitation.email.substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-medium text-foreground">
                                  {invitation.name || invitation.email}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {invitation.email}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleResendInvitation(invitation.id)}
                              className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors duration-200"
                              title="Resend Invitation"
                            >
                              Resend
                            </button>
                            <button
                              onClick={() => handleCancelInvitation(invitation.id)}
                              className="px-3 py-1 text-sm bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors duration-200"
                              title="Cancel Invitation"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Role</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {formatRole(invitation.role)}
                            </span>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Department</p>
                            <p className="text-foreground">{invitation.department || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Expires In</p>
                            <p className={`text-foreground font-medium ${
                              invitation.expiresIn?.includes('Expired') ? 'text-error' :
                              invitation.expiresIn?.includes('d') ? 'text-success' : 'text-warning'
                            }`}>
                              {formatTimeUntil(invitation.expiresAt)}
                            </p>
                          </div>
                        </div>
                        
                        {invitation.message && (
                          <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                            <p className="text-sm text-muted-foreground italic">"{invitation.message}"</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* No Invitations */}
                {!loadingInvitations && invitations.length === 0 && (
                  <div className="glass-card rounded-lg p-12 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📨</span>
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">No Pending Invitations</h3>
                    <p className="text-muted-foreground mb-6">
                      All invitations have been accepted or expired. Send a new invitation to add users.
                    </p>
                    <button
                      onClick={() => setShowInviteModal(true)}
                      className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
                    >
                      Send New Invitation
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {showInviteModal && (
        <InviteUserModal
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInviteUser}
        />
      )}

      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onUpdate={handleUpdateUser}
        />
      )}

      {showDetailsModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {showConfirmModal && confirmAction && (
        <ConfirmationModal
          title={confirmAction?.title}
          message={confirmAction?.message}
          onConfirm={handleConfirmAction}
          onCancel={() => {
            setShowConfirmModal(false);
            setConfirmAction(null);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;