import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ customItems = null }) => {
  const location = useLocation();

  const getDefaultBreadcrumbs = () => {
    const pathMap = {
      '/dashboard': [{ label: 'Dashboard', path: '/dashboard' }],
      '/key-management': [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Key Management', path: '/key-management' }
      ],
      '/key-details': [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Key Management', path: '/key-management' },
        { label: 'Key Details', path: '/key-details' }
      ],
      '/audit-logs': [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Audit Logs', path: '/audit-logs' }
      ],
      '/api-tokens': [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'API Tokens', path: '/api-tokens' }
      ]
    };

    return pathMap?.[location?.pathname] || [{ label: 'Dashboard', path: '/dashboard' }];
  };

  const breadcrumbs = customItems || getDefaultBreadcrumbs();

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <Icon name="Home" size={16} className="text-muted-foreground" />
      {breadcrumbs?.map((item, index) => (
        <React.Fragment key={item?.path || index}>
          {index > 0 && (
            <Icon name="ChevronRight" size={14} className="text-muted-foreground/60" />
          )}
          {index === breadcrumbs?.length - 1 ? (
            <span className="text-foreground font-medium truncate">
              {item?.label}
            </span>
          ) : (
            <Link
              to={item?.path}
              className="hover:text-primary transition-colors duration-150 truncate"
            >
              {item?.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;