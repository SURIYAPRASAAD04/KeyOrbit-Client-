// dateUtils.js - Enhanced with proper UTC to IST conversion

export const formatUTCDate = (dateString, options = {}) => {
  if (!dateString) return 'Never';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    
    // Always use Asia/Kolkata for IST
    const timeZone = 'Asia/Kolkata';
    
    return new Intl.DateTimeFormat('en-IN', {
      ...defaultOptions,
      timeZone
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const formatDateTimeIST = (dateString, options = {}) => {
  if (!dateString) return 'Never';
  
  try {
    // Ensure the date string is treated as UTC
    let date;
    if (dateString.includes('Z')) {
      // Already has UTC indicator
      date = new Date(dateString);
    } else if (dateString.includes('+')) {
      // Has timezone offset
      date = new Date(dateString);
    } else {
      // Assume it's UTC and add Z
      date = new Date(dateString + 'Z');
    }
    
    if (isNaN(date.getTime())) {
      // Try without Z as fallback
      date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
    }
    
    // Default options for IST display
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
      ...options
    };
    
    return new Intl.DateTimeFormat('en-IN', defaultOptions).format(date);
  } catch (error) {
    console.error('Error formatting date time IST:', error);
    return 'Invalid date';
  }
};

export const formatShortDateTimeIST = (dateString) => {
  if (!dateString) return 'Never';
  
  try {
    // Ensure the date string is treated as UTC
    let date;
    if (dateString.includes('Z')) {
      date = new Date(dateString);
    } else if (dateString.includes('+')) {
      date = new Date(dateString);
    } else {
      date = new Date(dateString + 'Z');
    }
    
    if (isNaN(date.getTime())) {
      date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    }).format(date);
  } catch (error) {
    console.error('Error formatting short date time IST:', error);
    return 'Invalid date';
  }
};

export const formatDateOnlyIST = (dateString) => {
  if (!dateString) return 'Never';
  
  try {
    // Ensure the date string is treated as UTC
    let date;
    if (dateString.includes('Z')) {
      date = new Date(dateString);
    } else if (dateString.includes('+')) {
      date = new Date(dateString);
    } else {
      date = new Date(dateString + 'Z');
    }
    
    if (isNaN(date.getTime())) {
      date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date only IST:', error);
    return 'Invalid date';
  }
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'Never used';
  
  try {
    // Ensure the date string is treated as UTC
    let date;
    if (dateString.includes('Z')) {
      date = new Date(dateString);
    } else if (dateString.includes('+')) {
      date = new Date(dateString);
    } else {
      date = new Date(dateString + 'Z');
    }
    
    if (isNaN(date.getTime())) {
      date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
    }
    
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 30) {
      const months = Math.floor(diffDay / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else if (diffDay > 0) {
      return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
    } else if (diffHour > 0) {
      return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffSec > 30) {
      return `${diffSec} seconds ago`;
    } else {
      return 'Just now';
    }
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid date';
  }
};

export const formatExpiryTime = (expiresAt, expiresIn = null, daysUntilExpiry = null) => {
  if (!expiresAt) return 'Never expires';
  
  try {
    // If expiresIn is provided, use it (most accurate)
    if (expiresIn) {
      return expiresIn === 'Expired' ? 'Expired' : expiresIn;
    }
    
    // Otherwise calculate from date and daysUntilExpiry
    if (daysUntilExpiry !== undefined && daysUntilExpiry !== null) {
      if (daysUntilExpiry <= 0) return 'Expired';
      return `${daysUntilExpiry}d`;
    }
    
    // Fallback: calculate from date
    let expiryDate;
    if (expiresAt.includes('Z')) {
      expiryDate = new Date(expiresAt);
    } else if (expiresAt.includes('+')) {
      expiryDate = new Date(expiresAt);
    } else {
      expiryDate = new Date(expiresAt + 'Z');
    }
    
    if (isNaN(expiryDate.getTime())) {
      expiryDate = new Date(expiresAt);
      if (isNaN(expiryDate.getTime())) return 'Invalid date';
    }
    
    const now = new Date();
    if (expiryDate <= now) return 'Expired';
    
    // Calculate exact days difference
    const diffMs = expiryDate - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `${diffDays}d`;
    } else {
      const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
      return `${diffHours}h`;
    }
  } catch (error) {
    console.error('Error formatting expiry time:', error);
    return 'Invalid date';
  }
};

export const getRemainingTime = (expiresAt) => {
  if (!expiresAt) return { text: 'Never expires', days: null };
  
  try {
    let expiryDate;
    if (expiresAt.includes('Z')) {
      expiryDate = new Date(expiresAt);
    } else if (expiresAt.includes('+')) {
      expiryDate = new Date(expiresAt);
    } else {
      expiryDate = new Date(expiresAt + 'Z');
    }
    
    if (isNaN(expiryDate.getTime())) {
      expiryDate = new Date(expiresAt);
      if (isNaN(expiryDate.getTime())) return { text: 'Invalid date', days: null };
    }
    
    const now = new Date();
    if (expiryDate <= now) return { text: 'Expired', days: 0 };
    
    // Calculate exact days difference (round up to be safe)
    const diffMs = expiryDate - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return { 
        text: `${diffDays}d ${diffHours}h`,
        days: diffDays,
        hours: diffHours
      };
    } else if (diffHours > 0) {
      return { 
        text: `${diffHours}h ${diffMinutes}m`,
        days: 0,
        hours: diffHours
      };
    } else {
      return { 
        text: `${diffMinutes}m`,
        days: 0,
        hours: 0
      };
    }
  } catch (error) {
    console.error('Error getting remaining time:', error);
    return { text: 'Invalid date', days: null };
  }
};

export const calculateDaysUntilExpiry = (expiresAt) => {
  if (!expiresAt) return null;
  
  try {
    let expiryDate;
    if (expiresAt.includes('Z')) {
      expiryDate = new Date(expiresAt);
    } else if (expiresAt.includes('+')) {
      expiryDate = new Date(expiresAt);
    } else {
      expiryDate = new Date(expiresAt + 'Z');
    }
    
    if (isNaN(expiryDate.getTime())) {
      expiryDate = new Date(expiresAt);
      if (isNaN(expiryDate.getTime())) return null;
    }
    
    const now = new Date();
    const diffMs = expiryDate - now;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.error('Error calculating days until expiry:', error);
    return null;
  }
};

export const formatDateForTable = (dateString) => {
  if (!dateString) return '--';
  
  try {
    let date;
    if (dateString.includes('Z')) {
      date = new Date(dateString);
    } else if (dateString.includes('+')) {
      date = new Date(dateString);
    } else {
      date = new Date(dateString + 'Z');
    }
    
    if (isNaN(date.getTime())) {
      date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid';
    }
    
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // Show relative time for recent dates
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return diffMinutes > 0 ? `${diffMinutes}m ago` : 'Just now';
      }
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)}w ago`;
    }
    
    // For older dates, show actual date in IST
    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    }).format(date);
  } catch (error) {
    console.error('Error formatting table date:', error);
    return 'Invalid';
  }
};

export const getTimezoneInfo = () => {
  try {
    // Always show IST timezone info
    const now = new Date();
    const istTime = now.toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return {
      timezone: 'Asia/Kolkata',
      offset: 'IST (UTC+5:30)',
      abbreviation: 'IST',
      isDST: false,
      currentTime: istTime
    };
  } catch (error) {
    return {
      timezone: 'Asia/Kolkata',
      offset: 'IST (UTC+5:30)',
      abbreviation: 'IST',
      isDST: false,
      currentTime: new Date().toLocaleString()
    };
  }
};

export const convertToIST = (dateString) => {
  if (!dateString) return null;
  
  try {
    let date;
    if (dateString.includes('Z')) {
      date = new Date(dateString);
    } else if (dateString.includes('+')) {
      date = new Date(dateString);
    } else {
      date = new Date(dateString + 'Z');
    }
    
    if (isNaN(date.getTime())) {
      date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
    }
    
    // Convert to IST (UTC+5:30)
    return new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
  } catch (error) {
    console.error('Error converting to IST:', error);
    return null;
  }
};

export const isTokenExpiringSoon = (expiresAt, daysThreshold = 7) => {
  if (!expiresAt) return false;
  
  try {
    let expiryDate;
    if (expiresAt.includes('Z')) {
      expiryDate = new Date(expiresAt);
    } else if (expiresAt.includes('+')) {
      expiryDate = new Date(expiresAt);
    } else {
      expiryDate = new Date(expiresAt + 'Z');
    }
    
    if (isNaN(expiryDate.getTime())) {
      expiryDate = new Date(expiresAt);
      if (isNaN(expiryDate.getTime())) return false;
    }
    
    const now = new Date();
    if (expiryDate <= now) return false;
    
    const diffMs = expiryDate - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    return diffDays <= daysThreshold;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return false;
  }
};

// Helper function to manually convert UTC to IST
export const manualUTCtoIST = (dateString) => {
  if (!dateString) return null;
  
  try {
    let date;
    if (dateString.includes('Z')) {
      date = new Date(dateString);
    } else if (dateString.includes('+')) {
      date = new Date(dateString);
    } else {
      // MongoDB dates don't have Z but are UTC
      date = new Date(dateString + 'Z');
    }
    
    if (isNaN(date.getTime())) {
      // Try without Z as fallback
      date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
    }
    
    // Add 5 hours 30 minutes for IST
    return new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
  } catch (error) {
    console.error('Error in manualUTCtoIST:', error);
    return null;
  }
};