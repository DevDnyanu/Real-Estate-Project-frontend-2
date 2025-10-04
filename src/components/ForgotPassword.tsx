import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { forgotPasswordApi } from "@/lib/api";

interface ForgotPasswordProps {
  currentLang: "en" | "mr";
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ currentLang }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const t = {
    en: {
      title: "Forgot Password",
      description: "Enter your email to receive a verification code",
      email: "Email",
      emailPlaceholder: "Enter your email",
      sendOtp: "Send OTP",
      sending: "Sending...",
      backToLogin: "Back to Login",
      back: "Back",
      success: "Success",
      otpSent: "If the email exists, a password reset OTP has been sent",
      error: "Error",
      emailRequired: "Please enter a valid email address.",
      somethingWentWrong: "Something went wrong, please try again.",
    },
    mr: {
      title: "पासवर्ड विसरलात",
      description: "व्हेरिफिकेशन कोड मिळविण्यासाठी तुमचा ईमेल प्रविष्ट करा",
      email: "ईमेल",
      emailPlaceholder: "तुमचा ईमेल प्रविष्ट करा",
      sendOtp: "OTP पाठवा",
      sending: "पाठवत आहे...",
      backToLogin: "लॉगिन वर परत जा",
      back: "मागे",
      success: "यश",
      otpSent: "ईमेल अस्तित्वात असल्यास, पासवर्ड रीसेट OTP पाठवला गेला आहे",
      error: "त्रुटी",
      emailRequired: "कृपया वैध ईमेल पत्ता प्रविष्ट करा.",
      somethingWentWrong: "काहीतरी चूक झाली, कृपया पुन्हा प्रयत्न करा.",
    },
  }[currentLang];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: t.error,
        description: t.emailRequired,
        variant: "destructive"
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: t.error,
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Sending forgot password request for:', email);
      const response = await forgotPasswordApi(email);
      console.log('API Response:', response);
      
      if (response.status === 'success') {
        // Show OTP to user for testing (only in development)
        if (process.env.NODE_ENV === 'development' && response.data?.otp) {
          toast({
            title: "OTP Generated (Development)",
            description: `Your OTP is: ${response.data.otp}`,
          });
          console.log('OTP received:', response.data.otp);
        }
        
        toast({
          title: t.success,
          description: response.message || t.otpSent,
        });
        
        // Store email for verification step
        localStorage.setItem("resetEmail", email);
        navigate("/verify-otp");
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
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? t.sending : t.sendOtp}
            </Button>
          </form>
          <div className="text-center mt-4">
            <Button 
              variant="link" 
              onClick={() => navigate("/login")}
              disabled={isLoading}
            >
              {t.backToLogin}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;