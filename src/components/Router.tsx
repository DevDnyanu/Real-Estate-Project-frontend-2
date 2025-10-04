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
import About from './About';
import Contact from './Contact';
import { PackageSelection } from '@/components/PackageSelection';
import { hasValidPackage, canPerformAction } from '@/lib/packageUtils';
import ForgotPassword from './ForgotPassword';
import VerifyOTP from './VerifyOTP';
import ResetPassword from './ResetPassword';

interface RouterProps {
  isAuthenticated: boolean;
  userRole: string;
  userId: string;
  onLogin: (token: string, role: string, userId: string, name: string, image?: string) => void;
  onLogout: () => void;
  currentLang: "en" | "mr";
  onLanguageChange: (lang: "en" | "mr") => void;
  onUpdateProfile: (name: string, email: string, phone: string, image: string) => void;
  userName: string;
  userImage: string;
  userEmail?: string;
  userPhone?: string;
}

const Router: React.FC<RouterProps> = ({ 
  isAuthenticated, 
  userRole, 
  userId,
  onLogin, 
  onLogout,
  currentLang,
  onLanguageChange,
  onUpdateProfile,
  userName,
  userImage,
  userEmail = "",
  userPhone = ""
}) => {
  const navigate = useNavigate();
  
  const handlePackageSuccess = () => {
    console.log("Package purchased successfully");
    const redirectPath = userRole === 'seller' ? '/create-listing' : '/';
    navigate(redirectPath);
  };

  const hasValidPackageForRole = () => {
    if (userRole === 'buyer') {
      return hasValidPackage() && canPerformAction('view');
    } else if (userRole === 'seller') {
      return hasValidPackage() && canPerformAction('create');
    }
    return false;
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
            userId={userId}
          />
        } 
      />
      
      <Route 
        path="/about" 
        element={<About currentLang={currentLang} />} 
      />
      
      <Route 
        path="/contact" 
        element={<Contact currentLang={currentLang} />} 
      />
      
      {/* Password Reset Routes */}
      <Route 
        path="/forgot-password" 
        element={<ForgotPassword currentLang={currentLang} />} 
      />
      
      <Route 
        path="/verify-otp" 
        element={<VerifyOTP currentLang={currentLang} />} 
      />
      
      <Route 
        path="/reset-password" 
        element={<ResetPassword currentLang={currentLang} />} 
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
              onSuccess={handlePackageSuccess}
              userType={userRole as 'buyer' | 'seller'}
              userId={userId}
              redirectPath={userRole === 'seller' ? '/create-listing' : '/'}
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
            <Profile 
              userRole={userRole} 
              onLogout={onLogout} 
              currentLang={currentLang} 
              userId={userId} 
              onUpdateProfile={onUpdateProfile}
              userName={userName}
              userImage={userImage}
              userEmail={userEmail}
              userPhone={userPhone}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* BUYER Routes */}
      <Route 
        path="/properties" 
        element={
          isAuthenticated ? (
            userRole === 'buyer' ? (
              <Listings currentLang={currentLang} />
            ) : (
              <Navigate to="/listings" />
            )
          ) : (
            <Navigate to="/login?redirect=/properties" />
          )
        } 
      />
      
      <Route 
        path="/listing/:id" 
        element={
          isAuthenticated ? (
            (userRole === 'buyer' && !hasValidPackageForRole()) ? (
              <Navigate to="/packages" />
            ) : (
              <ListingDetailsPage 
                currentLang={currentLang} 
                onLanguageChange={onLanguageChange}
              />
            )
          ) : (
            <Navigate to="/login?redirect=/listing/:id" />
          )
        } 
      />

      {/* SELLER Routes */}
      <Route
        path="/create-listing"
        element={
          isAuthenticated ? (
            userRole === 'seller' ? (
              hasValidPackageForRole() ? (
                <CreateListing currentLang={currentLang} onLanguageChange={onLanguageChange} userId={userId} />
              ) : (
                <Navigate to="/packages" />
              )
            ) : (
              <Navigate to="/properties" />
            )
          ) : (
            <Navigate to="/login?role=seller" />
          )
        }
      />

      <Route
        path="/listings"
        element={
          isAuthenticated ? (
            userRole === 'seller' ? (
              <ListingsPage currentLang={currentLang} userId={userId} userRole={userRole} />
            ) : (
              <Navigate to="/properties" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/edit/:id"
        element={
          isAuthenticated ? (
            userRole === 'seller' ? (
              <EditListing currentLang={currentLang} onLanguageChange={onLanguageChange} userId={userId} />
            ) : (
              <Navigate to="/properties" />
            )
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