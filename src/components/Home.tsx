import React, { useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
import { PackageSelection } from "@/components/PackageSelection";
import { Footer } from "@/components/Footer";
import Listings from "./Listings";
import ListingsPage from "./ListingsPage";
import { useNavigate } from "react-router-dom";

type HomeProps = {
  currentLang: "en" | "mr";
  onLogout: () => void;
  userRole?: string;
  isAuthenticated: boolean;
  userId: any;
};

const Home: React.FC<HomeProps> = ({
  currentLang,
  onLogout,
  userRole = "buyer",
  isAuthenticated,
  userId
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [localUserId, setLocalUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) setLocalUserId(storedId);
  }, []);

  // ✅ FIX: Remove onSelectPackage if not needed, or fix PackageSelection component
  const handlePackageSelect = (packageType: string) => {
    // Store package selection in localStorage
    localStorage.setItem("selectedPackage", packageType);
    
    // ✅ Optional: Redirect to packages page or show success message
    console.log("Package selected:", packageType);
  };

  const handleSearchSubmit = () => {
    console.log("Search submitted:", searchTerm);
  };

  // ✅ FIX: Enhanced logout with navigation
  const handleLogoutWithRedirect = () => {
    console.log("🏠 Home: Logging out and redirecting...");
    onLogout(); // Call parent logout function
    navigate("/"); // Redirect to home
  };

  // Different content based on user role
  const renderContent = () => {
    if (userRole === "seller") {
      return (
        <>
          <Hero
            currentLang={currentLang}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearchSubmit={handleSearchSubmit}
          />
          <ListingsPage searchTerm={searchTerm} currentLang={currentLang} />
        </>
      );
    }

    // Default buyer view
    return (
      <>
        <Hero
          currentLang={currentLang}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
        />
        <Listings 
          searchTerm={searchTerm} 
          currentLang={currentLang} 
        />
        {!isAuthenticated && (
          <PackageSelection
            currentLang={currentLang}
            // ✅ FIX: Only pass props that exist in PackageSelection component
            userId={localUserId || userId}
            // Remove onSelectPackage if it doesn't exist in PackageSelectionProps
          />
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <main>{renderContent()}</main>
      <Footer currentLang={currentLang} />
    </div>
  );
};

export default Home;