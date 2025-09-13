// components/Listings.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, MapPin, Loader2 } from 'lucide-react';
import { getListingsApi } from '@/lib/api';

interface ListingsProps {
  searchTerm: string;
  currentLang: 'en' | 'mr';
}

const Listings = ({ searchTerm, currentLang = 'en' }: ListingsProps) => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Translations
  const translations = {
    en: {
      loading: "Loading plots...",
      error: "Error",
      noPlotsFound: "No plots found",
      noResultsFor: "No results for",
      beFirst: "Be the first to create a plot listing!",
      createListing: "Create Listing",
      showing: "Showing",
      of: "of",
      plots: "plots",
      for: "for",
      agriculturePlot: "Agriculture Plot",
      nonAgriculturePlot: "Non-Agricultural Plot",
      mountainPlot: "Mountain Plot",
      residentialPlot: "Residential Plot",
      commercialPlot: "Commercial Plot"
    },
    mr: {
      loading: "प्लॉट लोड होत आहेत...",
      error: "त्रुटी",
      noPlotsFound: "कोणतेही प्लॉट सापडले नाहीत",
      noResultsFor: "यासाठी कोणतेही निकाल नाहीत",
      beFirst: "प्लॉट लिस्टिंग तयार करणारे पहिले व्हा!",
      createListing: "लिस्टिंग तयार करा",
      showing: "दाखवत आहे",
      of: "पैकी",
      plots: "प्लॉट",
      for: "साठी",
      agriculturePlot: "शेती जमीन",
      nonAgriculturePlot: "नॉन-एग्रीकल्चर जमीन",
      mountainPlot: "डोंगराळ जमीन",
      residentialPlot: "रहिवासी जमीन",
      commercialPlot: "व्यावसायिक जमीन"
    }
  };

  const t = translations[currentLang];

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListingsApi();
        
        if (data && data.success && Array.isArray(data.listings)) {
          setListings(data.listings);
        } else if (Array.isArray(data)) {
          setListings(data);
        } else {
          setError(data?.message || "Failed to load listings");
          setListings([]);
        }
      } catch (err: any) {
        setError(err.message);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchListings();
  }, []);

  // Filter listings based on search term
  const filteredListings = listings.filter(listing =>
    listing.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.plotType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.plotSubType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleViewDetails = (listingId: string) => {
    if (!isAuthenticated) {
      // Redirect to signup if not authenticated
      navigate('/signup');
      return;
    }
    
    // For buyers, check if they have selected a package
    if (userRole === 'buyer' && !localStorage.getItem("selectedPackage")) {
      // Redirect to package selection if no package selected
      navigate('/packages');
      return;
    }
    
    // If authenticated and has package (or is seller), navigate to listing detail
    navigate(`/listing/${listingId}`);
  };

  if (loading) return (
    <div className="p-8 text-center">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
      <p>{t.loading}</p>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center text-red-500">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
        <h3 className="text-red-800 font-semibold mb-2">{t.error}</h3>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4">

        {/* Results */}
        {!filteredListings || filteredListings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.noPlotsFound}</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? `${t.noResultsFor} "${searchTerm}"` : t.beFirst}
            </p>
            {userRole === 'seller' && (
              <Button onClick={() => navigate('/create-listing')}>
                {t.createListing}
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-gray-600">
                {t.showing} {filteredListings.length} {t.of} {listings.length} {t.plots}
                {searchTerm && ` ${t.for} "${searchTerm}"`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <PropertyCard
                  key={listing._id}
                  property={{
                    id: listing._id,
                    title: listing.name,
                    location: listing.address,
                    price: `₹${listing.totalPrice?.toLocaleString('en-IN')}`,
                    rentPrice: listing.type === 'rent' ? `₹${listing.pricePerUnit}/month` : undefined,
                    type: listing.type,
                    propertyType: getPlotTypeLabel(listing.plotType || 'plot'),
                    plotSize: listing.plotSize,
                    pricePerUnit: listing.pricePerUnit,
                    area: listing.plotSize ? `${listing.plotSize} acres` : '0 acres',
                    image: listing.images?.[0],
                    featured: listing.offer,
                    verified: true,
                    isPlot: true,
                    plotType: listing.plotType,
                    plotSubType: listing.plotSubType
                  }}
                  onView={() => handleViewDetails(listing._id)}
                  onContact={() => console.log('Contact owner:', listing._id)}
                  onFavorite={() => console.log('Add to favorites:', listing._id)}
                  currentLang={currentLang}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Listings;