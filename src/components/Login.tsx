import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { UserCheck, Store, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { loginApi } from "@/lib/api";

interface LoginProps {
  onLogin: (token: string, role: string, userId: string, name: string, image?: string) => void;
  currentLang: "en" | "mr";
}

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

type UserRole = "buyer" | "seller";
const isUserRole = (v: string): v is UserRole => v === "buyer" || v === "seller";

const Login: React.FC<LoginProps> = ({ onLogin, currentLang }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const t = {
    en: {
      title: "Welcome Back",
      signupSuccessTitle: "Account Created Successfully",
      signupSuccessDescription: "Please log in with your email and password",
      description: "Sign in to your account to continue",
      buyer: "Buyer",
      seller: "Seller",
      email: "Email",
      password: "Password",
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "Enter your password",
      loginBuyer: "Login as Buyer",
      loginSeller: "Login as Seller",
      signingIn: "Signing in...",
      forgotPassword: "Forgot Password?",
      newUser: "New user?",
      signup: "Sign up",
      back: "Back",
      success: "Success",
      welcome: "Welcome! Logged in as",
      loginFailed: "Login Failed",
      invalidCredentials: "Invalid email or password",
      emailRequired: "Email is required",
      invalidEmail: "Please enter a valid email address",
      passwordRequired: "Password is required",
      passwordLength: "Password must be at least 6 characters long",
      networkError: "Network error. Please try again.",
    },
    mr: {
      title: "पुन्हा स्वागत आहे",
      signupSuccessTitle: "खाते यशस्वीरित्या तयार केले",
      signupSuccessDescription: "कृपया तुमचा ईमेल आणि पासवर्ड वापरून लॉगिन करा",
      description: "सुरू ठेवण्यासाठी तुमच्या खात्यात साइन इन करा",
      buyer: "खरेदीदार",
      seller: "विक्रेता",
      email: "ईमेल",
      password: "पासवर्ड",
      emailPlaceholder: "तुमचा ईमेल प्रविष्ट करा",
      passwordPlaceholder: "तुमचा पासवर्ड प्रविष्ट करा",
      loginBuyer: "खरेदीदार म्हणून लॉगिन करा",
      loginSeller: "विक्रेता म्हणून लॉगिन करा",
      signingIn: "साइन इन करत आहे...",
      forgotPassword: "पासवर्ड विसरलात?",
      newUser: "नवीन वापरकर्ता?",
      signup: "साइन अप",
      back: "मागे",
      success: "यश",
      welcome: "स्वागत आहे! याप्रमाणे लॉगिन केले",
      loginFailed: "लॉगिन अयशस्वी",
      invalidCredentials: "अवैध ईमेल किंवा पासवर्ड",
      emailRequired: "ईमेल आवश्यक आहे",
      invalidEmail: "कृपया वैध ईमेल पत्ता प्रविष्ट करा",
      passwordRequired: "पासवर्ड आवश्यक आहे",
      passwordLength: "पासवर्ड किमान ६ वर्णांचा असणे आवश्यक आहे",
      networkError: "नेटवर्क त्रुटी. कृपया पुन्हा प्रयत्न करा.",
    },
  }[currentLang];

  const signupSuccess = searchParams.get("signup") === "success";
  const preFilledEmail = searchParams.get("email") || "";
  const preFilledRole = searchParams.get("role") as UserRole || "buyer";

  const [formData, setFormData] = useState<FormData>({ 
    email: preFilledEmail, 
    password: "" 
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole>(preFilledRole);

  useEffect(() => {
    if (signupSuccess) {
      toast({ 
        title: t.signupSuccessTitle, 
        description: t.signupSuccessDescription 
      });
    }
  }, [signupSuccess, toast, t.signupSuccessTitle, t.signupSuccessDescription]);

  // Auto-fill email when role changes from URL params
  useEffect(() => {
    if (preFilledEmail) {
      setFormData(prev => ({ ...prev, email: preFilledEmail }));
    }
    if (preFilledRole && isUserRole(preFilledRole)) {
      setActiveRole(preFilledRole);
    }
  }, [preFilledEmail, preFilledRole]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email) newErrors.email = t.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = t.invalidEmail;
    if (!formData.password) newErrors.password = t.passwordRequired;
    else if (formData.password.length < 6) newErrors.password = t.passwordLength;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, role: UserRole) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsLoading(true);
  try {
    console.log('🔄 Login attempt:', { 
      email: formData.email, 
      role: role 
    });
    
    const res = await loginApi(formData.email, formData.password, role);
    console.log("✅ Login API Response:", res);
    
    if (res.status === 'success') {
      console.log('🎉 Login successful, user data:', res.data.user);
      
      // ✅ Call onLogin - App.tsx will handle navigation
      onLogin(
        res.token!, 
        res.data.user.role, 
        res.data.user.id,
        res.data.user.name,
        res.data.user.image || '' 
      );
      
      // ❌ REMOVE THESE LINES - App.tsx handleLogin already navigates
      // const redirectPath = res.data.user.role === "seller" ? "/seller-dashboard" : "/";
      // console.log('📍 Redirecting to:', redirectPath);
      // navigate(redirectPath);
    }
  } catch (err: any) {
    console.error("❌ Login error:", err);
    
    let errorMessage = t.invalidCredentials;
    if (err.message.includes('role')) {
      errorMessage = err.message;
    } else if (err.message.includes('Network') || err.message.includes('fetch')) {
      errorMessage = t.networkError;
    }
    
    toast({
      title: t.loginFailed,
      description: errorMessage,
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 px-4 py-6">
      <Card className="w-full max-w-md mx-auto shadow-card relative pt-12 pb-8">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 left-3"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t.back}
        </Button>

        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl font-bold">
            {signupSuccess ? t.signupSuccessTitle : t.title}
          </CardTitle>
          <CardDescription className="text-sm mt-1">
            {signupSuccess ? t.signupSuccessDescription : t.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-5 pb-3">
          <Tabs value={activeRole} onValueChange={(v) => isUserRole(v) && setActiveRole(v)}>
            <TabsList className="grid w-full grid-cols-2 mb-3">
              <TabsTrigger value="buyer">
                <UserCheck className="h-4 w-4 mr-1" /> {t.buyer}
              </TabsTrigger>
              <TabsTrigger value="seller">
                <Store className="h-4 w-4 mr-1" /> {t.seller}
              </TabsTrigger>
            </TabsList>

            {(["buyer", "seller"] as UserRole[]).map((role) => (
              <TabsContent key={role} value={role}>
                <form onSubmit={(e) => handleSubmit(e, role)} className="space-y-3">
                  <div>
                    <Label htmlFor={`${role}-email`}>{t.email}</Label>
                    <Input
                      id={`${role}-email`}
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))
                      }
                      placeholder={t.emailPlaceholder}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor={`${role}-password`}>{t.password}</Label>
                    <div className="relative">
                      <Input
                        id={`${role}-password`}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))
                        }
                        placeholder={t.passwordPlaceholder}
                        className={errors.password ? "border-destructive pr-10" : "pr-10"}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-destructive text-xs">{errors.password}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading
                      ? t.signingIn
                      : role === "buyer"
                      ? t.loginBuyer
                      : t.loginSeller}
                  </Button>
                </form>
              </TabsContent>
            ))}
          </Tabs>

          <div className="text-center mt-2">
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              {t.forgotPassword}
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-xs">
            {t.newUser}{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              {t.signup}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;