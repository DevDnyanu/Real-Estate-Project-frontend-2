import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Logo from '@/assets/Logo.jpg'; // ✅ import your logo image
import { useNavigate } from 'react-router-dom';

interface FooterProps {
  currentLang: 'en' | 'mr';
}

const translations = {
  en: {
    brand: 'PlotChamps',
    tagline: 'Your trusted partner in real estate',
    quickLinks: 'Quick Links',
    home: 'Home',
    about: 'About Us',
    contact: 'Contact Us',
    packages: 'Packages',
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    contactInfo: 'Contact Information',
    address: '123 Business Park, Mumbai, Maharashtra 400001',
    phone: '+91 7499696162',
    email: 'info@plotchamps.com',
    followUs: 'Follow Us',
    copyright: '© 2025 PlotChamps. All rights reserved.',
    sellerPackages: 'Seller Packages',
    silver: 'Silver Package',
    gold: 'Gold Package',
    premium: 'Premium Package',
    support: 'Support',
    faq: 'FAQ',
    freePackage: 'Free Package'
  },
  mr: {
    brand: 'प्लॉटचॅम्प्स',
    tagline: 'रिअल इस्टेट मध्ये तुमचा विश्वासू भागीदार',
    quickLinks: 'द्रुत दुवे',
    home: 'होम',
    about: 'आमच्याबद्दल',
    contact: 'संपर्क साधा',
    packages: 'पॅकेजेस',
    privacy: 'गोपनीयता धोरण',
    terms: 'अटी आणि नियम',
    contactInfo: 'संपर्क माहिती',
    address: '१२३ बिझनेस पार्क, मुंबई, महाराष्ट्र ४००००१',
    phone: '+९१ ७४९९६९६१६२',
    email: 'info@plotchamps.com',
    followUs: 'आमचे अनुसरण करा',
    copyright: '© २०२५ प्लॉटचॅम्प्स. सर्व हक्क राखीव.',
    sellerPackages: 'विक्रेता पॅकेजेस',
    silver: 'चांदी पॅकेज',
    gold: 'सोने पॅकेज',
    premium: 'प्रीमियम पॅकेज',
    support: 'आधार',
    faq: 'सामान्य प्रश्न',
    freePackage: 'मोफत पॅकेज'
  }
};

export const Footer = ({ currentLang }: FooterProps) => {
  const t = translations[currentLang];
  const navigate = useNavigate();

  const handleSocialClick = (platform: string) => {
    const urls = {
      facebook: 'https://www.facebook.com/plotchamps',
      twitter: 'https://www.twitter.com/plotchamps',
      instagram: 'https://www.instagram.com/plotchamps',
      linkedin: 'https://www.linkedin.com/company/plotchamps'
    };
    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handlePackageClick = (packageType: string) => {
    navigate('/packages', { 
      state: { 
        selectedPackage: packageType 
      } 
    });
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {/* ✅ Logo Image instead of icon */}
              <img src={Logo} alt="PlotChamps Logo" className="h-10 w-10 rounded-full object-cover" />
              <h3 className="text-xl font-bold">{t.brand}</h3>
            </div>
            <p className="text-background/80 text-sm">
              {t.tagline}
            </p>
            
            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="font-semibold">{t.followUs}</h4>
              <div className="flex space-x-3">
                <Button variant="ghost" size="sm" className="p-2 hover:bg-primary/20" onClick={() => handleSocialClick('facebook')}>
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-primary/20" onClick={() => handleSocialClick('twitter')}>
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-primary/20" onClick={() => handleSocialClick('instagram')}>
                  <Instagram className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-primary/20" onClick={() => handleSocialClick('linkedin')}>
                  <Linkedin className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">{t.quickLinks}</h4>
            <ul className="space-y-2">
              <li>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-background/80 hover:text-primary-light justify-start"
                  onClick={() => handleNavigation('/')}
                >
                  {t.home}
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-background/80 hover:text-primary-light justify-start"
                  onClick={() => handleNavigation('/about')}
                >
                  {t.about}
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-background/80 hover:text-primary-light justify-start"
                  onClick={() => handleNavigation('/contact')}
                >
                  {t.contact}
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-background/80 hover:text-primary-light justify-start"
                  onClick={() => handleNavigation('/packages')}
                >
                  {t.packages}
                </Button>
              </li>
            </ul>
          </div>

          {/* Seller Packages */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">{t.sellerPackages}</h4>
            <ul className="space-y-2">
              <li>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-background/80 hover:text-silver-light justify-start"
                  onClick={() => handlePackageClick('free')}
                >
                  {t.freePackage}
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-background/80 hover:text-silver-light justify-start"
                  onClick={() => handlePackageClick('silver')}
                >
                  {t.silver}
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-background/80 hover:text-gold-light justify-start"
                  onClick={() => handlePackageClick('gold')}
                >
                  {t.gold}
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-background/80 hover:text-premium-light justify-start"
                  onClick={() => handlePackageClick('premium')}
                >
                  {t.premium}
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-background/80 hover:text-primary-light justify-start"
                  onClick={() => handleNavigation('/support')}
                >
                  {t.support}
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-background/80 hover:text-primary-light justify-start"
                  onClick={() => handleNavigation('/faq')}
                >
                  {t.faq}
                </Button>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">{t.contactInfo}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary-light flex-shrink-0" />
                <span className="text-background/80">{t.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary-light" />
                <span className="text-background/80">{t.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary-light" />
                <span className="text-background/80">{t.email}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-background/20" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-background/80">{t.copyright}</p>
          <div className="flex space-x-6">
            <Button variant="link" className="p-0 h-auto text-background/80 hover:text-primary-light text-sm">{t.privacy}</Button>
            <Button variant="link" className="p-0 h-auto text-background/80 hover:text-primary-light text-sm">{t.terms}</Button>
          </div>
        </div>
      </div>
    </footer>
  );
};