import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, TrendingUp, X } from "lucide-react";
import { validatePackage, type PackageValidation } from "@/lib/packageUtils";

interface PackageExpiryPopupProps {
  currentLang: "en" | "mr";
  onClose?: () => void;
  userType?: string;
}

const PackageExpiryPopup = ({ currentLang, onClose, userType }: PackageExpiryPopupProps) => {
  const navigate = useNavigate();
  const [validation, setValidation] = useState<PackageValidation | null>(null);
  const [show, setShow] = useState(false);

  const translations = {
    en: {
      expired: "Package Expired",
      expiredMessage: "Your package has expired. Please upgrade to continue.",
      limitReached: "Limit Reached",
      limitReachedMessage: "You've reached your property limit. Upgrade to add more properties.",
      nearExpiry: "Package Expiring Soon",
      nearExpiryMessage: (days: number) => `Your package expires in ${days} day${days > 1 ? 's' : ''}. Upgrade now to avoid interruption.`,
      limitNearReached: "Limit Almost Reached",
      limitNearReachedMessage: (remaining: number) => `You have only ${remaining} propert${remaining > 1 ? 'ies' : 'y'} left. Consider upgrading your package.`,
      upgradeNow: "Upgrade Now",
      remindLater: "Remind Me Later",
      close: "Close"
    },
    mr: {
      expired: "पॅकेज कालबाह्य झाले",
      expiredMessage: "तुमचे पॅकेज कालबाह्य झाले आहे. कृपया सुरू ठेवण्यासाठी अपग्रेड करा.",
      limitReached: "मर्यादा पोहोचली",
      limitReachedMessage: "तुम्ही तुमच्या मालमत्तेची मर्यादा गाठली आहे. अधिक मालमत्ता जोडण्यासाठी अपग्रेड करा.",
      nearExpiry: "पॅकेज लवकरच कालबाह्य होईल",
      nearExpiryMessage: (days: number) => `तुमचे पॅकेज ${days} दिवसांत कालबाह्य होईल. व्यत्यय टाळण्यासाठी आता अपग्रेड करा.`,
      limitNearReached: "मर्यादा जवळजवळ पोहोचली",
      limitNearReachedMessage: (remaining: number) => `तुमच्याकडे फक्त ${remaining} मालमत्ता शिल्लक आहेत. तुमचे पॅकेज अपग्रेड करण्याचा विचार करा.`,
      upgradeNow: "आता अपग्रेड करा",
      remindLater: "नंतर आठवण करा",
      close: "बंद करा"
    }
  };

  const t = translations[currentLang];

  useEffect(() => {
    // Check package validity
    const packageValidation = validatePackage(userType);
    setValidation(packageValidation);

    // Show popup if there are any warnings or package is invalid
    const shouldShow =
      !packageValidation.isValid ||
      packageValidation.warnings.nearExpiry ||
      packageValidation.warnings.limitNearReached;

    // Check if user has dismissed the warning today
    const lastDismissed = localStorage.getItem('packageWarningDismissed');
    const today = new Date().toDateString();

    if (shouldShow && lastDismissed !== today) {
      setShow(true);
    }
  }, [userType]);

  const handleUpgrade = () => {
    setShow(false);
    navigate('/packages');
  };

  const handleRemindLater = () => {
    // Store dismissal timestamp
    localStorage.setItem('packageWarningDismissed', new Date().toDateString());
    setShow(false);
    if (onClose) onClose();
  };

  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
  };

  if (!show || !validation) {
    return null;
  }

  // Determine which warning to show (priority order)
  let title = "";
  let message = "";
  let icon = <AlertCircle className="h-8 w-8 text-orange-500" />;
  let iconBg = "bg-orange-50";
  let isBlocking = false;

  if (validation.warnings.expired) {
    title = t.expired;
    message = t.expiredMessage;
    icon = <AlertCircle className="h-8 w-8 text-red-500" />;
    iconBg = "bg-red-50";
    isBlocking = true;
  } else if (validation.warnings.limitReached) {
    title = t.limitReached;
    message = t.limitReachedMessage;
    icon = <TrendingUp className="h-8 w-8 text-red-500" />;
    iconBg = "bg-red-50";
    isBlocking = true;
  } else if (validation.warnings.nearExpiry) {
    title = t.nearExpiry;
    message = t.nearExpiryMessage(validation.daysRemaining);
    icon = <Clock className="h-8 w-8 text-orange-500" />;
    iconBg = "bg-orange-50";
  } else if (validation.warnings.limitNearReached) {
    title = t.limitNearReached;
    message = t.limitNearReachedMessage(validation.remaining);
    icon = <TrendingUp className="h-8 w-8 text-orange-500" />;
    iconBg = "bg-orange-50";
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        {/* Popup */}
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full animate-in fade-in-0 zoom-in-95">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className={`${iconBg} p-3 rounded-full`}>
                {icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              </div>
            </div>
            {!isBlocking && (
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-700 text-base leading-relaxed">
              {message}
            </p>

            {/* Package details */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">
                  {currentLang === "en" ? "Days Remaining" : "उर्वरित दिवस"}
                </span>
                <span className={`font-semibold ${validation.daysRemaining <= 7 ? 'text-red-600' : 'text-gray-900'}`}>
                  {validation.daysRemaining}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {currentLang === "en" ? "Properties Remaining" : "उर्वरित मालमत्ता"}
                </span>
                <span className={`font-semibold ${validation.remaining <= 2 ? 'text-red-600' : 'text-gray-900'}`}>
                  {validation.remaining}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            {!isBlocking && (
              <Button
                variant="outline"
                onClick={handleRemindLater}
                className="border-gray-300"
              >
                {t.remindLater}
              </Button>
            )}
            <Button
              onClick={handleUpgrade}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {t.upgradeNow}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PackageExpiryPopup;
