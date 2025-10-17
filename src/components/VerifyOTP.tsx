import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { verifyOtpApi, forgotPasswordApi } from "@/lib/api";

interface VerifyOTPProps {
  currentLang: "en" | "mr";
}

const VerifyOTP: React.FC<VerifyOTPProps> = ({ currentLang }) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (!storedEmail) {
      toast({
        title: "Error",
        description: "Session expired. Please request a new OTP.",
        variant: "destructive",
      });
      navigate("/forgot-password");
      return;
    }
    setEmail(storedEmail);
  }, [navigate, toast]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const t = {
    en: {
      title: "Verify OTP",
      description: "Enter the verification code sent to your email",
      otp: "Verification Code",
      otpPlaceholder: "Enter OTP",
      verify: "Verify OTP",
      verifying: "Verifying...",
      back: "Back",
      success: "Success",
      otpVerified: "OTP verified successfully!",
      error: "Error",
      otpRequired: "Please enter OTP.",
      invalidOtp: "Invalid OTP. Please try again.",
      somethingWentWrong: "Something went wrong. Please try again.",
      sessionExpired: "Session expired. Please request a new OTP.",
      resendOtp: "Resend OTP",
      resending: "Resending...",
      resendSuccess: "OTP resent successfully",
      waitCountdown: "Wait for {seconds} seconds before resending",
    },
    mr: {
      title: "OTP सत्यापित करा",
      description: "तुमच्या ईमेलवर पाठवलेला व्हेरिफिकेशन कोड प्रविष्ट करा",
      otp: "व्हेरिफिकेशन कोड",
      otpPlaceholder: "OTP प्रविष्ट करा",
      verify: "OTP सत्यापित करा",
      verifying: "सत्यापित करत आहे...",
      back: "मागे",
      success: "यश",
      otpVerified: "OTP यशस्वीरित्या सत्यापित केला!",
      error: "त्रुटी",
      otpRequired: "कृपया OTP प्रविष्ट करा.",
      invalidOtp: "अवैध OTP. कृपया पुन्हा प्रयत्न करा.",
      somethingWentWrong: "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.",
      sessionExpired: "सत्र कालबाह्य झाले. कृपया नवीन OTP मागवा.",
      resendOtp: "OTP पुन्हा पाठवा",
      resending: "पुन्हा पाठवत आहे...",
      resendSuccess: "OTP यशस्वीरित्या पुन्हा पाठवला",
      waitCountdown: "पुन्हा पाठवण्यापूर्वी {seconds} सेकंद थांबा",
    },
  }[currentLang];

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast({
        title: t.error,
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Verifyings OTP for:', email, 'OTP:', otp);
      const response = await verifyOtpApi(email, otp);
      console.log('Verify OTP Response:', response);

      if (response.status === 'success') {
        toast({
          title: t.success,
          description: t.otpVerified,
        });

        // Store reset token for password reset
        if (response.data?.resetToken) {
          localStorage.setItem("resetToken", response.data.resetToken);
          navigate("/reset-password");
        } else {
          throw new Error("Reset token not received");
        }
      } else {
        toast({
          title: t.error,
          description: response.message || t.invalidOtp,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: t.error,
        description: error.message || t.somethingWentWrong,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    try {
      const response = await forgotPasswordApi(email);
      
      if (response.status === 'success') {
        toast({
          title: t.success,
          description: t.resendSuccess,
        });
        
        // Start countdown (60 seconds)
        setCountdown(60);
        
        // Show OTP in development
        if (process.env.NODE_ENV === 'development' && response.data?.otp) {
          console.log('🔐 New OTP:', response.data.otp);
          toast({
            title: "New OTP (Development)",
            description: `Your new OTP is: ${response.data.otp}`,
          });
        }
      } else {
        toast({
          title: t.error,
          description: response.message || t.somethingWentWrong,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      toast({
        title: t.error,
        description: error.message || t.somethingWentWrong,
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
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
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.back}
          </Button>
          <CardTitle className="text-2xl font-bold text-center">{t.title}</CardTitle>
          <CardDescription className="text-center">
            {t.description}
          </CardDescription>
          {email && (
            <CardDescription className="text-center text-sm">
              Sent to: {email}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">{t.otp}</Label>
              <Input
                id="otp"
                type="text"
                placeholder={t.otpPlaceholder}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
                disabled={isLoading}
                className="text-center text-lg font-mono tracking-widest"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t.verifying : t.verify}
            </Button>
          </form>
          <div className="text-center mt-4">
            <Button 
              variant="link" 
              onClick={handleResendOTP}
              disabled={isResending || countdown > 0}
              className="text-sm"
            >
              {isResending ? t.resending : 
               countdown > 0 ? t.waitCountdown.replace('{seconds}', countdown.toString()) : 
               t.resendOtp}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOTP;