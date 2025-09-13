import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Award, Star } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createPaymentOrderApi, verifyPaymentApi } from '@/lib/api';
import { loadRazorpay } from '@/lib/loadRazorpay';

interface PackageSelectionProps {
  currentLang: 'en' | 'mr';
  userType?: 'buyer' | 'seller';
  onSuccess?: () => void;
}

const translations = {
  en: {
    subtitle: 'Unlock premium features to view plot details',
    sellerSubtitle: 'Choose a package to list your properties',
    silverTitle: 'Silver Package',
    goldTitle: 'Gold Package',
    premiumTitle: 'Premium Package',
    price: 499,
    goldPrice: 999,
    premiumPrice: 1999,
    popular: 'Most Popular',
    recommended: 'Recommended',
    selectPlan: 'Select Plan',
    silverFeatures: [
      'View Basic Plot Details',
      'Up to 5 property views per day',
      'Email Notifications',
      'Basic Search Filters'
    ],
    goldFeatures: [
      'Everything in Silver',
      'View Full Plot Details',
      'Contact Information Access',
      'Up to 20 property views per day',
      'Advanced Search Filters',
      'Save Properties'
    ],
    premiumFeatures: [
      'Everything in Gold',
      'Unlimited Property Views',
      'Priority Customer Support',
      'Price Drop Alerts',
      'Virtual Tour Access',
      'Property Comparison Tools',
      'Market Insights'
    ],
    silverSellerFeatures: [
      'List up to 5 properties',
      'Basic property management',
      '30-day listing duration',
      'Standard support'
    ],
    goldSellerFeatures: [
      'Everything in Silver',
      'List up to 20 properties',
      'Advanced analytics',
      '90-day listing duration',
      'Priority support',
      'Featured listings'
    ],
    premiumSellerFeatures: [
      'Everything in Gold',
      'Unlimited listings',
      'Premium analytics dashboard',
      '365-day listing duration',
      '24/7 dedicated support',
      'Top placement in search results',
      'Custom branding options'
    ]
  },
  mr: {
    subtitle: 'प्लॉट तपशील पाहण्यासाठी प्रीमियम वैशिष्ट्ये अनलॉक करा',
    sellerSubtitle: 'तुमच्या properties लिस्ट करण्यासाठी पॅकेज निवडा',
    silverTitle: 'चांदी पॅकेज',
    goldTitle: 'सोने पॅकेज',
    premiumTitle: 'प्रीमियम पॅकेज',
    price: 499,
    goldPrice: 999,
    premiumPrice: 1999,
    popular: 'सर्वात लोकप्रिय',
    recommended: 'शिफारस केलेले',
    selectPlan: 'प्लॅन निवडा',
    silverFeatures: [
      'मूलभूत प्लॉट तपशील पहा',
      'दररोज ५ पर्यंत मालमत्ता दृश्ये',
      'ईमेल सूचना',
      'मूलभूत शोध फिल्टर'
    ],
    goldFeatures: [
      'चांदीमधील सर्व काही',
      'पूर्ण प्लॉट तपशील पहा',
      'संपर्क माहिती प्रवेश',
      'दररोज २० पर्यंत मालमत्ता दृश्ये',
      'प्रगत शोध फिल्टर',
      'मालमत्ता जतन करा'
    ],
    premiumFeatures: [
      'सोन्यामधील सर्व काही',
      'अमर्यादित मालमत्ता दृश्ये',
      'प्राधान्य ग्राहक समर्थन',
      'किंमत कमी होण्याची सूचना',
      'व्हर्च्युअल टूर प्रवेश',
      'मालमत्ता तुलना साधने',
      'बाजारातील अंतर्दृष्टी'
    ],
    silverSellerFeatures: [
      '5 पर्यंत properties लिस्ट करा',
      'मूलभूत property management',
      '30-दिवस लिस्टिंग कालावधी',
      'मानक समर्थन'
    ],
    goldSellerFeatures: [
      'चांदीमधील सर्व काही',
      '20 पर्यंत properties लिस्ट करा',
      'प्रगत analytics',
      '90-दिवस लिस्टिंग कालावधी',
      'प्राधान्य समर्थन',
      'Featured listings'
    ],
    premiumSellerFeatures: [
      'सोन्यामधील सर्व काही',
      'अमर्यादित listings',
      'प्रीमियम analytics डॅशबोर्ड',
      '365-दिवस लिस्टिंग कालावधी',
      '24/7 dedicated समर्थन',
      'शोध निकालांमध्ये टॉप placement',
      'सानुकूल branding options'
    ]
  }
};

