
import React, { useState } from "react";
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
};

const Home: React.FC<HomeProps> = ({
  currentLang,
  onLogout,
  userRole = "buyer",
  isAuthenticated,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handlePackageSelect = (packageType: string) => {
    console.log("Selected package:", packageType);
    // Store package selection in localStorage
    localStorage.setItem("selectedPackage", packageType);
  };

  const handleSearchSubmit = () => {
    console.log("Search submitted:", searchTerm);
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
            onSelectPackage={handlePackageSelect}
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