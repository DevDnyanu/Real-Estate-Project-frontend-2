
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';

interface HeroProps {
  currentLang: 'en' | 'mr';
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  onSearchSubmit: () => void;
}

const translations = {
  en: {
    title: 'Find Your Dream Plot',
    searchPlaceholder: 'Search by location, property type, or keywords...',
    search: 'Search'
  },
  mr: {
    title: 'तुमचा स्वप्नातील प्लॉट शोधा',
    searchPlaceholder: 'स्थान, मालमत्ता प्रकार किंवा कीवर्डद्वारे शोधा...',
    search: 'शोधा'
  }
};

export const Hero = ({ 
  currentLang, 
  searchTerm, 
  onSearchChange, 
  onSearchSubmit 
}: HeroProps) => {
  const t = translations[currentLang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Hero Text */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t.title}
          </h1>
          
          {/* Search Bar */}
          <Card className="p-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl">
            <form onSubmit={handleSubmit}>
              {/* Search Input */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 h-12 text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="h-12 px-6 text-lg bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  <Search className="mr-2 h-5 w-5" />
                  {t.search}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;