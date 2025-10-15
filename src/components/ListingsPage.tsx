import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/PropertyCard";
import { getListingsApi, deleteListingApi, authHeaders } from "@/lib/api";
import { Plus } from "lucide-react";
const BASE = "https://real-estate-project-backend-2-2.onrender.com";


interface ListingsPageProps {
  searchTerm?: string;
  currentLang?: 'en' | 'mr';
  userId?: string;
  userRole?: string;
}

const ListingsPage = ({ 
  searchTerm = "", 
  currentLang = "en", 
  userId,
  userRole = "seller"
}: ListingsPageProps) => {
  console.log("ListingsPage - User Role:", userRole, "User ID:", userId);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const translations = {
    en: {
      loading: "Loading your listings...",
      error: "Error",
      tryAgain: "Try Again",
      manageListings: "Manage Your Plot Listings",
      noListings: "No plot listings yet",
      createFirst: "Create your first plot listing to get started!",
      createListing: "Create Plot Listing",
      createNew: "Create New",
      totalPlots: "Total Plots",
      forSale: "For Sale",
      forRent: "For Rent",
      deleteConfirm: "Are you sure you want to delete this listing?",
      deleteSuccess: "Listing deleted successfully",
      deleteFailed: "Failed to delete listing",
      sellerDashboard: "Seller Dashboard",
      yourListings: "Your Listings",
      debugHeaders: "Debug Headers"
    },
    mr: {
      loading: "तुमची यादी लोड होत आहे...",
      error: "त्रुटी",
      tryAgain: "पुन्हा प्रयत्न करा",
      manageListings: "तुमची प्लॉट यादी व्यवस्थापित करा",
      noListings: "अद्याप कोणतीही प्लॉट यादी नाही",
      createFirst: "सुरू करण्यासाठी तुमची पहिली प्लॉट यादी तयार करा!",
      createListing: "प्लॉट यादी तयार करा",
      createNew: "नवीन तयार करा",
      totalPlots: "एकूण प्लॉट",
      forSale: "विक्रीसाठी",
      forRent: "भाड्याने",
      deleteConfirm: "तुम्हाला खात्री आहे की तुम्हाला ही यादी हटवायची आहे?",
      deleteSuccess: "यादी यशस्वीरित्या हटवली",
      deleteFailed: "यादी हटवण्यात अयशस्वी",
      sellerDashboard: "विक्रेता डॅशबोर्ड",
      yourListings: "तुमची यादी",
      debugHeaders: "हेडर डीबग करा"
    }
  };

  const t = translations[currentLang];

  const debugHeaders = async () => {
    const headers = authHeaders();
    console.log('🔧 Current Headers:', headers);
    
    // Test the API call manually
    try {
      const response = await fetch(`${BASE}/api/listings`, {
        headers: headers
      });
      console.log('🔧 Response Status:', response.status);
      
      const data = await response.json();
      console.log('🔧 Response Data:', data);
      
      // Show alert with debug info
      alert(`Debug Info:\nHeaders Sent: ${JSON.stringify(headers, null, 2)}\nResponse Status: ${response.status}\nListings Count: ${data.listings ? data.listings.length : 'N/A'}`);
    } catch (error) {
      console.error('🔧 Debug Error:', error);
      alert(`Debug Error: ${error}`);
    }
  };

  const getCurrentUser = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentUserId = userId || payload.userId;
      const currentUserRole = userRole || payload.role;
      
      if (!currentUserId) return null;
      
      return {
        _id: currentUserId,
        role: currentUserRole,
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

      console.log("📊 ListingsPage - Raw API Response:", data);
      console.log("👤 ListingsPage - Current User:", user);

      if (data && data.success && Array.isArray(data.listings)) {
        // Filter listings to show only user's own listings
        const userListings = data.listings.filter(listing => {
          const isOwner = listing.userRef === user?._id || 
                         (listing.userRef && listing.userRef._id === user?._id) ||
                         listing.userId === user?._id;
          
          console.log(`📝 Listing ${listing._id}:`, {
            name: listing.name,
            userRef: listing.userRef,
            currentUser: user?._id,
            isOwner: isOwner
          });
          
          return isOwner;
        });
        
        console.log("✅ Filtered User Listings:", userListings.length);
        setListings(userListings);
      } else if (Array.isArray(data)) {
        const userListings = data.filter(listing => 
          listing.userRef === userId || listing.userId === userId
        );
        setListings(userListings);
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
      console.error("Error deleting listing:", err);
      alert(t.deleteFailed);
    }
  };

  const handleCreateNew = () => {
    navigate("/create-listing");
  };

  useEffect(() => {
    loadListings();
  }, [userId, userRole]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
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
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section - Title perfectly centered, button top-right */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          {/* Perfectly Centered Title Section */}
          <div className="text-center w-full md:w-auto md:absolute md:left-1/2 md:transform md:-translate-x-1/2 mb-4 md:mb-0">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              {t.sellerDashboard}
            </h1>
            <p className="text-gray-600 text-lg">
              {t.manageListings}
            </p>
          </div>
          
          {/* Create New Button - Top Right */}
          <div className="w-full md:w-auto md:ml-auto flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={debugHeaders}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors duration-200 flex items-center space-x-2 w-full md:w-auto justify-center"
            >
              <span>🐛</span>
              <span>{t.debugHeaders}</span>
            </Button>
            <Button 
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors duration-200 flex items-center space-x-2 w-full md:w-auto justify-center"
            >
              <Plus className="h-4 w-4" />
              <span>{t.createNew}</span>
            </Button>
          </div>
        </div>

        {/* Debug Info Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-yellow-800 font-semibold">Debug Information</h3>
              <p className="text-yellow-700 text-sm">
                Current Role: <strong>{userRole}</strong> | 
                User ID: <strong>{userId}</strong> | 
                Total Listings: <strong>{listings.length}</strong>
              </p>
            </div>
            <Button 
              onClick={debugHeaders}
              variant="outline" 
              size="sm"
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
            >
              Test Headers
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600">{listings.length}</div>
            <div className="text-sm text-gray-600">{t.totalPlots}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-green-600">
              {listings.filter(l => l.type === 'sale').length}
            </div>
            <div className="text-sm text-gray-600">{t.forSale}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {listings.filter(l => l.type === 'rent').length}
            </div>
            <div className="text-sm text-gray-600">{t.forRent}</div>
          </div>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🌱</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t.noListings}
            </h3>
            <p className="text-gray-600 mb-6">
              {t.createFirst}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={debugHeaders}
                className="bg-yellow-600 hover:bg-yellow-700 flex items-center space-x-2"
              >
                <span>🐛</span>
                <span>{t.debugHeaders}</span>
              </Button>
              <Button 
                onClick={handleCreateNew}
                className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>{t.createListing}</span>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">{t.yourListings}</h2>
              <Button 
                onClick={debugHeaders}
                variant="outline" 
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                🐛 Debug
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <PropertyCard
                  key={listing._id}
                  property={{
                    id: listing._id,
                    title: listing.name || (currentLang === 'mr' ? 'नाव नाही' : 'Untitled Plot'),
                    location: listing.address || (currentLang === 'mr' ? 'स्थान निर्दिष्ट नाही' : 'Location not specified'),
                    price: `₹${(listing.totalPrice || 0).toLocaleString('en-IN')}`,
                    rentPrice: listing.type === 'rent' ? `₹${(listing.pricePerUnit || 0).toLocaleString('en-IN')}/month` : undefined,
                    type: listing.type || "sale",
                    propertyType: listing.plotType || 'plot',
                    plotSize: listing.plotSize || 0,
                    pricePerUnit: listing.pricePerUnit || 0,
                    area: `${listing.plotSize || 0} acres`,
                    image: listing.images?.[0],
                    featured: false,
                    verified: true,
                    isPlot: true,
                    plotType: listing.plotType,
                    plotSubType: listing.plotSubType || ''
                  }}
                  onView={() => navigate(`/listing/${listing._id}`)}
                  onContact={() => console.log("Contact owner for:", listing._id)}
                  onFavorite={() => console.log("Add to favorites:", listing._id)}
                  showActions={true}
                  onEdit={() => navigate(`/edit/${listing._id}`)}
                  onDelete={() => onDelete(listing._id)}
                  currentLang={currentLang}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default ListingsPage;