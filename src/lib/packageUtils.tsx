// ✅ Enhanced package validation with expiry and limit checks

export interface PackageWarnings {
  nearExpiry: boolean;
  limitNearReached: boolean;
  expired: boolean;
  limitReached: boolean;
}

export interface PackageValidation {
  isValid: boolean;
  warnings: PackageWarnings;
  daysRemaining: number;
  remaining: number;
  reason?: string;
}

/**
 * Check if package has expired
 */
export const isPackageExpired = (): boolean => {
  const packageExpiry = localStorage.getItem('packageExpiry');

  if (!packageExpiry) {
    return true;
  }

  const expiryDate = new Date(packageExpiry);
  const now = new Date();

  return now > expiryDate;
};

/**
 * Check if package limit has been reached
 */
export const isLimitReached = (): boolean => {
  const propertyLimit = parseInt(localStorage.getItem('propertyLimit') || '0');
  const propertiesUsed = parseInt(localStorage.getItem('propertiesUsed') || '0');

  return propertiesUsed >= propertyLimit;
};

/**
 * Get days remaining until package expires
 */
export const getDaysRemaining = (): number => {
  const packageExpiry = localStorage.getItem('packageExpiry');

  if (!packageExpiry) {
    return 0;
  }

  const expiryDate = new Date(packageExpiry);
  const now = new Date();
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
};

/**
 * Comprehensive package validation
 * ✅ FIXED: Packages work across all roles, no userType validation
 */
export const validatePackage = (userType?: string): PackageValidation => {
  const selectedPackage = localStorage.getItem('selectedPackage');
  const packageUserType = localStorage.getItem('userType');
  const packageExpiry = localStorage.getItem('packageExpiry');
  const propertyLimit = parseInt(localStorage.getItem('propertyLimit') || '0');
  const propertiesUsed = parseInt(localStorage.getItem('propertiesUsed') || '0');

  // No package found
  if (!selectedPackage || !packageExpiry) {
    return {
      isValid: false,
      warnings: {
        nearExpiry: false,
        limitNearReached: false,
        expired: false,
        limitReached: false
      },
      daysRemaining: 0,
      remaining: 0,
      reason: 'no_package'
    };
  }

  // ✅ REMOVED: No longer check userType match - packages work across all roles

  const daysRemaining = getDaysRemaining();
  const remaining = Math.max(0, propertyLimit - propertiesUsed);
  const usagePercentage = (propertiesUsed / propertyLimit) * 100;

  // Calculate warnings
  const expired = isPackageExpired();
  const limitReached = isLimitReached();
  const nearExpiry = daysRemaining > 0 && daysRemaining <= 7; // 7 days warning
  const limitNearReached = usagePercentage >= 90; // 90% usage warning

  const isValid = !expired && !limitReached;

  return {
    isValid,
    warnings: {
      nearExpiry,
      limitNearReached,
      expired,
      limitReached
    },
    daysRemaining,
    remaining,
    reason: expired ? 'expired' : limitReached ? 'limit_reached' : undefined
  };
};

/**
 * Legacy function - kept for backward compatibility
 */
export const canPerformAction = (actionType: 'create' | 'view'): boolean => {
  const validation = validatePackage();
  return validation.isValid;
};

/**
 * Check if package is valid (not expired and has remaining quota)
 */
export const hasValidPackage = (): boolean => {
  const validation = validatePackage();
  return validation.isValid;
};

export const incrementPropertyCount = (): void => {
  const propertiesUsed = parseInt(localStorage.getItem('propertiesUsed') || '0');
  localStorage.setItem('propertiesUsed', (propertiesUsed + 1).toString());
};

export const getRemainingProperties = (): number => {
  const propertyLimit = parseInt(localStorage.getItem('propertyLimit') || '0');
  const propertiesUsed = parseInt(localStorage.getItem('propertiesUsed') || '0');
  return Math.max(0, propertyLimit - propertiesUsed);
};

export const resetPropertyCount = (): void => {
  localStorage.setItem('propertiesUsed', '0');
};

export const getPackageInfo = () => {
  return {
    packageType: localStorage.getItem('selectedPackage'),
    userType: localStorage.getItem('userType'),
    propertyLimit: parseInt(localStorage.getItem('propertyLimit') || '0'),
    propertiesUsed: parseInt(localStorage.getItem('propertiesUsed') || '0'),
    purchaseDate: localStorage.getItem('packagePurchaseDate'),
    expiryDate: localStorage.getItem('packageExpiry')
  };
};