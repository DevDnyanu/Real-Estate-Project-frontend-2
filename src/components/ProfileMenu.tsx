// components/ProfileMenu.tsx - Updated version
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User, ShoppingCart, Store, Menu, X } from "lucide-react";

interface ProfileMenuProps {
  userName?: string;
  userImage?: string;
  userRole: string;
  onLogout: () => void;
  onProfileClick: () => void;
  onRoleSwitch: (newRole: string) => void;
  currentLang: "en" | "mr";
  isMobile?: boolean;
  isSwitchingRole?: boolean;
}

const ProfileMenu = ({ 
  userName, 
  userImage, 
  userRole,
  onLogout, 
  onProfileClick, 
  onRoleSwitch,
  currentLang,
  isMobile = false,
  isSwitchingRole = false
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
      seller: "Seller",
      switching: "Switching..."
    },
    mr: {
      myProfile: "माझे प्रोफाइल",
      logout: "लॉगआउट",
      welcome: "पुन्हा स्वागत आहे!",
      switchToBuyer: "खरेदीदार मोडमध्ये बदला",
      switchToSeller: "विक्रेता मोडमध्ये बदला",
      currentRole: "सध्याची भूमिका:",
      buyer: "खरेदीदार",
      seller: "विक्रेता",
      switching: "बदलत आहे..."
    }
  };

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

  const isValidImageUrl = (url: string | undefined) => {
    if (!url) return false;
    return url.startsWith('data:image') || 
           url.startsWith('/uploads') ||
           url.includes('profile-') ||
           url.length > 1000;
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    
    if (imagePath.startsWith('data:image')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/uploads')) {
      return `${window.location.origin}${imagePath}`;
    }
    
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
        disabled={isSwitchingRole}
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
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold border-2 border-gray-200">
                {getInitials(userName || '')}
              </div>
            )}
            <span className="hidden sm:block font-medium">
              {isSwitchingRole ? t.switching : userName}
            </span>
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
              disabled={isSwitchingRole}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50"
            >
              <User className="h-4 w-4 text-blue-600" />
              <span>{t.myProfile}</span>
            </button>

            {/* Role Switching */}
            <div className="border-t border-gray-100 pt-2">
              {userRole === "seller" ? (
                <button
                  onClick={() => handleRoleSwitch("buyer")}
                  disabled={isSwitchingRole}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>{isSwitchingRole ? t.switching : t.switchToBuyer}</span>
                </button>
              ) : (
                <button
                  onClick={() => handleRoleSwitch("seller")}
                  disabled={isSwitchingRole}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors duration-200 disabled:opacity-50"
                >
                  <Store className="h-4 w-4" />
                  <span>{isSwitchingRole ? t.switching : t.switchToSeller}</span>
                </button>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={isSwitchingRole}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 border-t border-gray-100 mt-2 pt-2 disabled:opacity-50"
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