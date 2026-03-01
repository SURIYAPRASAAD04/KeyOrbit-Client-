// Role utility functions
export const roleUtils = {
  // Normalize role to backend format
  normalizeRole: (role) => {
    if (!role) return 'user';
    
    const roleLower = role.toLowerCase();
    const roleMap = {
      'administrator': 'admin',
      'admin': 'admin',
      'manager': 'manager',
      'developer': 'developer',
      'programmer': 'developer',
      'engineer': 'developer',
      'security': 'developer',
      'auditor': 'auditor',
      'viewer': 'viewer',
      'user': 'user'
    };
    
    return roleMap[roleLower] || 'user';
  },
  
  // Get display name for role
  getRoleDisplay: (role) => {
    const roleMap = {
      'admin': 'Administrator',
      'administrator': 'Administrator',
      'manager': 'Manager',
      'developer': 'Developer',
      'auditor': 'Auditor',
      'viewer': 'Viewer',
      'user': 'User'
    };
    return roleMap[role] || role;
  },
  
  // Get permissions for role
  getRolePermissions: (role) => {
    const normalizedRole = roleUtils.normalizeRole(role);
    
    const permissionsMap = {
      'admin': ['Read', 'Write', 'Admin', 'Audit', 'Manage', 'Delete', 'Configure'],
      'manager': ['Read', 'Write', 'Manage', 'Audit'],
      'developer': ['Read', 'Write', 'Execute'],
      'auditor': ['Read', 'Audit', 'Export'],
      'viewer': ['Read'],
      'user': ['Read']
    };
    
    return permissionsMap[normalizedRole] || ['Read'];
  },
  
  // Check if user can perform action based on role
  canPerformAction: (userRole, action, targetRole = null) => {
    const normalizedUserRole = roleUtils.normalizeRole(userRole);
    const normalizedTargetRole = targetRole ? roleUtils.normalizeRole(targetRole) : null;
    
    // Role hierarchy (higher number = more permissions)
    const roleHierarchy = {
      'admin': 5,
      'manager': 4,
      'developer': 3,
      'auditor': 3,
      'viewer': 2,
      'user': 1
    };
    
    const userLevel = roleHierarchy[normalizedUserRole] || 0;
    
    // Check specific actions
    switch(action) {
      case 'invite_user':
        return normalizedUserRole === 'admin' || normalizedUserRole === 'manager';
      
      case 'delete_user':
        return normalizedUserRole === 'admin';
      
      case 'edit_user':
        if (!targetRole) return false;
        const targetLevel = roleHierarchy[normalizedTargetRole] || 0;
        return userLevel > targetLevel || normalizedUserRole === 'admin';
      
      case 'view_audit_logs':
        return ['admin', 'manager', 'auditor'].includes(normalizedUserRole);
      
      case 'manage_keys':
        return ['admin', 'manager', 'developer'].includes(normalizedUserRole);
      
      case 'manage_policies':
        return ['admin', 'manager'].includes(normalizedUserRole);
      
      default:
        return false;
    }
  },
  
  // Get all available roles for a user to assign
  getAssignableRoles: (currentUserRole) => {
    const normalizedRole = roleUtils.normalizeRole(currentUserRole);
    
    const allRoles = [
      { value: 'admin', label: 'Administrator' },
      { value: 'manager', label: 'Manager' },
      { value: 'developer', label: 'Developer' },
      { value: 'auditor', label: 'Auditor' },
      { value: 'viewer', label: 'Viewer' },
      { value: 'user', label: 'User' }
    ];
    
    // Admin can assign any role
    if (normalizedRole === 'admin') {
      return allRoles;
    }
    
    // Manager can assign roles below admin
    if (normalizedRole === 'manager') {
      return allRoles.filter(role => role.value !== 'admin');
    }
    
    // Others cannot assign roles
    return [];
  }
};