export const canPerformAction = (actionType: 'create' | 'view'): boolean => {
  const userType = localStorage.getItem('userType');
  const selectedPackage = localStorage.getItem('selectedPackage');
  const propertyLimit = parseInt(localStorage.getItem('propertyLimit') || '0');
  const propertiesUsed = parseInt(localStorage.getItem('propertiesUsed') || '0');
  
  if (!selectedPackage) {
    return false;
  }
  
  return propertiesUsed < propertyLimit;
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

export const hasValidPackage = (): boolean => {
  const selectedPackage = localStorage.getItem('selectedPackage');
  const packageExpiry = localStorage.getItem('packageExpiry');
  
  if (!selectedPackage || !packageExpiry) {
    return false;
  }
  
  const expiryDate = new Date(packageExpiry);
  return new Date() <= expiryDate;
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