import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, ChevronRight } from "lucide-react";

interface LoginMenuProps {
  onLogin: () => void;
  onSignup: () => void;
  currentLang: string;
}

const translations = {
  en: {
    myProfile: "My Profile",
    login: "Login",
    newUser: "New to PlotChamps?",
    signUp: "Sign Up",
    new: "NEW"
  },
  mr: {
    myProfile: "माझे प्रोफाइल",
    login: "लॉगिन",
    newUser: "PlotChamps मध्ये नवीन आहात?",
    signUp: "साइन अप",
    new: "नवीन"
  }
};

const LoginMenu = ({ onLogin, onSignup, currentLang }: LoginMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[currentLang as keyof typeof translations];

  const menuItems = [
    {
      icon: User,
      label: t.myProfile,
      hasNew: false,
    },
  ];

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Login Button Trigger - BLUE COLOR */}
      <Button 
        variant="default" 
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 transition-colors duration-200"
        onClick={onLogin}
      >
        {t.login}
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-4">
          {/* Menu Items */}
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700 font-medium">
                      {item.label}
                    </span>
                    {item.hasNew && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded font-semibold">
                        {t.new}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="h-3 w-3 text-gray-400" />
                </div>
              );
            })}
          </div>

          {/* Separator */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Login Section */}
          <div className="px-6 space-y-3">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md transition-colors duration-200"
              onClick={onLogin}
            >
              {t.login}
            </Button>
            
            <div className="text-center text-sm text-gray-600">
              {t.newUser}{' '}
              <button 
                onClick={onSignup}
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200"
              >
                {t.signUp}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginMenu;