import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { resetPasswordApi } from "@/lib/api"; 

interface ResetPasswordProps {
  currentLang: "en" | "mr";
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ currentLang }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const t = {
    en: {
      title: "Reset Password",
      description: "Enter your new password",
      newPassword: "New Password",
      confirmPassword: "Confirm Password",
      passwordPlaceholder: "Enter new password",
      confirmPlaceholder: "Confirm new password",
      update: "Update Password",
      updating: "Updating...",
      back: "Back",
      success: "Success",
      passwordReset: "Password reset successfully. Please login with your new password.",
      error: "Error",
      sessionExpired: "Session expired. Please request a new password reset link.",
      passwordsNotMatch: "Passwords do not match.",
      passwordTooShort: "Password must be at least 6 characters long.",
      somethingWentWrong: "Something went wrong.",
    },
    mr: {
      title: "पासवर्ड रीसेट करा",
      description: "तुमचा नवीन पासवर्ड प्रविष्ट करा",
      newPassword: "नवीन पासवर्ड",
      confirmPassword: "पासवर्डची पुष्टी करा",
      passwordPlaceholder: "नवीन पासवर्ड प्रविष्ट करा",
      confirmPlaceholder: "नवीन पासवर्डची पुष्टी करा",
      update: "पासवर्ड अपडेट करा",
      updating: "अपडेट करत आहे...",
      back: "मागे",
      success: "यश",
      passwordReset: "पासवर्ड यशस्वीरित्या रीसेट केला. कृपया तुमच्या नवीन पासवर्डसह लॉगिन करा.",
      error: "त्रुटी",
      sessionExpired: "सत्र कालबाह्य झाले. कृपया नवीन पासवर्ड रीसेट लिंक मागवा.",
      passwordsNotMatch: "पासवर्ड जुळत नाहीत.",
      passwordTooShort: "पासवर्ड किमान ६ वर्णांचा असणे आवश्यक आहे.",
      somethingWentWrong: "काहीतरी चूक झाली.",
    },
  }[currentLang];

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const resetToken = localStorage.getItem("resetToken");
    const email = localStorage.getItem("resetEmail");

    if (!resetToken || !email) {
      toast({
        title: t.error,
        description: t.sessionExpired,
        variant: "destructive"
      });
      navigate("/forgot-password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: t.error,
        description: t.passwordsNotMatch,
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: t.error,
        description: t.passwordTooShort,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await resetPasswordApi(email, resetToken, newPassword);
      
      if (response.status === 'success') {
        toast({
          title: t.success,
          description: t.passwordReset,
        });
        
        // Clear stored data
        localStorage.removeItem("resetToken");
        localStorage.removeItem("resetEmail");
        
        navigate("/login");
      } else {
        toast({
          title: t.error,
          description: response.message || t.somethingWentWrong,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: t.error,
        description: error.message || t.somethingWentWrong,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit mb-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.back}
          </Button>
          <CardTitle className="text-2xl font-bold text-center">{t.title}</CardTitle>
          <CardDescription className="text-center">
            {t.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t.newPassword}</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder={t.passwordPlaceholder}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t.confirmPlaceholder}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? t.updating : t.update}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;