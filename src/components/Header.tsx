import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe, Menu, X, Phone, Info, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProfileMenu from "@/components/ProfileMenu";
import LoginMenu from "@/components/LoginMenu";
import Logo from "@/assets/Logo.jpg";
import { switchRoleApi } from "@/lib/api";

interface HeaderProps {
  currentLang: "en" | "mr"; 
  onLanguageChange: (lang: "en" | "mr") => void; 
  isLoggedIn?: boolean;
  onLogout: () => void;
  userRole: string;
  userName?: string;
  userImage?: string;
  onRoleSwitch?: (newRole: string) => void;
}

const translations = {
  en: {
    brand: "PlotChamps",
    home: "Home",
    login: "Login",
    signup: "Sign Up",
    myListings: "My Listings",
    browseListings: "Browse Listings",
    about: "About Us",
    contact: "Contact Us",
    profile: "Profile",
    english: "English",
    marathi: "मराठी",
    logout: "Logout",
    selectLanguage: "Select Language",
    switchToBuyer: "Switch to Buyer",
    switchToSeller: "Switch to Seller",
    currentRole: "Current Role",
    createListing: "Create Listing",
    switchingRole: "Switching role...",
  },
  mr: {
    brand: "प्लॉटचॅम्प्स",
    home: "होम",
    login: "लॉगिन",
    signup: "साइन अप",
    myListings: "माझ्या लिस्टिंग्ज",
    browseListings: "यादी ब्राउझ करा",
    about: "आमच्याबद्दल",
    contact: "संपर्क करा",
    profile: "प्रोफाइल",
    english: "English",
    marathi: "मराठी",
    logout: "लॉगआउट",
    selectLanguage: "भाषा निवडा",
    switchToBuyer: "खरेदीदार मोडमध्ये बदला",
    switchToSeller: "विक्रेता मोडमध्ये बदला",
    currentRole: "सध्याची भूमिका",
    createListing: "लिस्टिंग तयार करा",
    switchingRole: "रोल बदलत आहे...",
  },
};

