import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/PropertyCard";
import { getListingsApi, deleteListingApi } from "@/lib/api";

interface ListingsPageProps {
  searchTerm?: string;
  currentLang?: 'en' | 'mr';
}

const ListingsPage = ({ searchTerm = "", currentLang = "en" }: ListingsPageProps) => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Enhanced translations with property type translations
  const translations = {
    en: {
      loading: "Loading listings...",
      error: "Error",
      tryAgain: "Try Again",
      manageListings: "Manage your plot listings",
      allListings: "All Plot Listings",
      browseAll: "Browse all available plots of land",
      noListings: "No plot listings yet",
      noPlots: "No plots available",
      createFirst: "Create your first plot listing to get started!",
      checkBack: "Check back later for new plot listings",
      createListing: "Create Plot Listing",
      totalPlots: "Total Plots",
      forSale: "For Sale",
      forRent: "For Rent",
      deleteConfirm: "Are you sure you want to delete this listing?",
      deleteSuccess: "Listing deleted successfully",
      deleteFailed: "Failed to delete listing",
      deleteError: "Error deleting listing",
      // Property type translations
      agriculturePlot: "Agriculture Plot",
      nonAgriculturePlot: "Non-Agricultural Plot",
      mountainPlot: "Mountain Plot",
      residentialPlot: "Residential Plot",
      commercialPlot: "Commercial Plot",
      land: "Land",
      vegetable: "Vegetable Plot",
      fruit: "Fruit Plot",
      sugarcane: "Sugarcane",
      banana: "Banana",
      grapes: "Grapes",
      na: "NA",
      gunta: "Gunta",
      top: "Top",
      bottom: "Bottom",
      tilt: "Tilt",
      // Month translation
      month: "month"
    },
    mr: {
      loading: "यादी लोड होत आहे...",
      error: "त्रुटी",
      tryAgain: "पुन्हा प्रयत्न करा",
      manageListings: "तुमची प्लॉट यादी व्यवस्थापित करा",
      allListings: "सर्व प्लॉट यादी",
      browseAll: "सर्व उपलब्ध प्लॉट ब्राउझ करा",
      noListings: "अद्याप कोणतीही प्लॉट यादी नाही",
      noPlots: "कोणतेही प्लॉट उपलब्ध नाहीत",
      createFirst: "सुरू करण्यासाठी तुमची पहिली प्लॉट यादी तयार करा!",
      checkBack: "नवीन प्लॉट यादीसाठी नंतर पुन्हा तपासा",
      createListing: "प्लॉट यादी तयार करा",
      totalPlots: "एकूण प्लॉट",
      forSale: "विक्रीसाठी",
      forRent: "भाड्याने",
      deleteConfirm: "तुम्हाला खात्री आहे की तुम्हाला ही यादी हटवायची आहे?",
      deleteSuccess: "यादी यशस्वीरित्या हटवली",
      deleteFailed: "यादी हटवण्यात अयशस्वी",
      deleteError: "यादी हटवताना त्रुटी",
      // Property type translations
      agriculturePlot: "शेती जमीन",
      nonAgriculturePlot: "नॉन-एग्रीकल्चर जमीन",
      mountainPlot: "डोंगराळ जमीन",
      residentialPlot: "रहिवासी जमीन",
      commercialPlot: "व्यावसायिक जमीन",
      land: "जमीन",
      vegetable: "भाजीपाला जमीन",
      fruit: "फळबागा जमीन",
      sugarcane: "ऊस",
      banana: "केळी",
      grapes: "द्राक्षे",
      na: "एनए",
      gunta: "गुंटा",
      top: "वरचा भाग",
      bottom: "खालचा भाग",
      tilt: "झुकणारा",
      // Month translation
      month: "महिना"
    }
  };

  const t = translations[currentLang];

  // Function to translate plot sub-type to Marathi
  const translatePlotSubType = (subType: string): string => {
    if (currentLang !== 'mr') return subType;
    
    const subTypeTranslations: Record<string, string> = {
      'land': t.land,
      'vegetable': t.vegetable,
      'fruit': t.fruit,
      'sugarcane': t.sugarcane,
      'banana': t.banana,
      'grapes': t.grapes,
      'na': t.na,
      'gunta': t.gunta,
      'top': t.top,
      'bottom': t.bottom,
      'tilt': t.tilt
    };
    
    return subTypeTranslations[subType] || subType;
  };

  // Function to format numbers in Marathi
  const formatNumberInMarathi = (num: number): string => {
    if (currentLang !== 'mr' || num === undefined || num === null) return num?.toString() || '0';
    
    const marathiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num.toString().replace(/\d/g, (digit) => marathiDigits[parseInt(digit)]);
  };

  // Function to format price in Marathi
  const formatPriceInMarathi = (price: number): string => {
    // Handle undefined, null, or invalid price values
    if (price === undefined || price === null || isNaN(price)) {
      return currentLang === 'mr' ? '₹०' : '₹0';
    }
    
    if (currentLang !== 'mr') {
      return `₹${price.toLocaleString('en-IN')}`;
    }
    
    // Convert the price to a string and format with commas
    const formattedPrice = price.toLocaleString('en-IN');
    
    // Convert English digits to Marathi digits
    const marathiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    const marathiFormatted = formattedPrice.replace(/\d/g, (digit) => marathiDigits[parseInt(digit)]);
    
    return `₹${marathiFormatted}`;
  };

  // Function to get plot type label with translation
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

  // Get user info from JWT token
  const getCurrentUser = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        _id: payload.userId,
        role: payload.role,
        name: payload.name,
        email: payload.email
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const loadListings = async () => {
    try {
      setLoading(true);
      const data = await getListingsApi();
      const user = getCurrentUser();

      if (data && data.success && Array.isArray(data.listings)) {
        setListings(data.listings);
      } else if (Array.isArray(data)) {
        setListings(data);
      } else {
        setError(data?.message || "Failed to load listings");
        setListings([]);
      }
    } catch (err) {
      console.error("Error loading listings:", err);
      setError("Failed to load listings");
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm(t.deleteConfirm)) return;
    try {
      const data = await deleteListingApi(id);
      if (data?.success) {
        setListings((prev) => prev.filter((x) => x._id !== id));
        alert(t.deleteSuccess);
      } else {
        alert(t.deleteFailed);
      }
    } catch (err) {
      console.error(t.deleteError, err);
      alert(t.deleteFailed);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const user = getCurrentUser();
  const isSeller = user && user.role === 'seller';

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>{t.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
          <h3 className="text-red-800 font-semibold mb-2">{t.error}</h3>
          <p className="text-red-600">{error}</p>
          <Button 
            onClick={loadListings} 
            className="mt-4 bg-red-600 hover:bg-red-700"
          >
            {t.tryAgain}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isSeller ? t.manageListings : t.allListings}
          </h1>
          <p className="text-gray-600">
            {isSeller ? '' : t.browseAll}
          </p>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🌱</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isSeller ? t.noListings : t.noPlots}
            </h3>
            <p className="text-gray-600 mb-6">
              {isSeller ? t.createFirst : t.checkBack}
            </p>
            {isSeller && (
              <Button 
                onClick={() => navigate("/create-listing")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {t.createListing}
              </Button>
            )}
          </div>
        ) : (
          <>
            {isSeller && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentLang === 'mr' ? formatNumberInMarathi(listings.length) : listings.length}
                  </div>
                  <div className="text-sm text-gray-600">{t.totalPlots}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {currentLang === 'mr' ? 
                      formatNumberInMarathi(listings.filter(l => l.type === 'sale').length) : 
                      listings.filter(l => l.type === 'sale').length
                    }
                  </div>
                  <div className="text-sm text-gray-600">{t.forSale}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {currentLang === 'mr' ? 
                      formatNumberInMarathi(listings.filter(l => l.type === 'rent').length) : 
                      listings.filter(l => l.type === 'rent').length
                    }
                  </div>
                  <div className="text-sm text-gray-600">{t.forRent}</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => {
                // Check if current user is the owner of this listing
                const isOwner = isSeller && (
                  listing.userRef === user._id || 
                  (listing.userRef && listing.userRef._id === user._id)
                );
                
                // Format total price - ensure we have a valid number
                const totalPrice = listing.totalPrice || 0;
                const formattedPrice = formatPriceInMarathi(totalPrice);
                
                // Format rent price if applicable
                let formattedRentPrice = undefined;
                if (listing.type === 'rent' && listing.pricePerUnit) {
                  const rentPrice = formatPriceInMarathi(listing.pricePerUnit);
                  formattedRentPrice = currentLang === 'mr' ? 
                    `${rentPrice}/${t.month}` : 
                    `${rentPrice}/month`;
                }
                
                // Format area - ensure we have a valid number
                const plotSize = listing.plotSize || 0;
                const formattedArea = currentLang === 'mr' ? 
                  `${formatNumberInMarathi(plotSize)} एकर` : 
                  `${plotSize} acres`;
                
                return (
                  <PropertyCard
                    key={listing._id}
                    property={{
                      id: listing._id,
                      title: listing.name || (currentLang === 'mr' ? 'नाव नाही' : 'Untitled Plot'),
                      location: listing.address || (currentLang === 'mr' ? 'स्थान निर्दिष्ट नाही' : 'Location not specified'),
                      price: formattedPrice,
                      rentPrice: formattedRentPrice,
                      type: listing.type || "sale",
                      propertyType: getPlotTypeLabel(listing.plotType || 'plot'),
                      plotSize: plotSize,
                      pricePerUnit: listing.pricePerUnit || 0,
                      area: formattedArea,
                      image: listing.images?.[0],
                      featured: false,
                      verified: true,
                      isPlot: true,
                      plotType: listing.plotType,
                      plotSubType: translatePlotSubType(listing.plotSubType || '')
                    }}
                    onView={() => navigate(`/listing/${listing._id}`)}
                    onContact={() => console.log("Contact owner for:", listing._id)}
                    onFavorite={() => console.log("Add to favorites:", listing._id)}
                    // Only show edit/delete actions to the owner (seller) of the listing
                    showActions={isOwner}
                    onEdit={() => navigate(`/edit/${listing._id}`)}
                    onDelete={() => onDelete(listing._id)}
                    currentLang={currentLang}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default ListingsPage;