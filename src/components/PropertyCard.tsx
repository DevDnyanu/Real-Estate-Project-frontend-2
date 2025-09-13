import { useState } from "react";
import { 
  Heart, 
  MapPin, 
  Verified, 
  Image as ImageIcon, 
  Ruler, 
  IndianRupee, 
  BedDouble,
  Bath,
  Square,
  Clock,
  Phone,
  Eye,
  Edit,
  Trash2,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    location: string;
    price: string;
    rentPrice?: string;
    type: "rent" | "sale";
    propertyType?: string;
    plotSize?: number;
    pricePerUnit?: number;
    area: string;
    image?: string;
    video?: string;
    featured?: boolean;
    verified?: boolean;
    isPlot?: boolean;
    plotType?: string;
    plotSubType?: string;
    userRef?: string;
    bedrooms?: number;
    bathrooms?: number;
    postedAgo?: string;
    sellerName?: string;
    sellerInitials?: string;
  };
  onView?: () => void;
  onContact?: () => void;
  onFavorite?: () => void;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  isFavorite?: boolean;
  currentLang: 'en' | 'mr';
}

const PropertyCard = ({ 
  property, 
  onView, 
  onContact, 
  onFavorite, 
  showActions = false,
  onEdit,
  onDelete,
  isFavorite = false,
  currentLang = 'en'
}: PropertyCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isFavorited, setIsFavorited] = useState(isFavorite);
  const [showVideo, setShowVideo] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Enhanced translations with number formatting and common location terms
  const translations = {
    en: {
      forRent: "For Rent",
      forSale: "For Sale",
      plot: " Plot",
      verified: "Verified",
      featured: "Featured",
      acres: "Acres",
      perUnit: "Per Unit",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      sqFt: "Sq Ft",
      viewDetails: "View Details",
      contact: "Contact",
      edit: "Edit",
      delete: "Delete",
      agriculturePlot: "Agriculture Plot",
      nonAgriculturePlot: "Non-Agricultural Plot",
      mountainPlot: "Mountain Plot",
      residentialPlot: "Residential Plot",
      commercialPlot: "Commercial Plot",
      residential: "Residential",
      commercial: "Commercial",
      daysAgo: "days ago",
      hoursAgo: "hours ago",
      minutesAgo: "minutes ago",
      justNow: "just now",
      road: "Road",
      nagar: "Nagar",
      phase: "Phase",
      apartment: "Apartment",
      india: "India",
      maharashtra: "Maharashtra",
      pimpleSaudagar: "Pimple Saudagar",
      mithila: "Mithila",
      pimpriChinchwad: "Pimpri-Chinchwad",
      hinjewadi: "Hinjewadi"
    },
    mr: {
      forRent: "भाड्याने",
      forSale: "विक्रीसाठी",
      plot: " प्लॉट",
      verified: "सत्यापित",
      featured: "फीचर्ड",
      acres: "एकर",
      perUnit: "प्रति युनिट",
      bedrooms: "बेडरूम",
      bathrooms: "बाथरूम",
      sqFt: "चौ. फूट",
      viewDetails: "तपशील पहा",
      contact: "संपर्क",
      edit: "सुधारणे",
      delete: "काढून टाका",
      agriculturePlot: "शेती जमीन",
      nonAgriculturePlot: "नॉन-एग्रीकल्चर जमीन",
      mountainPlot: "डोंगराळ जमीन",
      residentialPlot: "रहिवासी जमीन",
      commercialPlot: "व्यावसायिक जमीन",
      residential: "रहिवासी",
      commercial: "व्यावसायिक",
      daysAgo: "दिवसांपूर्वी",
      hoursAgo: "तासांपूर्वी",
      minutesAgo: "मिनिटांपूर्वी",
      justNow: "आत्ताच",
      road: "रोड",
      nagar: "नगर",
      phase: "फेज",
      apartment: "अपार्टमेंट",
      india: "भारत",
      maharashtra: "महाराष्ट्र",
      pimpleSaudagar: "पिंपरी सावदागर",
      mithila: "मिथिला",
      pimpriChinchwad: "पिंपरी-चिंचवड",
      hinjewadi: "हिंजवडी"
    }
  };

  // Common property name translations
  const propertyNameTranslations: Record<string, string> = {
    'Amol Pawar': 'अमोल पवार',
    'AA apartment': 'एए अपार्टमेंट',
    'Sai Apartment': 'साई अपार्टमेंट',
    'Sunshine Apartment': 'सनशाईन अपार्टमेंट',
    'Pimple Saudagar': translations.mr.pimpleSaudagar,
    'Mithila Nagari': `${translations.mr.mithila} नगरी`,
    'Pimpri-Chinchwad': translations.mr.pimpriChinchwad,
    'Hinjewadi': translations.mr.hinjewadi,
    'Phase': translations.mr.phase,
    'Road': translations.mr.road,
    'India': translations.mr.india,
    'Maharashtra': translations.mr.maharashtra
  };

  const t = translations[currentLang];

  // Function to translate property names to Marathi
  const translatePropertyName = (name: string): string => {
    if (currentLang !== 'mr') return name;
    
    // Check if we have a direct translation
    if (propertyNameTranslations[name]) {
      return propertyNameTranslations[name];
    }
    
    // Try to translate common parts of property names
    return name.split(' ').map(word => {
      return propertyNameTranslations[word] || word;
    }).join(' ');
  };

  // Function to translate location to Marathi
  const translateLocation = (location: string): string => {
    if (currentLang !== 'mr') return location;
    
    // Replace common English location terms with Marathi equivalents
    let translatedLocation = location;
    
    Object.keys(propertyNameTranslations).forEach(englishTerm => {
      const regex = new RegExp(englishTerm, 'gi');
      translatedLocation = translatedLocation.replace(regex, propertyNameTranslations[englishTerm]);
    });
    
    return translatedLocation;
  };

  // Function to format numbers in Marathi
  const formatNumberInMarathi = (num: number): string => {
    if (currentLang !== 'mr') return num.toString();
    
    const marathiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num.toString().replace(/\d/g, (digit) => marathiDigits[parseInt(digit)]);
  };

  // Function to format price in Marathi
  const formatPriceInMarathi = (price: string): string => {
    if (currentLang !== 'mr') return price;
    
    // Extract the numeric part
    const numericPart = price.replace(/[^0-9,.]/g, '');
    const [whole, decimal] = numericPart.split('.');
    
    // Format the whole number part with Marathi digits
    const formattedWhole = whole.replace(/\d/g, (digit) => {
      const marathiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
      return marathiDigits[parseInt(digit)];
    });
    
    // Format decimal part if exists
    let formattedDecimal = '';
    if (decimal) {
      formattedDecimal = '.' + decimal.replace(/\d/g, (digit) => {
        const marathiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
        return marathiDigits[parseInt(digit)];
      });
    }
    
    return `₹${formattedWhole}${formattedDecimal}`;
  };

  // Function to format time ago in Marathi
  const formatTimeAgoInMarathi = (timeStr: string): string => {
    if (currentLang !== 'mr') return timeStr;
    
    // Extract numbers and units
    const match = timeStr.match(/(\d+)\s*(days|hours|minutes|just)/i);
    if (!match) return timeStr;
    
    const num = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    
    const formattedNum = formatNumberInMarathi(num);
    
    switch(unit) {
      case 'days': return `${formattedNum} ${t.daysAgo}`;
      case 'hours': return `${formattedNum} ${t.hoursAgo}`;
      case 'minutes': return `${formattedNum} ${t.minutesAgo}`;
      case 'just': return t.justNow;
      default: return timeStr;
    }
  };

  const getPlotTypeLabel = (type: string) => {
    const plotTypes: Record<string, string> = {
      'agriculture': t.agriculturePlot,
      'non-agriculture': t.nonAgriculturePlot,
      'mountain': t.mountainPlot,
      'residential': t.residentialPlot,
      'commercial': t.commercialPlot
    };
    return plotTypes[type] || type;
  };

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
    if (onFavorite) onFavorite();
  };

  const handleViewDetails = () => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }
    
    if (userRole === 'buyer' && !localStorage.getItem("selectedPackage")) {
      navigate('/packages');
      return;
    }
    
    if (onView) {
      onView();
    } else {
      navigate(`/listing/${property.id}`);
    }
  };

  // Format price with Indian numbering system
  const formatPrice = (price: string) => {
    if (!price) return currentLang === 'mr' ? '₹०' : '₹0';
    
    // Remove any existing ₹ symbols to prevent duplication
    const cleanPrice = price.replace(/₹/g, '');
    
    if (currentLang === 'mr') {
      return formatPriceInMarathi(`₹${cleanPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);
    }
    
    return `₹${cleanPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  // Generate initials from seller name
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Format numbers based on language
  const formatNumber = (num: number | undefined) => {
    if (num === undefined) return currentLang === 'mr' ? '०' : '0';
    return currentLang === 'mr' ? formatNumberInMarathi(num) : num.toString();
  };

  // Format time ago based on language
  const formatTimeAgo = (timeStr: string | undefined) => {
    if (!timeStr) return '';
    return currentLang === 'mr' ? formatTimeAgoInMarathi(timeStr) : timeStr;
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Image/Video Section */}
      <div className="relative">
        {property.video && showVideo ? (
          <div className="w-full h-52 bg-black flex items-center justify-center">
            <video 
              src={property.video} 
              className="w-full h-full object-cover"
              controls
              autoPlay
            />
          </div>
        ) : property.image && !imageError ? (
          <img
            src={property.image}
            alt={translatePropertyName(property.title)}
            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-52 bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center text-gray-400">
            <ImageIcon className="h-12 w-12 mb-2 opacity-60" />
            <span className="text-sm">{currentLang === 'mr' ? 'मालमत्तेची प्रतिमा' : 'Property Image'}</span>
          </div>
        )}
        
        {/* Video Play Button */}
        {property.video && !showVideo && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full h-12 w-12 shadow-md"
            onClick={() => setShowVideo(true)}
          >
            <Play className="h-6 w-6 text-blue-600 fill-blue-600" />
          </Button>
        )}
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
          <Badge className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs font-medium">
            {property.type === 'rent' ? t.forRent : t.forSale}
          </Badge>
          
          {property.isPlot && (
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs font-medium">
              {t.plot}
            </Badge>
          )}
        </div>

        {/* Right Side Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          {property.verified && (
            <Badge className="bg-white text-blue-600 px-3 py-1 text-xs font-medium shadow-sm flex items-center gap-1">
              <Verified className="h-3 w-3" />
              {t.verified}
            </Badge>
          )}
          
          {property.featured && (
            <Badge className="bg-amber-500 text-white px-3 py-1 text-xs font-medium">
              {t.featured}
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute bottom-3 right-3 bg-white/90 hover:bg-white rounded-full h-9 w-9 shadow-md transition-colors",
            isFavorited ? "text-rose-500" : "text-gray-500"
          )}
          onClick={handleFavoriteClick}
        >
          <Heart 
            className={cn("h-4 w-4 transition-all", isFavorited ? "fill-current" : "")} 
          />
        </Button>

        {/* Posted Time */}
        {property.postedAgo && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            <Clock className="h-3 w-3" />
            <span>{formatTimeAgo(property.postedAgo)}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Price */}
        <div className="mb-3">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(property.price)}
          </span>
          {property.rentPrice && (
            <span className="text-sm text-gray-600 ml-2">/{formatPrice(property.rentPrice)}</span>
          )}
        </div>

        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
            {translatePropertyName(property.title)}
          </h3>
          <div className="flex items-start gap-1 text-gray-600">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="text-sm line-clamp-2">{translateLocation(property.location)}</span>
          </div>
        </div>

        {/* Seller Info - Only show if sellerName is provided */}
        {property.sellerName && (
          <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
              {property.sellerInitials || getInitials(property.sellerName)}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {translatePropertyName(property.sellerName)}
            </span>
          </div>
        )}

        {/* Property Details */}
        {property.isPlot ? (
          <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-blue-50 rounded-xl">
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg flex items-center justify-center gap-1">
                <Ruler className="h-5 w-5 text-blue-600" />
                {formatNumber(property.plotSize)}
              </div>
              <div className="text-xs text-gray-600 font-medium mt-1">{t.acres}</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg flex items-center justify-center gap-1">
                <IndianRupee className="h-5 w-5 text-blue-600" />
                {property.pricePerUnit ? formatNumber(property.pricePerUnit) : currentLang === 'mr' ? 'एन/ए' : 'N/A'}
              </div>
              <div className="text-xs text-gray-600 font-medium mt-1">{t.perUnit}</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-xl">
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg flex items-center justify-center gap-1">
                <BedDouble className="h-4 w-4 text-blue-600" />
                {formatNumber(property.bedrooms)}
              </div>
              <div className="text-xs text-gray-600 font-medium mt-1">{t.bedrooms}</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg flex items-center justify-center gap-1">
                <Bath className="h-4 w-4 text-blue-600" />
                {formatNumber(property.bathrooms)}
              </div>
              <div className="text-xs text-gray-600 font-medium mt-1">{t.bathrooms}</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg flex items-center justify-center gap-1">
                <Square className="h-4 w-4 text-blue-600" />
                {currentLang === 'mr' ? property.area.replace('Sq Ft', 'चौ. फूट') : property.area}
              </div>
              <div className="text-xs text-gray-600 font-medium mt-1">{t.sqFt}</div>
            </div>
          </div>
        )}

        {/* Property Type */}
        <div className="flex flex-wrap gap-2 mb-5">
          <Badge variant="secondary" className="px-3 py-1 text-xs bg-blue-100 text-blue-800 hover:bg-blue-100">
            {property.isPlot && property.plotType 
              ? getPlotTypeLabel(property.plotType) 
              : (property.propertyType === 'commercial' ? t.commercial : t.residential)
            }
          </Badge>
          {property.isPlot && property.plotSubType && (
            <Badge variant="secondary" className="px-3 py-1 text-xs bg-green-100 text-green-800 hover:bg-green-100">
              {property.plotSubType}
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 text-sm h-10 gap-1"
            onClick={handleViewDetails}
          >
            <Eye className="h-4 w-4" />
            {t.viewDetails}
          </Button>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm h-10 gap-1"
            onClick={onContact}
          >
            <Phone className="h-4 w-4" />
            {t.contact}
          </Button>
        </div>

        {/* Edit/Delete Actions */}
        {showActions && onEdit && onDelete && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-sm h-9 gap-1"
              onClick={onEdit}
            >
              <Edit className="h-3 w-3" />
              {t.edit}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="flex-1 text-sm h-9 gap-1"
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3" />
              {t.delete}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;