export const PackageSelection = ({ currentLang, userType = 'buyer', onSuccess }: PackageSelectionProps) => {
  const t = translations[currentLang];
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from query parameters or default to home
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/';

  const getFeatures = (packageType: string) => {
    if (userType === 'seller') {
      switch (packageType) {
        case 'silver': return t.silverSellerFeatures;
        case 'gold': return t.goldSellerFeatures;
        case 'premium': return t.premiumSellerFeatures;
        default: return t.silverSellerFeatures;
      }
    } else {
      switch (packageType) {
        case 'silver': return t.silverFeatures;
        case 'gold': return t.goldFeatures;
        case 'premium': return t.premiumFeatures;
        default: return t.silverFeatures;
      }
    }
  };

  const packages = [
    {
      id: 'silver',
      title: t.silverTitle,
      price: t.price,
      icon: Star,
      gradient: 'bg-gradient-to-r from-gray-300 to-gray-400',
      textColor: 'text-gray-800',
      features: getFeatures('silver'),
      badge: null
    },
    {
      id: 'gold',
      title: t.goldTitle,
      price: t.goldPrice,
      icon: Award,
      gradient: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      textColor: 'text-yellow-900',
      features: getFeatures('gold'),
      badge: t.popular
    },
    {
      id: 'premium',
      title: t.premiumTitle,
      price: t.premiumPrice,
      icon: Crown,
      gradient: 'bg-gradient-to-r from-purple-400 to-purple-600',
      textColor: 'text-purple-900',
      features: getFeatures('premium'),
      badge: t.recommended
    }
  ];

  const initiatePayment = async (amount: number, packageType: string) => {
    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error('Razorpay SDK failed to load.');
        return;
      }

      const orderData = await createPaymentOrderApi(amount, packageType, userType);

      const options = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Package Purchase",
        description: `${packageType} ${userType} subscription`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          try {
            const verifyData = await verifyPaymentApi(response, amount, packageType, userType);
            if (verifyData.success) {
              // Store package selection in localStorage
              localStorage.setItem("selectedPackage", packageType);
              localStorage.setItem("userType", userType);
              
              toast.success("Payment successful!");
              
              if (onSuccess) {
                onSuccess();
              } else {
                // Redirect to the intended path or listing details page
                navigate(redirectPath);
              }
            } else {
              toast.error("Payment verification failed!");
            }
          } catch (err: any) {
            toast.error(err.message);
          }
        },
        prefill: { 
          name: localStorage.getItem('userName') || "", 
          email: localStorage.getItem('userEmail') || "", 
          contact: localStorage.getItem('userPhone') || "" 
        },
        notes: { packageType, userType },
        theme: { color: "#6b46c1" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <section className="h-screen flex items-center justify-center bg-accent/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {userType === 'seller' ? 'Seller Packages' : 'Premium Packages'}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {userType === 'seller' ? t.sellerSubtitle : t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {packages.map((pkg) => {
            const IconComponent = pkg.icon;
            const isPopular = pkg.badge === t.popular;

            return (
              <Card
                key={pkg.id}
                className={`relative overflow-hidden flex flex-col h-full ${
                  isPopular
                    ? 'ring-2 ring-yellow-400 shadow-xl transform scale-105'
                    : 'hover:shadow-lg hover:-translate-y-1'
                } transition-all duration-300`}
              >
                {pkg.badge && (
                  <div className={`absolute top-0 right-0 ${pkg.gradient} ${pkg.textColor} px-3 py-1 text-xs font-medium`}>
                    {pkg.badge}
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <div className={`w-14 h-14 mx-auto rounded-full ${pkg.gradient} flex items-center justify-center mb-3`}>
                    <IconComponent className={`w-7 h-7 ${pkg.textColor}`} />
                  </div>
                  <CardTitle className="text-xl font-bold mb-1">{pkg.title}</CardTitle>
                  <div className="text-2xl font-bold text-primary">₹{pkg.price}/month</div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between space-y-3">
                  <ul className="space-y-2">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full mt-auto ${pkg.gradient} ${pkg.textColor} hover:opacity-90 font-medium`}
                    onClick={() => initiatePayment(pkg.price, pkg.id)}
                  >
                    {t.selectPlan}
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