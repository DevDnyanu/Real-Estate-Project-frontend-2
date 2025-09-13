// components/Router.tsx
import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import SignUpPage from './Signup';
import CreateListing from './CreateListing';
import Listings from './Listings';
import EditListing from './EditListing';
import ListingsPage from './ListingsPage';
import ListingDetailsPage from './ListingDetailsPage';
import Profile from './Profile';
import { PackageSelection } from '@/components/PackageSelection';

interface RouterProps {
  isAuthenticated: boolean;
  userRole: string;
  onLogin: (token: string, role: string, userId: string) => void;
  onLogout: () => void;
  currentLang: "en" | "mr";
}

const Router: React.FC<RouterProps> = ({ 
  isAuthenticated, 
  userRole, 
  onLogin, 
  onLogout,
  currentLang 
}) => {
  const navigate = useNavigate();
  
  // Function to handle package selection
  const handlePackageSelect = (packageType: string) => {
    console.log("Selected package:", packageType);
    localStorage.setItem("selectedPackage", packageType);
    navigate('/'); // Redirect to home after selection
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={
          <Home 
            currentLang={currentLang}
            onLogout={onLogout} 
            userRole={userRole}
            isAuthenticated={isAuthenticated}
          />
        } 
      />
      
      <Route 
        path="/properties" 
        element={
          isAuthenticated ? (
            <ListingsPage currentLang={currentLang} />
          ) : (
            <Navigate to="/login?redirect=/properties" />
          )
        } 
      />
      
      <Route 
        path="/listing/:id" 
        element={
          isAuthenticated ? (
            // Check if user has selected a package (for buyers only)
            (userRole === 'buyer' && !localStorage.getItem("selectedPackage")) ? (
              <Navigate to="/packages" />
            ) : (
              <ListingDetailsPage />
            )
          ) : (
            <Navigate to="/login?redirect=/listing/:id" />
          )
        } 
      />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <Login onLogin={onLogin} currentLang={currentLang} />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/signup"
        element={
          !isAuthenticated ? (
            <SignUpPage onLogin={onLogin} currentLang={currentLang} />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* Package Selection Route */}
      <Route 
        path="/packages" 
        element={
          isAuthenticated ? (
            <PackageSelection 
              currentLang={currentLang} 
              onSelectPackage={handlePackageSelect}
            />
          ) : (
            <Navigate to="/login" />
          )
        } 
      />

      {/* Protected Routes */}
      <Route
        path="/profile"
        element={
          isAuthenticated ? (
            <Profile userRole={userRole} onLogout={onLogout} currentLang={currentLang} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Seller Only Routes */}
      <Route
        path="/create-listing"
        element={
          isAuthenticated && userRole === 'seller' ? (
            <CreateListing currentLang={currentLang} />
          ) : isAuthenticated ? (
            <Navigate to="/" />
          ) : (
            <Navigate to="/login?role=seller" />
          )
        }
      />

      <Route
        path="/listings"
        element={
          isAuthenticated ? (
            <ListingsPage currentLang={currentLang} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/edit/:id"
        element={
          isAuthenticated && userRole === 'seller' ? (
            <EditListing currentLang={currentLang} />
          ) : isAuthenticated ? (
            <Navigate to="/" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default Router;