import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe, Search, Building2, Menu, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProfileMenu from '@/components/Profile.tsx'; 
import logo from '@/assets/Logo.jpg';

interface HeaderProps {
  currentLang: string;
  onLanguageChange: (lang: string) => void;
  isLoggedIn?: boolean;
  onLogout: () => void;
  userRole: string;
  userName?: string;   
  userImage?: string; 
}

const translations = {
  en: {
    brand: 'PlotChamps',
    buy: 'Buy',
    sell: 'Sell',
    home: 'Home',
    login: 'Login',
    signup: 'Sign Up',
    myListings: 'My Listings',
  },
  mr: {
    brand: 'प्लॉटचॅम्प्स',
    buy: 'खरेदी करा',
    sell: 'विक्री करा',
    home: 'होम',
    login: 'लॉगिन',
    signup: 'साइन अप',
    myListings: 'माझ्या लिस्टिंग्ज',
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
}: HeaderProps) => {
  const navigate = useNavigate();
  const t = translations[currentLang];
  const [menuOpen, setMenuOpen] = useState(false);

  const handleBuyClick = () => {
    if (isLoggedIn && userRole !== 'seller') {
      navigate('/properties');
    } else if (!isLoggedIn) {
      navigate('/signup?role=buyer');
    } else {
      navigate('/properties');
    }
    setMenuOpen(false);
  };

  const handleSellClick = () => {
    if (isLoggedIn && userRole === 'seller') {
      navigate('/create-listing');
    } else if (!isLoggedIn) {
      navigate('/signup?role=seller');
    } else {
      navigate('/signup?role=seller');
    }
    setMenuOpen(false);
  };

  const handleHomeClick = () => {
    if (isLoggedIn && userRole === 'seller') {
      navigate('/listings');
    } else {
      navigate('/');
    }
    setMenuOpen(false);
  };

  return (
    <header className="bg-background border-b border-border shadow-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={handleHomeClick}
        >
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-10 rounded-full object-cover shadow-md border border-border"
          />
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ml-2">
            {t.brand}
          </h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Button variant="ghost" onClick={handleHomeClick}>
            {userRole === 'seller' ? t.myListings : t.home}
          </Button>

          {userRole !== 'seller' && (
            <Button variant="ghost" onClick={handleBuyClick}>
              <Search className="h-4 w-4 mr-1" />
              {t.buy}
            </Button>
          )}

          {(userRole === 'seller' || !isLoggedIn) && (
            <Button variant="ghost" onClick={handleSellClick}>
              <Building2 className="h-4 w-4 mr-1" />
              {t.sell}
            </Button>
          )}
        </nav>

        {/* Right: Auth + Lang */}
        <div className="hidden md:flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <Button variant="outline" onClick={() => navigate('/login')}>
                {t.login}
              </Button>
              <Button variant="default" onClick={() => navigate('/signup')}>
                {t.signup}
              </Button>
            </>
          ) : (
            <ProfileMenu
              userName={userName}
              userImage={userImage}
              onLogout={onLogout}
            />
          )}

          <Select value={currentLang} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-16 border-none bg-transparent">
              <Globe className="h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="mr">मरा</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-background border-t border-border shadow-lg">
          <div className="flex flex-col p-4 space-y-3">
            <Button variant="ghost" onClick={handleHomeClick}>
              {userRole === 'seller' ? t.myListings : t.home}
            </Button>

            {userRole !== 'seller' && (
              <Button variant="ghost" onClick={handleBuyClick}>
                <Search className="h-4 w-4 mr-1" />
                {t.buy}
              </Button>
            )}

            {(userRole === 'seller' || !isLoggedIn) && (
              <Button variant="ghost" onClick={handleSellClick}>
                <Building2 className="h-4 w-4 mr-1" />
                {t.sell}
              </Button>
            )}

            {!isLoggedIn ? (
              <>
                <Button variant="outline" onClick={() => { navigate('/login'); setMenuOpen(false); }}>
                  {t.login}
                </Button>
                <Button variant="default" onClick={() => { navigate('/signup'); setMenuOpen(false); }}>
                  {t.signup}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => { navigate('/profile'); setMenuOpen(false); }}>
                  Profile
                </Button>
                <Button variant="outline" onClick={() => { onLogout(); setMenuOpen(false); }}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
