import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggle }) => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      description: 'System overview and metrics'
    },
    {
      label: 'Key Management',
      path: '/key-management',
      icon: 'Key',
      description: 'Manage cryptographic keys'
    },
    {
      label: 'Audit Logs',
      path: '/audit-logs',
      icon: 'FileText',
      description: 'Security and compliance logs'
    },
    {
      label: 'API Tokens',
      path: '/api-tokens',
      icon: 'Code',
      description: 'Programmatic access tokens'
    },
    {
      label: 'Policy Management',
      path: '/policy-management',
      icon: 'Shield',
      description: 'Manage security policies and compliance'
    },
    {
      label: 'User Management',
      path: '/user-management',
      icon: 'Users',
      description: 'Manage user accounts and permissions'
    }
  ];

  const isActiveRoute = (path) => {
    if (path === '/key-management' && location?.pathname === '/key-details') {
      return true;
    }
    return location?.pathname === path;
  };

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
    if (onToggle) onToggle();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-200 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-300 lg:z-100 transition-all duration-300 ease-orbital
        ${isCollapsed ? 'w-20' : 'w-80'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        glass-nav border-r border-border
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className={`flex items-center px-6 py-4 border-b border-border ${isCollapsed ? 'justify-center px-4' : ''}`}>
            {isCollapsed ? (
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Orbit" size={20} className="text-primary-foreground" />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Orbit" size={24} className="text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">KeyOrbit</h1>
                  <p className="text-xs text-muted-foreground">KMS Enterprise</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`nav-item group relative ${isActiveRoute(item?.path) ? 'active' : ''}`}
                title={isCollapsed ? item?.label : ''}
              >
                <Icon 
                  name={item?.icon} 
                  size={20} 
                  className={`nav-item-icon ${isCollapsed ? 'mr-0' : ''}`} 
                />
                {!isCollapsed && (
                  <div className="flex-1">
                    <span className="block text-sm font-medium">{item?.label}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      {item?.description}
                    </span>
                  </div>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg shadow-orbital-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-300">
                    <div className="font-medium">{item?.label}</div>
                    <div className="text-xs text-muted-foreground">{item?.description}</div>
                  </div>
                )}
              </Link>
            ))}
          </nav>

          {/* Collapse Toggle (Desktop) */}
          <div className={`hidden lg:flex items-center px-4 py-4 border-t border-border ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && (
              <div className="text-xs text-muted-foreground">
                <div className="font-medium">System Status</div>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                  All systems operational
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="flex-shrink-0"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Icon 
                name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} 
                size={16} 
              />
            </Button>
          </div>

          {/* Mobile Close Button */}
          <div className="lg:hidden flex items-center justify-between px-4 py-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              <div className="font-medium">System Status</div>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                All systems operational
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close menu"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>
      </aside>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleMobileToggle}
        className="fixed top-4 left-4 z-300 lg:hidden glass-card"
        aria-label="Open menu"
      >
        <Icon name="Menu" size={20} />
      </Button>
    </>
  );
};

export default Sidebar;