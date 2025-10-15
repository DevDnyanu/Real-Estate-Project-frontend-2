
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User, ShoppingCart, Store, Menu, X } from "lucide-react";
 const BASE = "https://real-estate-project-backend-2-2.onrender.com";

interface ProfileMenuProps {
  userName?: string;
  userImage?: string;
  userRole: string;
  onLogout: () => void;
  onProfileClick: () => void;
  onRoleSwitch: (newRole: string) => void;
  currentLang: "en" | "mr";
  isMobile?: boolean;
}

const ProfileMenu = ({ 
  userName, 
  userImage, 
  userRole,
  onLogout, 
  onProfileClick, 
  onRoleSwitch,
  currentLang,
  isMobile = false
}: ProfileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);

  const translations = {
    en: {
      myProfile: "My Profile",
      logout: "Logout",
      welcome: "Welcome back!",
      switchToBuyer: "Switch to Buyer",
      switchToSeller: "Switch to Seller",
      currentRole: "Current Role:",
      buyer: "Buyer",
      seller: "Seller"
    },
    mr: {
      myProfile: "माझे प्रोफाइल",
      logout: "लॉगआउट",
      welcome: "पुन्हा स्वागत आहे!",
      switchToBuyer: "खरेदीदार मोडमध्ये बदला",
      switchToSeller: "विक्रेता मोडमध्ये बदला",
      currentRole: "सध्याची भूमिका:",
      buyer: "खरेदीदार",
      seller: "विक्रेता"
    }
  };

  // Debug: Check what ProfileMenu receives
  useEffect(() => {
    console.log("🔍 ProfileMenu: Received props", { 
      userName, 
      userImage: userImage ? `Has image (${userImage.substring(0, 50)}...)` : 'No image',
      userRole 
    });
  }, [userImage, userName, userRole]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const t = translations[currentLang];

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const handleProfileClick = () => {
    onProfileClick();
    setIsOpen(false);
  };

  const handleRoleSwitch = (newRole: string) => {
    onRoleSwitch(newRole);
    setIsOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
  };

  // Valid image URL check - IMPROVED
  const isValidImageUrl = (url: string | undefined) => {
    if (!url) {
      console.log("❌ ProfileMenu: No image URL");
      return false;
    }
    
    const isValid = url.startsWith('data:image') || 
                   url.startsWith('/uploads') ||
                   url.includes('profile-') ||
                   url.length > 1000; // Base64 images are long
                   
    console.log(`🔍 ProfileMenu: Image validation - ${isValid ? 'VALID' : 'INVALID'}`, { 
      url: url.substring(0, 100) 
    });
    
    return isValid;
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) {
      console.log("❌ ProfileMenu: No image path provided");
      return '';
    }
    
    console.log("🔍 ProfileMenu: Processing image path", { 
      type: imagePath.startsWith('data:image') ? 'Base64' : 
            imagePath.startsWith('/uploads') ? 'Relative Path' : 'Other',
      length: imagePath.length 
    });
    
    // If it's base64 data URL, return directly
    if (imagePath.startsWith('data:image')) {
      console.log("✅ ProfileMenu: Returning Base64 image directly");
      return imagePath;
    }
    
    // If it's a relative path, construct URL
    if (imagePath.startsWith('/uploads')) {
      const fullUrl = `${BASE}${imagePath}`;
      console.log("✅ ProfileMenu: Constructed URL:", fullUrl);
      return fullUrl;
    }
    
    console.log("⚠️ ProfileMenu: Returning original path");
    return imagePath;
  };

  return (
    <div 
      className="relative"
      ref={dropdownRef}
    >
      {/* Profile Button Trigger */}
      <Button 
        variant="outline" 
        className={`flex items-center space-x-2 border-gray-300 hover:border-blue-500 transition-colors ${
          isMobile ? "w-full justify-center" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={!isMobile ? () => setIsOpen(true) : undefined}
      >
        {isMobile ? (
          <Menu className="h-5 w-5" />
        ) : (
          <>
            {isValidImageUrl(userImage) && !imageError ? (
              <img 
                src={getImageUrl(userImage)} 
                alt={userName} 
                className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  console.error("❌ ProfileMenu: Image failed to load:", {
                    original: userImage,
                    constructed: getImageUrl(userImage),
                    error: e
                  });
                  setImageError(true);
                }}
                onLoad={() => {
                  console.log("✅ ProfileMenu: Image loaded successfully");
                  setImageError(false);
                }}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold border-2 border-gray-200">
                {getInitials(userName || '')}
              </div>
            )}
            <span className="hidden sm:block font-medium">{userName}</span>
          </>
        )}
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className={`absolute top-full ${
            isMobile ? "left-0 right-0 w-full" : "right-0 w-64"
          } mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2 animate-in fade-in-0 zoom-in-95`}
          onMouseLeave={!isMobile ? () => setIsOpen(false) : undefined}
        >
          
          {/* Close Button - Mobile */}
          {isMobile && (
            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100">
              <span className="font-semibold">Menu</span>
              <button onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
            <p className="text-xs text-gray-500 mt-1">{t.welcome}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-medium text-gray-700">{t.currentRole}</span>
              <span className={`text-xs font-bold ${userRole === 'seller' ? 'text-green-600' : 'text-blue-600'}`}>
                {userRole === 'seller' ? t.seller : t.buyer}
              </span>
            </div>
          </div>
          
          {/* Menu Options */}
          <div className="space-y-1 py-2">
            {/* Profile */}
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
            >
              <User className="h-4 w-4 text-blue-600" />
              <span>{t.myProfile}</span>
            </button>

            {/* Role Switching */}
            <div className="border-t border-gray-100 pt-2">
              {userRole === "seller" ? (
                <button
                  onClick={() => handleRoleSwitch("buyer")}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>{t.switchToBuyer}</span>
                </button>
              ) : (
                <button
                  onClick={() => handleRoleSwitch("seller")}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors duration-200"
                >
                  <Store className="h-4 w-4" />
                  <span>{t.switchToSeller}</span>
                </button>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 border-t border-gray-100 mt-2 pt-2"
            >
              <LogOut className="h-4 w-4" />
              <span>{t.logout}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;


