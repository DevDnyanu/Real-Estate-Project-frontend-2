import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Ruler,
  Edit,
  ArrowLeft,
  User,
  Verified,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  VideoIcon,
  IndianRupee,
  Play,
  Languages
} from "lucide-react";
import { getListingApi } from "@/lib/api";

// Define media type
interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

interface ListingDetailsPageProps {
  currentLang: 'en' | 'mr';
  onLanguageChange: (lang: 'en' | 'mr') => void;
}

const ListingDetailsPage = ({ currentLang, onLanguageChange }: ListingDetailsPageProps) => {
  const { id } = useParams();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaErrors, setMediaErrors] = useState<Set<number>>(new Set());
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const isAuthenticated = !!localStorage.getItem('token');

  // Check if user is authenticated and has selected a package (if buyer)
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }
    
    if (userRole === 'buyer' && !localStorage.getItem("selectedPackage")) {
      navigate('/packages');
    }
  }, [userRole, navigate, id, isAuthenticated]);

  // Translation dictionary
  const translations = {
    en: {
      loading: "Loading plot details...",
      error: "Error:",
      noListing: "No listing found",
      backToListings: "Back to Listings",
      editListing: "Edit Listing",
      verified: "Verified",
      allMedia: "All Media",
      plotDetails: "Plot Details",
      plotSize: "Plot Size",
      pricePerUnit: "Price Per Unit",
      totalPrice: "Total Price",
      listingType: "Listing Type",
      plotTypeInfo: "Plot Type Information",
      plotType: "Plot Type",
      plotSubType: "Plot Sub-Type",
      description: "Description",
      noDescription: "No description provided for this plot.",
      contactInfo: "Contact Information",
      listedBy: "Listed By",
      plotOwner: "Plot Owner",
      contactOwner: "Contact Owner",
      pricingDetails: "Pricing Details",
      salePrice: "Sale Price",
      pricePerAcreGunta: "Price Per Acre/Gunta",
      perAcre: "per acre",
      perGunta: "per gunta",
      longTermLease: "Long-term lease options available",
      plotSummary: "Plot Summary",
      plotId: "Plot ID:",
      totalMedia: "Total Media:",
      plotStatus: "Plot Status:",
      available: "Available",
      listedOn: "Listed on:",
      mediaNotAvailable: "Media not available",
      noMediaAvailable: "No media available",
      images: "Images",
      videos: "Videos",
      changeLanguage: "Change Language",
      english: "English",
      marathi: "Marathi"
    },
    mr: {
      loading: "प्लॉट तपशील लोड होत आहे...",
      error: "त्रुटी:",
      noListing: "कोणतेही लिस्टिंग सापडले नाही",
      backToListings: "लिस्टिंग्सवर परत जा",
      editListing: "लिस्टिंग संपादित करा",
      verified: "सत्यापित",
      allMedia: "सर्व मीडिया",
      plotDetails: "प्लॉट तपशील",
      plotSize: "प्लॉट आकार",
      pricePerUnit: "प्रति युनिट किंमत",
      totalPrice: "एकूण किंमत",
      listingType: "लिस्टिंग प्रकार",
      plotTypeInfo: "प्लॉट प्रकार माहिती",
      plotType: "प्लॉट प्रकार",
      plotSubType: "प्लॉट उप-प्रकार",
      description: "वर्णन",
      noDescription: "या प्लॉटसाठी कोणतेही वर्णन प्रदान केलेले नाही.",
      contactInfo: "संपर्क माहिती",
      listedBy: "यादी केलेले",
      plotOwner: "प्लॉट मालक",
      contactOwner: "मालकाशी संपर्क साधा",
      pricingDetails: "किंमत तपशील",
      salePrice: "विक्री किंमत",
      pricePerAcreGunta: "प्रति एकर/गुंटा किंमत",
      perAcre: "प्रति एकर",
      perGunta: "प्रति गुंटा",
      longTermLease: "दीर्घकालीन भाडेपट्टी पर्याय उपलब्ध",
      plotSummary: "प्लॉट सारांश",
      plotId: "प्लॉट आयडी:",
      totalMedia: "एकूण मीडिया:",
      plotStatus: "प्लॉट स्थिती:",
      available: "उपलब्ध",
      listedOn: "यादी केलेली तारीख:",
      mediaNotAvailable: "मीडिया उपलब्ध नाही",
      noMediaAvailable: "मीडिया उपलब्ध नाहीत",
      images: "चित्रे",
      videos: "व्हिडिओ",
      changeLanguage: "भाषा बदला",
      english: "इंग्रजी",
      marathi: "मराठी"
    }
  };

  const t = translations[currentLang];

  const handleMediaError = (index: number) => {
    setMediaErrors(prev => new Set(prev).add(index));
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        if (!id) {
          setError("No listing ID provided");
          setLoading(false);
          return;
        }

        const listingData = await getListingApi(id);
        setListing(listingData);
        
        // Process media items (images + videos)
        const media: MediaItem[] = [];
        
        // Add images
        if (listingData.images && Array.isArray(listingData.images)) {
          listingData.images.forEach((url: string) => {
            media.push({ type: 'image', url });
          });
        }
        
        // Add videos
        if (listingData.videos && Array.isArray(listingData.videos)) {
          listingData.videos.forEach((url: string) => {
            media.push({ type: 'video', url });
          });
        }
        
        setMediaItems(media);
      } catch (err: any) {
        console.error("Error fetching listing:", err);
        setError(err.message || "Failed to fetch listing details");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const nextMedia = () => {
    if (mediaItems.length > 0) {
      setCurrentMediaIndex((prevIndex) => 
        prevIndex === mediaItems.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevMedia = () => {
    if (mediaItems.length > 0) {
      setCurrentMediaIndex((prevIndex) => 
        prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1
      );
    }
  };

  // Toggle language function
  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'mr' : 'en';
    onLanguageChange(newLang);
  };

  if (loading) return <div className="p-8 text-center">{t.loading}</div>;
  if (error) return <div className="p-8 text-center text-red-500">{t.error} {error}</div>;
  if (!listing) return <div className="p-8 text-center">{t.noListing}</div>;

  // Format price with Indian numbering system
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  // Format price in Marathi digits
  const formatPriceInMarathi = (price: number): string => {
    if (currentLang !== 'mr' || price === undefined || price === null || isNaN(price)) {
      return `₹${formatPrice(price || 0)}`;
    }
    
    const marathiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    const formattedPrice = formatPrice(price);
    const marathiFormatted = formattedPrice.replace(/\d/g, (digit) => marathiDigits[parseInt(digit)]);
    
    return `₹${marathiFormatted}`;
  };

  // Format numbers in Marathi
  const formatNumberInMarathi = (num: number): string => {
    if (currentLang !== 'mr' || num === undefined || num === null) return num?.toString() || '0';
    
    const marathiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num.toString().replace(/\d/g, (digit) => marathiDigits[parseInt(digit)]);
  };

  // Get plot type label
  const getPlotTypeLabel = (type: string) => {
    const plotTypes = {
      en: {
        'agriculture': 'Agriculture Plot',
        'non-agriculture': 'Non-Agricultural Plot',
        'mountain': 'Mountain Plot',
        'residential': 'Residential Plot',
        'commercial': 'Commercial Plot'
      },
      mr: {
        'agriculture': 'शेती जमीन',
        'non-agriculture': 'अशेती जमीन',
        'mountain': 'पर्वतीय जमीन',
        'residential': 'रहिवासी जमीन',
        'commercial': 'व्यावसायिक जमीन'
      }
    };
    return plotTypes[currentLang][type] || type;
  };

  // Get plot sub-type label
  const getPlotSubTypeLabel = (type: string, subType: string) => {
    const plotSubTypes = {
      en: {
        'agriculture': {
          'land': 'Land',
          'vegetable': 'Vegetable Plot',
          'fruit': 'Fruit Plot',
          'sugarcane': 'Sugarcane',
          'banana': 'Banana',
          'grapes': 'Grapes'
        },
        'non-agriculture': {
          'na': 'NA',
          'gunta': 'Gunta'
        },
        'mountain': {
          'top': 'Top',
          'bottom': 'Bottom',
          'tilt': 'Tilt'
        },
        'residential': {
          'residential': 'Residential'
        },
        'commercial': {
          'commercial': 'Commercial'
        }
      },
      mr: {
        'agriculture': {
          'land': 'जमीन',
          'vegetable': 'भाजीपाला जमीन',
          'fruit': 'फळबागा जमीन',
          'sugarcane': 'ऊस',
          'banana': 'केळी',
          'grapes': 'द्राक्षे'
        },
        'non-agriculture': {
          'na': 'नॉन-एग्री',
          'gunta': 'गुंटा'
        },
        'mountain': {
          'top': 'वरची',
          'bottom': 'खालची',
          'tilt': 'तिरपी'
        },
        'residential': {
          'residential': 'रहिवासी'
        },
        'commercial': {
          'commercial': 'व्यावसायिक'
        }
      }
    };
    
    return plotSubTypes[currentLang][type]?.[subType] || subType;
  };

  // Get current media item
  const currentMedia = mediaItems[currentMediaIndex];

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header with back button and language toggle */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.backToListings}
          </Button>
          
          <div className="flex items-center gap-3">
            {/* Simple Language Toggle Button */}
            <Button
              variant="outline"
              onClick={toggleLanguage}
              className="flex items-center gap-2"
            >
              <Languages className="h-4 w-4" />
              {currentLang === 'en' ? 'मराठी' : 'English'}
            </Button>
            
            {userRole === 'seller' && (
              <Button 
                onClick={() => navigate(`/edit/${listing._id}`)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                {t.editListing}
              </Button>
            )}
          </div>
        </div>

        {/* Plot Title and Verification */}
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{listing.name}</h1>
          {listing.verified && (
            <Badge className="bg-green-500 text-white flex items-center gap-1">
              <Verified className="h-4 w-4" />
              {t.verified}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 mb-6">
          <MapPin className="h-4 w-4" />
          <span>{listing.address}</span>
        </div>

        {/* Main Media with Carousel */}
        <div className="mb-8 relative">
          {mediaItems.length > 0 ? (
            <div className="relative group">
              {!mediaErrors.has(currentMediaIndex) && currentMedia ? (
                currentMedia.type === 'image' ? (
                  <img
                    src={currentMedia.url}
                    alt={listing.name}
                    className="w-full h-96 object-cover rounded-lg shadow-md"
                    onError={() => handleMediaError(currentMediaIndex)}
                  />
                ) : (
                  <div className="w-full h-96 bg-black rounded-lg overflow-hidden flex items-center justify-center">
                    <video 
                      src={currentMedia.url} 
                      className="w-full h-full object-cover"
                      controls
                    />
                  </div>
                )
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex flex-col items-center justify-center">
                  {currentMedia?.type === 'video' ? (
                    <VideoIcon className="h-16 w-16 text-gray-400 mb-4" />
                  ) : (
                    <ImageIcon className="h-16 w-16 text-gray-400 mb-4" />
                  )}
                  <p className="text-gray-500">{t.mediaNotAvailable}</p>
                </div>
              )}
              
              {/* Media Type Badge */}
              {currentMedia && (
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {currentMedia.type === 'image' ? (
                    <>
                      <ImageIcon className="h-4 w-4" />
                      {t.images}
                    </>
                  ) : (
                    <>
                      <VideoIcon className="h-4 w-4" />
                      {t.videos}
                    </>
                  )}
                </div>
              )}
              
              {/* Navigation Arrows */}
              {mediaItems.length > 1 && (
                <>
                  <button
                    onClick={prevMedia}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  
                  <button
                    onClick={nextMedia}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
              
              {/* Media Counter */}
              {mediaItems.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentLang === 'mr' 
                    ? `${formatNumberInMarathi(currentMediaIndex + 1)} / ${formatNumberInMarathi(mediaItems.length)}` 
                    : `${currentMediaIndex + 1} / ${mediaItems.length}`
                  }
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex flex-col items-center justify-center">
              <ImageIcon className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500">{t.noMediaAvailable}</p>
            </div>
          )}
        </div>

        {/* Media Thumbnails */}
        {mediaItems.length > 1 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              {t.allMedia} ({currentLang === 'mr' ? formatNumberInMarathi(mediaItems.length) : mediaItems.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mediaItems.map((media, index) => (
                <div 
                  key={index} 
                  className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                    index === currentMediaIndex ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  onClick={() => setCurrentMediaIndex(index)}
                >
                  {media.type === 'image' ? (
                    !mediaErrors.has(index) ? (
                      <img
                        src={media.url}
                        alt={`${listing.name} ${index + 1}`}
                        className="w-full h-24 object-cover"
                        onError={() => handleMediaError(index)}
                      />
                    ) : (
                      <div className="w-full h-24 bg-gray-200 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )
                  ) : (
                    <div className="w-full h-24 bg-gray-800 flex items-center justify-center relative">
                      <VideoIcon className="h-8 w-8 text-white" />
                      <Play className="h-6 w-6 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                    {currentLang === 'mr' ? formatNumberInMarathi(index + 1) : index + 1}
                  </div>
                  <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                    {media.type === 'image' ? (currentLang === 'mr' ? 'चित्र' : 'IMG') : (currentLang === 'mr' ? 'व्हिडिओ' : 'VID')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Plot Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">{t.plotDetails}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Ruler className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.plotSize}</p>
                    <p className="font-semibold">
                      {currentLang === 'mr' ? formatNumberInMarathi(listing.plotSize || 0) : listing.plotSize || 0} 
                      {currentLang === 'mr' ? ' एकर' : ' acres'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <IndianRupee className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.pricePerUnit}</p>
                    <p className="font-semibold">{formatPriceInMarathi(listing.pricePerUnit || 0)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <IndianRupee className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.totalPrice}</p>
                    <p className="font-semibold">{formatPriceInMarathi(listing.totalPrice || 0)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <span className="text-blue-600 font-semibold">Type</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.listingType}</p>
                    <p className="font-semibold capitalize">{listing.type || 'sale'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Plot Type Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">{t.plotTypeInfo}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-full">
                    <span className="text-green-600 font-semibold">{currentLang === 'mr' ? 'मुख्य' : 'Main'}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.plotType}</p>
                    <p className="font-semibold">{getPlotTypeLabel(listing.plotType || '')}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-full">
                    <span className="text-green-600 font-semibold">{currentLang === 'mr' ? 'उप' : 'Sub'}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.plotSubType}</p>
                    <p className="font-semibold">
                      {getPlotSubTypeLabel(listing.plotType || '', listing.plotSubType || '')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">{t.description}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {listing.description || t.noDescription}
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t.contactInfo}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.listedBy}</p>
                    <p className="font-semibold text-blue-800">{t.plotOwner}</p>
                  </div>
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
                  {t.contactOwner}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Pricing & Summary */}
          <div>
            {/* Pricing Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">
                <IndianRupee className="h-5 w-5 inline mr-2 text-blue-600" />
                {t.pricingDetails}
              </h2>
              
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-gray-600 text-sm block mb-1">
                    {listing.type === 'rent' ? t.pricePerAcreGunta : t.salePrice}
                  </span>
                  <span className="text-3xl font-bold text-blue-600 block">
                    {formatPriceInMarathi(listing.pricePerUnit || 0)}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    {listing.plotType === 'non-agriculture' && listing.plotSubType === 'gunta' ? t.perGunta : t.perAcre}
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">{t.plotSize}:</span>
                    <span className="font-medium">
                      {currentLang === 'mr' ? formatNumberInMarathi(listing.plotSize || 0) : listing.plotSize || 0} 
                      {currentLang === 'mr' ? ' एकर' : ' acres'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t.totalPrice}:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatPriceInMarathi(listing.totalPrice || 0)}
                    </span>
                  </div>
                </div>
                
                {listing.type === 'rent' && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-blue-700 text-sm text-center">
                      {t.longTermLease}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Plot Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold mb-4">
                {t.plotSummary}
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">{t.plotId}</span>
                  <span className="font-mono text-blue-600">{listing._id?.substring(0, 8).toUpperCase()}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">{t.listingType}:</span>
                  <span className="font-medium capitalize">{listing.type || 'sale'}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">{t.plotType}:</span>
                  <span className="font-medium">{getPlotTypeLabel(listing.plotType || '')}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">{t.totalMedia}:</span>
                  <span className="font-medium">
                    {currentLang === 'mr' ? formatNumberInMarathi(mediaItems.length) : mediaItems.length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">{t.plotStatus}:</span>
                  <span className="font-medium text-green-600">{t.available}</span>
                </div>
                
                {listing.createdAt && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">{t.listedOn}:</span>
                    <span className="font-medium">
                      {new Date(listing.createdAt).toLocaleDateString(currentLang === 'mr' ? 'mr-IN' : 'en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ListingDetailsPage;