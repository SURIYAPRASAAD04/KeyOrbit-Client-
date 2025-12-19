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
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    department: '',
    activity: '',
    search: ''
  });

  // Mock users data
  useEffect(() => {
    const mockUsers = [
      {
        id: 1,
        name: 'Sarah Chen',
        email: 'sarah.chen@keyorbit.com',
        role: 'Administrator',
        status: 'Active',
        department: 'Security',
        lastActivity: '2 hours ago',
        permissions: ['Read', 'Write', 'Admin', 'Audit'],
        avatar: null,
        joinDate: '2024-01-15',
        phone: '+1 (555) 123-4567'
      },
      {
        id: 2,
        name: 'Marcus Rodriguez',
        email: 'marcus.r@keyorbit.com',
        role: 'Developer',
        status: 'Active',
        department: 'Engineering',
        lastActivity: '1 day ago',
        permissions: ['Read', 'Write'],
        avatar: null,
        joinDate: '2024-02-20',
        phone: '+1 (555) 987-6543'
      },
      {
        id: 3,
        name: 'Emma Thompson',
        email: 'emma.t@keyorbit.com',
        role: 'Auditor',
        status: 'Inactive',
        department: 'Compliance',
        lastActivity: '1 week ago',
        permissions: ['Read', 'Audit'],
        avatar: null,
        joinDate: '2023-11-10',
        phone: '+1 (555) 456-7890'
      },
      {
        id: 4,
        name: 'Alex Johnson',
        email: 'alex.johnson@keyorbit.com',
        role: 'Manager',
        status: 'Active',
        department: 'Operations',
        lastActivity: '3 hours ago',
        permissions: ['Read', 'Write', 'Manage'],
        avatar: null,
        joinDate: '2024-03-05',
        phone: '+1 (555) 321-0987'
      }
    ];
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  // Filter users based on applied filters
  useEffect(() => {
    let filtered = users;

    if (filters?.search) {
      filtered = filtered?.filter(user =>
        user?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        user?.email?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        user?.department?.toLowerCase()?.includes(filters?.search?.toLowerCase())
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

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setConfirmAction({
      type: 'delete',
      title: 'Delete User',
      message: `Are you sure you want to delete ${user?.name}? This action cannot be undone.`
    });
    setShowConfirmModal(true);
  };

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    setConfirmAction({
      type: 'reset',
      title: 'Reset Password',
      message: `Reset password for ${user?.name}? They will receive an email with instructions.`
    });
    setShowConfirmModal(true);
  };

  const handleBulkAction = (action, userIds) => {
    setConfirmAction({
      type: action,
      title: `${action?.charAt(0)?.toUpperCase() + action?.slice(1)} Users`,
      message: `Apply ${action} action to ${userIds?.length} selected users?`,
      userIds
    });
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    // Handle different confirmation actions
    console.log('Confirmed action:', confirmAction);
    setShowConfirmModal(false);
    setConfirmAction(null);
    setSelectedUser(null);
    setSelectedUsers([]);
  };

  const handleInviteUser = (userData) => {
    const newUser = {
      id: users?.length + 1,
      ...userData,
      status: 'Active',
      lastActivity: 'Just now',
      joinDate: new Date()?.toISOString()?.split('T')?.[0]
    };
    setUsers([...users, newUser]);
    setShowInviteModal(false);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(users?.map(user => 
      user?.id === updatedUser?.id ? updatedUser : user
    ));
    setShowEditModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-background">
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
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-sm font-medium text-foreground">
                    {filteredUsers?.length} of {users?.length}
                  </p>
                </div>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="btn-glow bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-primary/90 transition-colors duration-200"
                >
                  <span className="text-lg">+</span>
                  <span>Invite User</span>
                </button>
              </div>
            </div>

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

            {/* Users Table */}
            <div className="glass-card rounded-lg overflow-hidden">
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

            {/* Empty State */}
            {filteredUsers?.length === 0 && (
              <div className="glass-card rounded-lg p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No Users Found</h3>
                <p className="text-muted-foreground mb-6">
                  {users?.length === 0 
                    ? "Get started by inviting your first user to the organization." :"No users match your current filter criteria. Try adjusting your filters."
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