import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Award, Star, Gift, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createPaymentOrderApi, verifyPaymentApi, activateFreePackageApi, getUserPackageApi } from '@/lib/api';
import { loadRazorpay } from '@/lib/loadRazorpay';
import { useEffect, useState } from 'react';

interface PackageSelectionProps {
  currentLang: 'en' | 'mr';
  userType?: 'buyer' | 'seller';
  onSuccess?: () => void;
  onPackageUpdate?: (userPackage: any) => void;
  userId?: string;
  redirectPath?: string;
}

interface UserPackage {
  _id?: string;
  packageType: string;
  userType: string;
  purchaseDate: string;
  expiryDate: string;
  propertyLimit: number;
  propertiesUsed: number;
  isActive: boolean;
  daysRemaining: number;
  amount: number;
  remaining: number;
  isExpired?: boolean;
  limitReached?: boolean;
}

interface CreateOrderResponse {
  success: boolean;
  order: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
  };
  packageDetails: {
    packageType: string;
    userType: string;
    amount: number;
    duration: number;
    propertyLimit: number;
  };
  key_id: string;
  message?: string; // Add this line to fix the error
}

const translations = {
  en: {
    subtitle: 'Unlock premium features to view plot details',
    sellerSubtitle: 'Choose a package to list your properties',
    freeTitle: 'Free Package',
    silverTitle: 'Silver Package',
    goldTitle: 'Gold Package',
    premiumTitle: 'Premium Package',
    price: 499,
    goldPrice: 999,
    premiumPrice: 1999,
    popular: 'Most Popular',
    recommended: 'Recommended',
    bestValue: 'Best Value',
    selectPlan: 'Select Plan',
    getStarted: 'Get Started Free',
    currentPlan: 'Current Plan',
    activeUntil: 'Active until',
    propertiesUsed: 'Properties used',
    daysRemaining: 'days remaining',
    expired: 'Expired',
    upgrade: 'Upgrade',
    renew: 'Renew',
    freeFeatures: [
      'View up to 5 properties',
      'Basic property details',
      'Email notifications',
      '15-day validity'
    ],
    silverFeatures: [
      'View up to 30 properties',
      'Full property details',
      'Contact information access',
      '30-day validity'
    ],
    goldFeatures: [
      'View up to 50 properties',
      'Priority customer support',
      'Advanced search filters',
      '90-day validity'
    ],
    premiumFeatures: [
      'View up to 100 properties',
      '24/7 dedicated support',
      'Price drop alerts',
      '365-day validity'
    ],
    freeSellerFeatures: [
      'List up to 5 properties',
      'Basic property management',
      '15-day listing duration'
    ],
    silverSellerFeatures: [
      'List up to 30 properties',
      'Advanced analytics',
      '30-day listing duration'
    ],
    goldSellerFeatures: [
      'List up to 50 properties',
      'Priority support',
      '90-day listing duration'
    ],
    premiumSellerFeatures: [
      'List up to 100 properties',
      'Premium analytics dashboard',
      '365-day listing duration'
    ],
    loginRequired: 'Please sign up first to select a package',
    packageActive: 'Package Active',
    packageExpired: 'Package Expired',
    limitReached: 'Limit Reached',
    packageActivated: 'Package activated successfully!',
    paymentFailed: 'Payment failed. Please try again.',
    redirecting: 'Redirecting...',
    processing: 'Processing...',
    loading: 'Loading...',
    expiryWarning: 'Your package expires in {days} days',
    upgradePrompt: 'Upgrade to continue enjoying premium features',
    remainingListings: 'Remaining listings: {count}'
  },
  mr: {
    subtitle: 'प्लॉट तपशील पाहण्यासाठी प्रीमियम वैशिष्ट्ये अनलॉक करा',
    sellerSubtitle: 'तुमच्या properties लिस्ट करण्यासाठी पॅकेज निवडा',
    freeTitle: 'मोफत पॅकेज',
    silverTitle: 'चांदी पॅकेज',
    goldTitle: 'सोने पॅकेज',
    premiumTitle: 'प्रीमियम पॅकेज',
    price: 499,
    goldPrice: 999,
    premiumPrice: 1999,
    popular: 'सर्वात लोकप्रिय',
    recommended: 'शिफारस केलेले',
    bestValue: 'सर्वोत्तम मूल्य',
    selectPlan: 'प्लॅन निवडा',
    getStarted: 'मोफत सुरू करा',
    currentPlan: 'सध्याची योजना',
    activeUntil: 'पर्यंत सक्रिय',
    propertiesUsed: 'वापरलेली properties',
    daysRemaining: 'दिवस शिल्लक',
    expired: 'कालबाह्य',
    upgrade: 'अपग्रेड',
    renew: 'नूतनीकरण',
    freeFeatures: [
      '5 पर्यंत properties पहा',
      'मूलभूत property तपशील',
      'ईमेल सूचना',
      '15-दिवस वैधता'
    ],
    silverFeatures: [
      '30 पर्यंत properties पहा',
      'पूर्ण property तपशील',
      'संपर्क माहिती प्रवेश',
      '30-दिवस वैधता'
    ],
    goldFeatures: [
      '50 पर्यंत properties पहा',
      'प्राधान्य ग्राहक समर्थन',
      'प्रगत शोध फिल्टर',
      '90-दिवस वैधता'
    ],
    premiumFeatures: [
      '100 पर्यंत properties पहा',
      '24/7 dedicated समर्थन',
      'किंमत कमी होण्याची सूचना',
      '365-दिवस वैधता'
    ],
    freeSellerFeatures: [
      '5 पर्यंत properties लिस्ट करा',
      'मूलभूत property management',
      '15-दिवस लिस्टिंग कालावधी'
    ],
    silverSellerFeatures: [
      '30 पर्यंत properties लिस्ट करा',
      'प्रगत analytics',
      '30-दिवस लिस्टिंग कालावधी'
    ],
    goldSellerFeatures: [
      '50 पर्यंत properties लिस्ट करा',
      'प्राधान्य समर्थन',
      '90-दिवस लिस्टिंग कालावधी'
    ],
    premiumSellerFeatures: [
      '100 पर्यंत properties लिस्ट करा',
      'प्रीमियम analytics डॅशबोर्ड',
      '365-दिवस लिस्टिंग कालावधी'
    ],
    loginRequired: 'पॅकेज निवडण्यासाठी कृपया प्रथम साइन अप करा',
    packageActive: 'पॅकेज सक्रिय',
    packageExpired: 'पॅकेज कालबाह्य',
    limitReached: 'मर्यादा संपली',
    packageActivated: 'पॅकेज यशस्वीरित्या सक्रिय केला!',
    paymentFailed: 'पेमेंट अयशस्वी. कृपया पुन्हा प्रयत्न करा.',
    redirecting: 'पुनर्निर्देशित होत आहे...',
    processing: 'प्रक्रिया करत आहे...',
    loading: 'लोड होत आहे...',
    expiryWarning: 'तुमचा पॅकेज {days} दिवसांमध्ये कालबाह्य होईल',
    upgradePrompt: 'प्रीमियम वैशिष्ट्ये चालू ठेवण्यासाठी अपग्रेड करा',
    remainingListings: 'उर्वरित लिस्टिंग: {count}'
  }
};