const Header = ({
  currentLang,
  onLanguageChange,
  isLoggedIn = false,
  onLogout,
  userRole,
  userName,
  userImage,
  onRoleSwitch,
}: HeaderProps) => {
  const navigate = useNavigate();
  const t = translations[currentLang]; 
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);

  // Sync role with localStorage on component mount
  useEffect(() => {
    const currentRole = localStorage.getItem('currentRole') || userRole;
    if (currentRole !== userRole) {
      console.log('🔄 Header: Syncing role from localStorage:', currentRole);
    }
  }, [userRole]);

  const handleHomeClick = () => {
    navigate("/");
    setMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setMenuOpen(false);
  };

  // ✅ UPDATED ROLE SWITCH FUNCTION WITHOUT ALERTS
  const handleRoleSwitch = async (newRole: string) => {
    try {
      if (newRole === userRole) {
        console.log('⚠️ Already in this role, no switch needed');
        setMenuOpen(false);
        return;
      }

      console.log(`🔄 Switching role from ${userRole} to ${newRole}`);
      setIsSwitchingRole(true);

      // Call API to switch role and get new token
      const response = await switchRoleApi(newRole);
      
      if (response.status === 'success') {
        // Store new token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentRole', newRole);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        console.log('✅ Role switched successfully, new token stored');
        
        // Update parent component state
        if (onRoleSwitch) {
          onRoleSwitch(newRole);
        }
        
        setMenuOpen(false);
        
        // Redirect based on new role
        if (newRole === "seller") {
          navigate("/listings");
        } else {
          navigate("/properties");
        }
        
        // Refresh the page to ensure all components use new token
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (error: any) {
      console.error('❌ Role switch failed:', error);
      // Error alert bhi remove kiya gaya
    } finally {
      setIsSwitchingRole(false);
    }
  };

  const displayName = userName ? userName.charAt(0).toUpperCase() + userName.slice(1) : '';

  const handleLanguageChangeSafe = (value: string) => {
    if (value === "en" || value === "mr") {
      onLanguageChange(value);
    }
  };

  const getCurrentLanguageName = () => {
    return currentLang === "en" ? t.english : t.marathi;
  };

  return (
    <header className="bg-white border-b shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={handleHomeClick}
        >
          <img
            src={Logo}
            alt="Logo"
            className="h-10 w-10 rounded-full object-cover border-2 border-gray-200 shadow hover:scale-105 transition"
          />
          <h1 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ml-3">
            {t.brand}
          </h1>
        </div>

        {/* Desktop Nav - Only show Home, About, Contact for logged in users */}
        <nav className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" onClick={handleHomeClick} className="font-medium text-sm h-9 px-3">
            {t.home}
          </Button>
          
          <Button variant="ghost" onClick={() => navigate("/about")} className="font-medium text-sm h-9 px-3">
            <Info className="h-3.5 w-3.5 mr-1" />
            {t.about}
          </Button>
          <Button variant="ghost" onClick={() => navigate("/contact")} className="font-medium text-sm h-9 px-3">
            <Phone className="h-3.5 w-3.5 mr-1" />
            {t.contact}
          </Button>
        </nav>

        {/* Right: Auth + Lang */}
        <div className="hidden md:flex items-center space-x-3">
          {!isLoggedIn ? (
            <LoginMenu
              onLogin={() => navigate("/login")}
              onSignup={() => navigate("/signup")}
              currentLang={currentLang}
            />
          ) : (
            <ProfileMenu
              userName={displayName}
              userImage={userImage}
              userRole={userRole}
              onLogout={onLogout}
              onProfileClick={handleProfileClick}
              onRoleSwitch={handleRoleSwitch}
              currentLang={currentLang}
              isSwitchingRole={isSwitchingRole}
            />
          )}

          {/* Language Selector - Zero spacing */}
          <Select value={currentLang} onValueChange={handleLanguageChangeSafe}>
            <SelectTrigger 
              className="border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-xs font-medium h-8 px-2 w-28 gap-0"
            >
              <Globe className="h-3 w-3 text-gray-600" />
              <SelectValue>
                <span className="text-gray-700 font-medium text-xs truncate pl-1">
                  {getCurrentLanguageName()}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">
                <div className="flex items-center space-x-2 py-1">
                  <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-bold">E</span>
                  </div>
                  <span className="font-medium text-gray-900 text-xs">English</span>
                </div>
              </SelectItem>
              <SelectItem value="mr">
                <div className="flex items-center space-x-2 py-1">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-xs font-bold">म</span>
                  </div>
                  <span className="font-medium text-gray-900 text-xs">मराठी</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          disabled={isSwitchingRole}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-3 space-y-2">
            {/* Navigation Links */}
            <Button variant="ghost" onClick={handleHomeClick} className="justify-start py-2 text-sm h-9">
              {t.home}
            </Button>
            
            <Button variant="ghost" onClick={() => navigate("/about")} className="justify-start py-2 text-sm h-9">
              <Info className="h-3.5 w-3.5 mr-2" />
              {t.about}
            </Button>
            <Button variant="ghost" onClick={() => navigate("/contact")} className="justify-start py-2 text-sm h-9">
              <Phone className="h-3.5 w-3.5 mr-2" />
              {t.contact}
            </Button>

            {isLoggedIn && (
              <>
                <Button variant="ghost" onClick={handleProfileClick} className="justify-start py-2 text-sm h-9">
                  <User className="h-3.5 w-3.5 mr-2" />
                  {t.profile}
                </Button>

                {/* Role Switching for Mobile */}
                <div className="border-t border-gray-200 pt-2">
                  <p className="text-xs font-medium text-gray-700 mb-1.5">
                    {t.currentRole}: {userRole === "seller" ? "Seller" : "Buyer"}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRoleSwitch("buyer")}
                      disabled={userRole === "buyer" || isSwitchingRole}
                      className="text-xs h-7"
                    >
                      {isSwitchingRole ? t.switchingRole : t.switchToBuyer}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRoleSwitch("seller")}
                      disabled={userRole === "seller" || isSwitchingRole}
                      className="text-xs h-7"
                    >
                      {isSwitchingRole ? t.switchingRole : t.switchToSeller}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Auth Buttons */}
            <div className="pt-1 space-y-2">
              {!isLoggedIn ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/login")}
                    className="w-full py-2 text-sm h-9"
                  >
                    {t.login}
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={() => navigate("/signup")}
                    className="w-full py-2 text-sm h-9 bg-blue-600 hover:bg-blue-700"
                  >
                    {t.signup}
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={onLogout}
                  disabled={isSwitchingRole}
                  className="w-full py-2 text-sm h-9 text-red-600 border-red-200 hover:bg-red-50"
                >
                  {t.logout}
                </Button>
              )}
            </div>

            {/* Language Selector for Mobile - Zero spacing */}
            <div className="pt-3 border-t border-gray-200 mt-2">
              <label className="text-xs font-medium text-gray-700 mb-2 block">
                {t.selectLanguage}
              </label>
              <Select value={currentLang} onValueChange={handleLanguageChangeSafe}>
                <SelectTrigger className="w-full text-xs h-8 font-medium gap-0">
                  <Globe className="h-3 w-3" />
                  <SelectValue>
                    <span className="text-xs font-medium pl-1">{getCurrentLanguageName()}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">
                    <div className="flex items-center space-x-2 py-1">
                      <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">E</span>
                      </div>
                      <span className="font-medium text-gray-900 text-xs">English</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="mr">
                    <div className="flex items-center space-x-2 py-1">
                      <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-xs font-bold">म</span>
                      </div>
                      <span className="font-medium text-gray-900 text-xs">मराठी</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isSwitchingRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700 font-medium">{t.switchingRole}</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;