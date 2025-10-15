import React, { useState, useEffect } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import RouterComponent from './components/Router';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { getUserPackageApi } from '@/lib/api';

interface UserPackage {
  _id?: string;
  packageType: string;
  userType: string;
  purchaseDate: string;
  expiryDate: string;
  propertyLimit: number;
  propertiesUsed: number;
  isActive: boolean;
  daysRemaining: number;
  amount: number;
  remaining: number;
}

interface AppState {
  isAuthenticated: boolean;
  userRole: string;
  userId: string;
  userName: string;
  userImage: string;
  currentLang: "en" | "mr";
  userPackage: UserPackage | null;
  originalRole: string;
}

// ✅ Navigation Wrapper Component
const AppContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [appState, setAppState] = useState<AppState>({
    isAuthenticated: false,
    userRole: '',
    userId: '',
    userName: '',
    userImage: '',
    currentLang: "en",
    userPackage: null,
    originalRole: ''
  });

  const [isAppInitialized, setIsAppInitialized] = useState(false);

  const translations = {
    en: {
      logoutSuccess: "Logged out successfully",
      logoutTitle: "Success",
      loginSuccess: "Login successful",
      loginTitle: "Welcome",
      packageLoaded: "Package loaded successfully",
      roleSwitched: "Role switched successfully",
      roleSwitchTitle: "Role Changed",
      switchToBuyer: "Switched to Buyer mode",
      switchToSeller: "Switched to Seller mode",
      appReady: "App is ready",
      loading: "Loading..."
    },
    mr: {
      logoutSuccess: "यशस्वीरित्या लॉग आउट केले",
      logoutTitle: "यश",
      loginSuccess: "लॉगिन यशस्वी",
      loginTitle: "स्वागत आहे",
      packageLoaded: "पॅकेज यशस्वीरित्या लोड केले",
      roleSwitched: "भूमिका यशस्वीरित्या बदलली",
      roleSwitchTitle: "भूमिका बदलली",
      switchToBuyer: "खरेदीदार मोडमध्ये बदलले",
      switchToSeller: "विक्रेता मोडमध्ये बदलले",
      appReady: "अॅप तयार आहे",
      loading: "लोड होत आहे..."
    }
  };

  const updateAppState = (updates: Partial<AppState>) => {
    console.log("🔄 App: Updating state", updates);
    setAppState(prev => ({ ...prev, ...updates }));
  };

  // ✅ FIXED: Enhanced Logout with Navigation
  const handleLogout = (): void => {
    console.log('🚪 App: Logging out user...');
    
    // Clear state first
    updateAppState({
      isAuthenticated: false,
      userRole: '',
      userId: '',
      userName: '',
      userImage: '',
      userPackage: null,
      originalRole: ''
    });
    
    // Clear all localStorage items
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userImage');
    localStorage.removeItem('originalRole');
    localStorage.removeItem('currentRole'); // Clear current role too
    clearPackageFromLocalStorage();
    
    const t = translations[appState.currentLang];
    toast({
      title: t.logoutTitle,
      description: t.logoutSuccess,
    });

    // CRITICAL: Redirect to home page using navigate
    console.log('🏠 App: Redirecting to home page...');
    navigate('/');
    
    // Force reload to ensure clean state
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // ✅ IMPROVED: Load package with current role
  const loadUserPackage = async (userId: string, role?: string) => {
    if (!userId) return;

    try {
      const currentRole = role || appState.userRole;
      console.log('🔄 Loading package for role:', currentRole);
      
      const response = await getUserPackageApi(currentRole);
      if (response.success && response.package) {
        updateAppState({ userPackage: response.package });
        
        // ✅ Store with role-specific keys
        localStorage.setItem('selectedPackage', response.package.packageType);
        localStorage.setItem('userType', response.package.userType);
        localStorage.setItem('propertyLimit', response.package.propertyLimit.toString());
        localStorage.setItem('propertiesUsed', response.package.propertiesUsed.toString());
        localStorage.setItem('packagePurchaseDate', response.package.purchaseDate);
        localStorage.setItem('packageExpiry', response.package.expiryDate);
        
        console.log('✅ Package loaded for role:', currentRole, response.package);
      } else {
        console.log('ℹ️ No active package found for role:', currentRole);
        // Clear package data when no package found
        updateAppState({ userPackage: null });
        clearPackageFromLocalStorage();
      }
    } catch (error) {
      console.log('❌ Error loading package:', error);
      updateAppState({ userPackage: null });
      clearPackageFromLocalStorage();
    }
  };

  const clearPackageFromLocalStorage = () => {
    localStorage.removeItem('selectedPackage');
    localStorage.removeItem('userType');
    localStorage.removeItem('propertyLimit');
    localStorage.removeItem('propertiesUsed');
    localStorage.removeItem('packagePurchaseDate');
    localStorage.removeItem('packageExpiry');
  };

  const loadPackageFromLocalStorage = () => {
    const selectedPackage = localStorage.getItem('selectedPackage');
    const userType = localStorage.getItem('userType');
    const propertyLimit = localStorage.getItem('propertyLimit');
    const propertiesUsed = localStorage.getItem('propertiesUsed');
    const packageExpiry = localStorage.getItem('packageExpiry');

    if (selectedPackage && userType && propertyLimit && packageExpiry) {
      const expiryDate = new Date(packageExpiry);
      const now = new Date();
      
      if (now <= expiryDate) {
        const userPackage: UserPackage = {
          packageType: selectedPackage,
          userType: userType,
          purchaseDate: localStorage.getItem('packagePurchaseDate') || now.toISOString(),
          expiryDate: packageExpiry,
          propertyLimit: parseInt(propertyLimit),
          propertiesUsed: parseInt(propertiesUsed || '0'),
          isActive: true,
          daysRemaining: Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
          amount: selectedPackage === 'free' ? 0 : selectedPackage === 'silver' ? 499 : selectedPackage === 'gold' ? 999 : 1999,
          remaining: parseInt(propertyLimit) - parseInt(propertiesUsed || '0')
        };
        
        updateAppState({ userPackage });
      } else {
        // Package expired, clear it
        clearPackageFromLocalStorage();
        updateAppState({ userPackage: null });
      }
    }
  };

  const handleLogin = (token: string, role: string, userId: string, name: string, image: string = ''): void => {
    console.log("🔄 App: handleLogin called", { userId, role, name, hasImage: !!image });
    
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    // ✅ CRITICAL: Initialize currentRole on login
    localStorage.setItem('currentRole', role);
    
    const newState: Partial<AppState> = {
      isAuthenticated: true,
      userRole: role,
      userId: userId,
      userName: capitalizedName,
      userImage: image,
      originalRole: role
    };
    
    updateAppState(newState);
    
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', capitalizedName);
    localStorage.setItem('originalRole', role);
    
    if (image) {
      localStorage.setItem('userImage', image);
      console.log("✅ App: Image saved to localStorage");
    }

    // Load package for the logged-in role
    loadUserPackage(userId, role);

    const t = translations[appState.currentLang];
    toast({
      title: t.loginTitle,
      description: `${t.loginSuccess}, ${capitalizedName}!`,
    });

    // ✅ Redirect after login based on role
    const redirectPath = role === "seller" ? "/listings" : "/";
    console.log('📍 Redirecting to:', redirectPath);
    navigate(redirectPath);
  };

  // ✅ FIXED: Role Switch Function with proper navigation
  const handleRoleSwitch = async (newRole: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Error",
          description: "Please login again",
          variant: "destructive"
        });
        return;
      }

      console.log('🔄 Switching role from', appState.userRole, 'to', newRole);

      // ✅ CRITICAL: Update both state AND localStorage immediately
      updateAppState({ 
        userRole: newRole,
        userPackage: null // Clear package when switching roles
      });
      
      // ✅ Store in localStorage for API calls - THIS IS CRITICAL
      localStorage.setItem('currentRole', newRole);
      localStorage.setItem('role', newRole);

      // ✅ Clear old package data
      clearPackageFromLocalStorage();

      // ✅ Load package for new role
      await loadUserPackage(appState.userId, newRole);

      const t = translations[appState.currentLang];
      const roleMessage = newRole === 'buyer' ? t.switchToBuyer : t.switchToSeller;
      
      toast({
        title: t.roleSwitchTitle,
        description: roleMessage,
      });

      // ✅ Navigate to appropriate page
      const redirectPath = newRole === 'seller' ? '/listings' : '/';
      console.log('📍 Role switch redirect to:', redirectPath);
      navigate(redirectPath);

      // ✅ Force reload to ensure clean state
      setTimeout(() => {
        window.location.reload();
      }, 100);

    } catch (error) {
      console.error('❌ Role switch error:', error);
      toast({
        title: "Error",
        description: "Failed to switch role",
        variant: "destructive"
      });
    }
  };

  // ✅ FIXED: Update Profile Function with proper image handling
  const handleUpdateProfile = (name: string, email: string, phone: string, image: string): void => {
    console.log("🔄 App: handleUpdateProfile called", { 
      name, 
      email, 
      phone, 
      hasImage: !!image,
      imageLength: image?.length 
    });
    
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    updateAppState({ 
      userName: capitalizedName,
      userImage: image
    });
    
    localStorage.setItem('userName', capitalizedName);
    if (image) {
      localStorage.setItem('userImage', image);
      console.log("✅ App: Image updated in state and localStorage");
    } else {
      localStorage.removeItem('userImage');
      console.log("✅ App: Image removed from state and localStorage");
    }
  };

  const handlePackageUpdate = (newPackage: UserPackage) => {
    updateAppState({ userPackage: newPackage });
    
    localStorage.setItem('selectedPackage', newPackage.packageType);
    localStorage.setItem('userType', newPackage.userType);
    localStorage.setItem('propertyLimit', newPackage.propertyLimit.toString());
    localStorage.setItem('propertiesUsed', newPackage.propertiesUsed.toString());
    localStorage.setItem('packagePurchaseDate', newPackage.purchaseDate);
    localStorage.setItem('packageExpiry', newPackage.expiryDate);
    
    const t = translations[appState.currentLang];
    toast({
      title: "Package Updated",
      description: `${newPackage.packageType} package activated successfully!`
    });
  };

  const handleLanguageChange = (lang: "en" | "mr"): void => {
    updateAppState({ currentLang: lang });
  };

  // ✅ IMPROVED: App Initialization with better error handling
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("🎯 App: Starting initialization...");
        
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');
        const userImage = localStorage.getItem('userImage');
        const originalRole = localStorage.getItem('originalRole');
        
        console.log("🔄 App: Initializing from localStorage", { 
          hasToken: !!token, 
          userId, 
          role, 
          userName,
          hasImage: !!userImage 
        });
        
        if (token && role && userId) {
          // ✅ CRITICAL: Initialize currentRole if not set
          let currentRole = localStorage.getItem('currentRole');
          if (!currentRole) {
            currentRole = role;
            localStorage.setItem('currentRole', currentRole);
            console.log("✅ App: Set currentRole from role:", currentRole);
          } else {
            console.log("✅ App: Using existing currentRole:", currentRole);
          }
          
          const newState: Partial<AppState> = {
            isAuthenticated: true,
            userRole: currentRole,
            userId: userId,
            userName: userName || '',
            userImage: userImage || '',
            originalRole: originalRole || role
          };
          
          updateAppState(newState);
          
          // Load package for the current role
          await loadUserPackage(userId, currentRole);
        } else {
          // Clear everything if not authenticated
          console.log("🔒 App: No valid authentication found, clearing state");
          clearPackageFromLocalStorage();
          localStorage.removeItem('originalRole');
          localStorage.removeItem('currentRole');
        }

        // Mark app as initialized
        setIsAppInitialized(true);
        console.log("✅ App: Initialization completed successfully");

        const t = translations[appState.currentLang];
        toast({
          title: t.appReady,
          description: "Application is now ready to use",
        });

      } catch (error) {
        console.error('❌ App: Initialization error:', error);
        setIsAppInitialized(true); // Still mark as initialized to show UI
        
        toast({
          title: "Initialization Error",
          description: "There was an issue loading the application",
          variant: "destructive"
        });
      }
    };

    initializeApp();
  }, []);

  // Debug current state
  useEffect(() => {
    if (isAppInitialized) {
      console.log('🔍 App State Updated:', {
        isAuthenticated: appState.isAuthenticated,
        userRole: appState.userRole,
        userId: appState.userId,
        userName: appState.userName,
        hasImage: !!appState.userImage,
        imageLength: appState.userImage?.length,
        hasPackage: !!appState.userPackage,
        packageType: appState.userPackage?.packageType,
        currentRoleFromStorage: localStorage.getItem('currentRole')
      });
    }
  }, [appState, isAppInitialized]);

  // ✅ Loading state while app initializes
  if (!isAppInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{translations[appState.currentLang].loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentLang={appState.currentLang} 
        onLanguageChange={handleLanguageChange} 
        isLoggedIn={appState.isAuthenticated} 
        onLogout={handleLogout} 
        userRole={appState.userRole} 
        userName={appState.userName}
        userImage={appState.userImage}
        onRoleSwitch={handleRoleSwitch}
      />

      <RouterComponent 
        isAuthenticated={appState.isAuthenticated}
        userId={appState.userId}
        userRole={appState.userRole}
        currentLang={appState.currentLang}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onLanguageChange={handleLanguageChange}
        onUpdateProfile={handleUpdateProfile}
        userName={appState.userName}
        userImage={appState.userImage}
      />

      <Toaster />
    </div>
  );
};

// Main App Component
function App() {
  console.log("🎯 Root App component rendering");
  
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;