export const PackageSelection = ({ 
  currentLang, 
  userType = 'buyer', 
  onSuccess, 
  onPackageUpdate,
  userId,
  redirectPath
}: PackageSelectionProps) => {
  const t = translations[currentLang];
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log('🔍 PackageSelection - Received userType:', userType);
  console.log('🔍 PackageSelection - Current route:', location.pathname);
  
  const searchParams = new URLSearchParams(location.search);
  const defaultRedirect = userType === 'seller' ? '/create-listing' : '/properties';
  const finalRedirectPath = redirectPath || searchParams.get('redirect') || defaultRedirect;

  console.log('🔍 PackageSelection - Final redirect:', finalRedirectPath);

  const [userPackage, setUserPackage] = useState<UserPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  
  const [loadingPackages, setLoadingPackages] = useState<{[key: string]: boolean}>({});
  const [freePackageLoading, setFreePackageLoading] = useState<string | null>(null);
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);

  const isUserLoggedIn = () => {
    try {
      const token = localStorage.getItem('token');
      const storedUserId = userId || localStorage.getItem("userId");
      return !!token && !!storedUserId;
    } catch (error) {
      return false;
    }
  };

  // ✅ FIXED: Package validation without userType check (packages work across all roles)
  const hasValidPackage = () => {
    if (!userPackage) {
      console.log('❌ No user package found');
      return false;
    }

    const now = new Date();
    const expiryDate = new Date(userPackage.expiryDate);
    const isNotExpired = now <= expiryDate;
    const hasRemainingListings = userPackage.propertiesUsed < userPackage.propertyLimit;

    const isValid = userPackage.isActive && isNotExpired && hasRemainingListings;

    console.log('🔍 Package validation check:', {
      isActive: userPackage.isActive,
      isNotExpired,
      hasRemainingListings,
      packageUserType: userPackage.userType,
      currentUserType: userType,
      note: 'Package works across all roles',
      isValid
    });

    return isValid;
  };

  // ✅ IMPROVED: Fetch package with better error handling
  const fetchUserPackage = async () => {
    if (!isUserLoggedIn()) {
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Fetching package for userType:', userType);
      
      const response = await getUserPackageApi(userType);
      
      console.log('📦 Package fetch response:', response);
      
      if (response.success) {
        setUserPackage(response.package);
        if (response.package) {
          updateLocalStorage(response.package);
          checkExpiryWarning(response.package);
          console.log('✅ Package loaded successfully for:', userType);
        } else {
          console.log('ℹ️ No package found for:', userType);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching package:', error);
      loadPackageFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // ✅ IMPROVED: Load from localStorage with role-specific keys
  const loadPackageFromLocalStorage = () => {
    const selectedPackage = localStorage.getItem(`${userType}SelectedPackage`);
    const userTypeStored = localStorage.getItem(`${userType}UserType`);
    const propertyLimit = localStorage.getItem(`${userType}PropertyLimit`);
    const propertiesUsed = localStorage.getItem(`${userType}PropertiesUsed`);
    const packageExpiry = localStorage.getItem(`${userType}PackageExpiry`);

    console.log('🔄 Loading from localStorage for:', userType, {
      selectedPackage,
      userTypeStored,
      propertyLimit,
      propertiesUsed,
      packageExpiry
    });

    if (selectedPackage && userTypeStored && propertyLimit && packageExpiry) {
      const now = new Date();
      const expiryDate = new Date(packageExpiry);
      const daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      const localPackage: UserPackage = {
        packageType: selectedPackage,
        userType: userTypeStored,
        purchaseDate: localStorage.getItem(`${userType}PackagePurchaseDate`) || now.toISOString(),
        expiryDate: packageExpiry,
        propertyLimit: parseInt(propertyLimit),
        propertiesUsed: parseInt(propertiesUsed || '0'),
        isActive: now <= expiryDate && parseInt(propertiesUsed || '0') < parseInt(propertyLimit),
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
        amount: selectedPackage === 'free' ? 0 : selectedPackage === 'silver' ? 499 : selectedPackage === 'gold' ? 999 : 1999,
        remaining: parseInt(propertyLimit) - parseInt(propertiesUsed || '0'),
        isExpired: now > expiryDate,
        limitReached: parseInt(propertiesUsed || '0') >= parseInt(propertyLimit)
      };
      setUserPackage(localPackage);
      checkExpiryWarning(localPackage);
      
      console.log('✅ Loaded package from localStorage:', localPackage);
    } else {
      console.log('ℹ️ No package found in localStorage for:', userType);
    }
  };

  // ✅ IMPROVED: Save to localStorage with both role-specific and generic keys
  const updateLocalStorage = (pkg: UserPackage) => {
    // Role-specific keys
    localStorage.setItem(`${userType}SelectedPackage`, pkg.packageType);
    localStorage.setItem(`${userType}UserType`, pkg.userType);
    localStorage.setItem(`${userType}PropertyLimit`, pkg.propertyLimit.toString());
    localStorage.setItem(`${userType}PropertiesUsed`, pkg.propertiesUsed.toString());
    localStorage.setItem(`${userType}PackagePurchaseDate`, pkg.purchaseDate);
    localStorage.setItem(`${userType}PackageExpiry`, pkg.expiryDate);
    
    // Generic keys for backward compatibility
    localStorage.setItem('selectedPackage', pkg.packageType);
    localStorage.setItem('userType', pkg.userType);
    localStorage.setItem('propertyLimit', pkg.propertyLimit.toString());
    localStorage.setItem('propertiesUsed', pkg.propertiesUsed.toString());
    localStorage.setItem('packageExpiry', pkg.expiryDate);
    
    console.log('💾 Saved to localStorage for:', userType, pkg);
  };

  const checkExpiryWarning = (pkg: UserPackage) => {
    if (pkg.daysRemaining <= 7 && pkg.daysRemaining > 0) {
      setShowExpiryWarning(true);
    }
  };

  useEffect(() => {
    fetchUserPackage();
  }, [userId, userType]);

  // ✅ IMPROVED: Better redirect logic
  useEffect(() => {
    const checkAndRedirect = () => {
      if (hasValidPackage() && userPackage && !redirecting) {
        console.log('✅ Valid package detected, redirecting to:', finalRedirectPath);
        console.log('📦 Package details:', {
          isActive: userPackage.isActive,
          isExpired: userPackage.isExpired,
          limitReached: userPackage.limitReached,
          remaining: userPackage.remaining,
          userType: userPackage.userType
        });
        
        setRedirecting(true);
        
        const timer = setTimeout(() => {
          navigate(finalRedirectPath, { replace: true });
          if (onSuccess) onSuccess();
        }, 500);
        
        return () => clearTimeout(timer);
      }
    };

    checkAndRedirect();
  }, [userPackage, redirecting, navigate, finalRedirectPath, onSuccess, hasValidPackage]);

  const getFeatures = (packageType: string) => {
    const features = userType === 'seller' ? 
      {
        free: t.freeSellerFeatures,
        silver: t.silverSellerFeatures,
        gold: t.goldSellerFeatures,
        premium: t.premiumSellerFeatures
      } : {
        free: t.freeFeatures,
        silver: t.silverFeatures,
        gold: t.goldFeatures,
        premium: t.premiumFeatures
      };
    
    return features[packageType] || features.free;
  };

  const packages = [
    {
      id: 'free',
      title: t.freeTitle,
      price: 0,
      icon: Gift,
      gradient: 'from-green-400 to-green-600',
      features: getFeatures('free'),
      propertyLimit: 5,
      isFree: true,
      duration: 15
    },
    {
      id: 'silver',
      title: t.silverTitle,
      price: t.price,
      icon: Star,
      gradient: 'from-gray-400 to-gray-600',
      features: getFeatures('silver'),
      propertyLimit: 30,
      isFree: false,
      duration: 30
    },
    {
      id: 'gold',
      title: t.goldTitle,
      price: t.goldPrice,
      icon: Award,
      gradient: 'from-yellow-400 to-yellow-600',
      features: getFeatures('gold'),
      propertyLimit: 50,
      isFree: false,
      duration: 90
    },
    {
      id: 'premium',
      title: t.premiumTitle,
      price: t.premiumPrice,
      icon: Crown,
      gradient: 'from-purple-400 to-purple-600',
      features: getFeatures('premium'),
      propertyLimit: 100,
      isFree: false,
      duration: 365
    }
  ];

  const handlePackageSelection = async (pkg: any) => {
    if (!isUserLoggedIn()) {
      toast.error(t.loginRequired);
      navigate('/login', { 
        state: { 
          from: location.pathname, 
          userType,
          redirect: finalRedirectPath
        } 
      });
      return;
    }

    if (pkg.isFree) {
      await handleFreePackageSelection(pkg);
    } else {
      await initiatePayment(pkg);
    }
  };

  // ✅ IMPROVED: Free package selection with immediate redirect
  const handleFreePackageSelection = async (pkg: any) => {
    const storedUserId = userId || localStorage.getItem("userId");
    
    if (!storedUserId) {
      toast.error(t.loginRequired);
      navigate('/login');
      return;
    }

    try {
      setFreePackageLoading(pkg.id);
      
      console.log('🎯 Activating package request:', {
        packageType: pkg.id,
        userType: userType,
        userId: storedUserId
      });
      
      const response = await activateFreePackageApi(pkg.id, userType);
      
      console.log('📦 Package activation response:', response);
      
      if (response.success && response.package) {
        setUserPackage(response.package);
        updateLocalStorage(response.package);
        
        if (onPackageUpdate) {
          onPackageUpdate(response.package);
        }

        toast.success(t.packageActivated);
        
        // ✅ IMMEDIATE REDIRECT without waiting for useEffect
        setTimeout(() => {
          console.log('🚀 Immediate redirect to:', finalRedirectPath);
          navigate(finalRedirectPath, { replace: true });
          if (onSuccess) onSuccess();
        }, 1000);
        
      } else {
        toast.error(response.message || 'Failed to activate package');
      }
    } catch (error: any) {
      console.error('Error activating free package:', error);
      toast.error(error.message || 'Error activating package');
    } finally {
      setFreePackageLoading(null);
    }
  };

  const initiatePayment = async (pkg: any) => {
    const storedUserId = userId || localStorage.getItem("userId");
    if (!storedUserId) {
      toast.error(t.loginRequired);
      navigate('/login');
      return;
    }

    try {
      setLoadingPackages(prev => ({ ...prev, [pkg.id]: true }));
      
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error('Razorpay SDK failed to load.');
        setLoadingPackages(prev => ({ ...prev, [pkg.id]: false }));
        return;
      }

      console.log('💳 Sending package data to backend:', {
        packageType: pkg.id,
        userType: userType
      });

      const orderData: CreateOrderResponse = await createPaymentOrderApi(pkg.id, userType);

      // ✅ FIXED: Check success property instead of message
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "PlotChamps Real Estate",
        description: `${pkg.title} Package - ${userType}`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          try {
            console.log('✅ Payment successful, response:', response);
            
            const verificationData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              packageType: pkg.id,
              userType: userType
            };

            console.log('🔐 Sending verification data:', verificationData);

            const verifyData = await verifyPaymentApi(verificationData);
            
            if (verifyData.success) {
              await fetchUserPackage();
              toast.success("Payment successful! Package activated.");
              
              if (onPackageUpdate && verifyData.package) {
                onPackageUpdate(verifyData.package);
              }
              
              // ✅ IMMEDIATE REDIRECT after payment success
              setTimeout(() => {
                console.log('🚀 Payment success redirect to:', finalRedirectPath);
                navigate(finalRedirectPath, { replace: true });
                if (onSuccess) onSuccess();
              }, 1500);
              
            } else {
              toast.error("Payment verification failed: " + (verifyData.message || 'Unknown error'));
            }
          } catch (err: any) {
            console.error('Payment verification error:', err);
            toast.error(err.message || "Payment processing failed");
          } finally {
            setLoadingPackages(prev => ({ ...prev, [pkg.id]: false }));
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || "",
          email: localStorage.getItem('userEmail') || "",
          contact: localStorage.getItem('userPhone') || ""
        },
        theme: { color: "#2563eb" },
        modal: {
          ondismiss: function() {
            toast.info('Payment cancelled');
            setLoadingPackages(prev => ({ ...prev, [pkg.id]: false }));
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        console.error('❌ Payment failed:', response);
        toast.error(`Payment failed: ${response.error.description || 'Unknown error'}`);
        setLoadingPackages(prev => ({ ...prev, [pkg.id]: false }));
      });
      
      rzp.open();
      
    } catch (error: any) {
      console.error('Payment initiation error:', error);
      toast.error(error.message || 'Payment failed');
      setLoadingPackages(prev => ({ ...prev, [pkg.id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (showExpiryWarning && userPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{t.expiryWarning.replace('{days}', userPackage.daysRemaining.toString())}</h3>
            <p className="text-muted-foreground mb-4">{t.upgradePrompt}</p>
            <div className="space-y-3">
              <Button 
                onClick={() => setShowExpiryWarning(false)}
                className="w-full"
                variant="outline"
              >
                {currentLang === 'mr' ? 'नंतर करा' : 'Remind Later'}
              </Button>
              <Button 
                onClick={() => setShowExpiryWarning(false)}
                className="w-full"
              >
                {t.upgrade}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ IMPROVED: Active package screen with force redirect
  if (hasValidPackage() && location.pathname.includes('/packages')) {
    console.log('🎯 Showing active package screen for:', userType);
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{t.packageActive}</h3>
            <p className="text-muted-foreground mb-2">
              {t.remainingListings.replace('{count}', userPackage?.remaining.toString() || '0')}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {t.daysRemaining}: {userPackage?.daysRemaining}
            </p>
            <p className="text-sm text-blue-600 mb-4">
              Role: {userPackage?.userType} • Package: {userPackage?.packageType}
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => {
                  console.log('🚀 Continue button clicked, redirecting to:', finalRedirectPath);
                  navigate(finalRedirectPath, { replace: true });
                  if (onSuccess) onSuccess();
                }} 
                className="w-full"
              >
                {currentLang === 'mr' ? 'चालू ठेवा' : 'Continue'}
              </Button>
              <Button 
                onClick={() => {
                  setUserPackage(null);
                  localStorage.removeItem(`${userType}SelectedPackage`);
                  localStorage.removeItem(`${userType}UserType`);
                  localStorage.removeItem(`${userType}PropertyLimit`);
                  localStorage.removeItem(`${userType}PropertiesUsed`);
                  localStorage.removeItem(`${userType}PackageExpiry`);
                }} 
                variant="outline" 
                className="w-full"
              >
                {t.upgrade}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {userType === 'seller' ? 'Seller Packages' : 'PlotChamps Packages'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {userType === 'seller' ? t.sellerSubtitle : t.subtitle}
          </p>
          <div className="mt-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              Current Role: {userType === 'seller' ? 'Seller' : 'Buyer'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {packages.map((pkg) => {
            const IconComponent = pkg.icon;
            const isCurrentPackage = userPackage?.packageType === pkg.id;
            const isFreePackageLoading = freePackageLoading === pkg.id;
            const isPackageProcessing = loadingPackages[pkg.id] || false;

            return (
              <Card key={pkg.id} className={`relative overflow-hidden flex flex-col h-full ${
                isCurrentPackage ? 'ring-2 ring-blue-500' : ''
              }`}>
                {isCurrentPackage && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-green-500 text-white">
                      {currentLang === 'mr' ? 'सध्याचे' : 'Current'}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-2 pt-4 px-4">
                  <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${pkg.gradient} flex items-center justify-center mb-3`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold mb-1">{pkg.title}</CardTitle>
                  <div className="text-xl font-bold text-gray-900 mb-1">
                    {pkg.isFree ? (currentLang === 'mr' ? 'मोफत' : 'Free') : `₹${pkg.price}`}
                  </div>
                  <div className="text-xs text-gray-600">
                    {pkg.duration} {currentLang === 'mr' ? 'दिवस' : 'days'} • {pkg.propertyLimit} {userType === 'seller' ? 'listings' : 'views'}
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between px-4 pb-4">
                  <ul className="space-y-1.5 flex-1 mb-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-1.5 text-xs">
                        <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full mt-2 font-medium py-2 text-sm bg-gradient-to-r ${pkg.gradient} hover:opacity-90 text-white transition-opacity`}
                    onClick={() => handlePackageSelection(pkg)}
                    disabled={isPackageProcessing || isFreePackageLoading || (isCurrentPackage && hasValidPackage())}
                  >
                    {isPackageProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {isPackageProcessing ? t.processing :
                     isFreePackageLoading ? t.loading :
                     isCurrentPackage && hasValidPackage() ? (currentLang === 'mr' ? 'सक्रिय' : 'Active') :
                     pkg.isFree ? t.getStarted : t.selectPlan}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Badge = ({ variant = 'default', className, children }: any) => {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variants = {
    default: "bg-gray-100 text-gray-800",
    secondary: "bg-blue-100 text-blue-800",
    destructive: "bg-red-100 text-red-800"
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default PackageSelection;