import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ArrowLeft, UserCheck, Store } from 'lucide-react';
import { signupApi } from '@/lib/api';

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

interface SignUpPageProps {
  onLogin: (token: string, role: string, userId: string, name: string, image?: string) => void;
  currentLang: 'en' | 'mr';
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onLogin, currentLang }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(
    searchParams.get('role') || 'buyer'
  );
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const translations = {
    en: {
      title: "Create Account",
      buyer: "Buyer",
      seller: "Seller",
      fullName: "Full Name",
      email: "Email",
      phone: "Phone Number",
      password: "Password",
      confirmPassword: "Confirm Password",
      namePlaceholder: "Enter your full name",
      emailPlaceholder: "Enter your email",
      phonePlaceholder: "Enter your 10-digit phone number",
      passwordPlaceholder: "Enter at least 8 characters",
      confirmPasswordPlaceholder: "Confirm your password",
      signUp: "Sign Up",
      creatingAccount: "Creating Account...",
      signUpAs: "Sign Up as",
      alreadyAccount: "Already have an account?",
      login: "Login",
      back: "Back",
      success: "Success",
      accountCreated: "Account created successfully! Please log in.",
      validationError: "Validation Error",
      fixErrors: "Please fix the errors in the form",
      signupFailed: "Signup Failed",
      failedCreate: "Failed to create account",
      nameRequired: "Name is required",
      emailRequired: "Email is required",
      invalidEmail: "Please enter a valid email address",
      phoneRequired: "Phone number is required",
      invalidPhone: "Phone number must be exactly 10 digits",
      passwordRequired: "Password is required",
      passwordLength: "Password must be at least 8 characters long",
      confirmRequired: "Please confirm your password",
      passwordMismatch: "Passwords do not match",
      networkError: "Network error. Please try again."
    },
    mr: {
      title: "खाते तयार करा",
      buyer: "खरेदीदार",
      seller: "विक्रेता",
      fullName: "पूर्ण नाव",
      email: "ईमेल",
      phone: "फोन नंबर",
      password: "पासवर्ड",
      confirmPassword: "पासवर्ड निश्चित करा",
      namePlaceholder: "तुमचे पूर्ण नाव प्रविष्ट करा",
      emailPlaceholder: "तुमचा ईमेल प्रविष्ट करा",
      phonePlaceholder: "तुमचा 10-अंकी फोन नंबर प्रविष्ट करा",
      passwordPlaceholder: "किमान 8 वर्ण प्रविष्ट करा",
      confirmPasswordPlaceholder: "तुमचा पासवर्ड निश्चित करा",
      signUp: "साइन अप",
      creatingAccount: "खाते तयार होत आहे...",
      signUpAs: "याप्रमाणे साइन अप करा",
      alreadyAccount: "आधीपासूनच खाते आहे?",
      login: "लॉगिन",
      back: "मागे",
      success: "यश",
      accountCreated: "खाते यशस्वीरित्या तयार केले! कृपया लॉगिन करा.",
      validationError: "प्रमाणीकरण त्रुटी",
      fixErrors: "कृपया फॉर्ममधील त्रुटी दुरुस्त करा",
      signupFailed: "साइनअप अयशस्वी",
      failedCreate: "खाते तयार करण्यात अयशस्वी",
      nameRequired: "नाव आवश्यक आहे",
      emailRequired: "ईमेल आवश्यक आहे",
      invalidEmail: "कृपया वैध ईमेल पत्ता प्रविष्ट करा",
      phoneRequired: "फोन नंबर आवश्यक आहे",
      invalidPhone: "फोन नंबर नक्की 10 अंकी असणे आवश्यक आहे",
      passwordRequired: "पासवर्ड आवश्यक आहे",
      passwordLength: "पासवर्ड किमान 8 वर्णांचा असणे आवश्यक आहे",
      confirmRequired: "कृपया तुमचा पासवर्ड निश्चित करा",
      passwordMismatch: "पासवर्ड जुळत नाहीत",
      networkError: "नेटवर्क त्रुटी. कृपया पुन्हा प्रयत्न करा."
    }
  };

  const t = translations[currentLang];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t.nameRequired;
    }

    if (!formData.email) {
      newErrors.email = t.emailRequired;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t.invalidEmail;
    }

    if (!formData.phone) {
      newErrors.phone = t.phoneRequired;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = t.invalidPhone;
    }

    if (!formData.password) {
      newErrors.password = t.passwordRequired;
    } else if (!validatePassword(formData.password)) {
      newErrors.password = t.passwordLength;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t.confirmRequired;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.passwordMismatch;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: activeTab
      };

      const response = await signupApi(userData);
      console.log("Signup API Response:", response);
      
      if (response.status === 'success') {
        toast({
          title: t.success,
          description: t.accountCreated,
        });
        
        // Redirect to login page with success message and pre-filled email
        navigate(`/login?signup=success&email=${encodeURIComponent(formData.email)}&role=${activeTab}`);
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      
      let errorMessage = error.message || t.failedCreate;
      if (error.message.includes('Network') || error.message.includes('fetch')) {
        errorMessage = t.networkError;
      }
      
      if (error.errors) {
        const backendErrors: FormErrors = {};
        Object.keys(error.errors).forEach(key => {
          backendErrors[key as keyof FormErrors] = error.errors[key];
        });
        setErrors(backendErrors);
        
        toast({
          title: t.validationError,
          description: t.fixErrors,
          variant: "destructive"
        });
      } else {
        toast({
          title: t.signupFailed,
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 px-4 pt-4 pb-8">
      <Card className="w-full max-w-md shadow-lg relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 left-3 z-10 h-8 px-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-3 w-3 mr-1" />
          {t.back}
        </Button>

        <CardHeader className="text-center pt-8 pb-3">
          <CardTitle className="text-xl font-semibold">{t.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="px-5 pb-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-5">
            <TabsList className="grid w-full grid-cols-2 h-9">
              <TabsTrigger value="buyer" className="flex items-center space-x-2 text-sm">
                <UserCheck className="h-4 w-4" />
                <span>{t.buyer}</span>
              </TabsTrigger>
              <TabsTrigger value="seller" className="flex items-center space-x-2 text-sm">
                <Store className="h-4 w-4" />
                <span>{t.seller}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">
                  {t.fullName}
                </Label>
                <div className="flex-1">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={t.namePlaceholder}
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'border-red-500 h-9 text-sm' : 'h-9 text-sm'}
                  />
                </div>
              </div>
              {errors.name && <p className="text-red-500 text-xs ml-32">{errors.name}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">
                  {t.email}
                </Label>
                <div className="flex-1">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'border-red-500 h-9 text-sm' : 'h-9 text-sm'}
                  />
                </div>
              </div>
              {errors.email && <p className="text-red-500 text-xs ml-32">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">
                  {t.phone}
                </Label>
                <div className="flex-1">
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder={t.phonePlaceholder}
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'border-red-500 h-9 text-sm' : 'h-9 text-sm'}
                  />
                </div>
              </div>
              {errors.phone && <p className="text-red-500 text-xs ml-32">{errors.phone}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">
                  {t.password}
                </Label>
                <div className="flex-1 relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t.passwordPlaceholder}
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'border-red-500 pr-10 h-9 text-sm' : 'pr-10 h-9 text-sm'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {errors.password && <p className="text-red-500 text-xs ml-32">{errors.password}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">
                  {t.confirmPassword}
                </Label>
                <div className="flex-1 relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t.confirmPasswordPlaceholder}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'border-red-500 pr-10 h-9 text-sm' : 'pr-10 h-9 text-sm'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs ml-32">{errors.confirmPassword}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full mt-5 h-10 text-sm font-medium bg-blue-600 hover:bg-blue-700" 
              disabled={isLoading}
            >
              {isLoading ? t.creatingAccount : `${t.signUpAs} ${activeTab === 'buyer' ? t.buyer : t.seller}`}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-1 px-5 pb-4">
          <p className="text-sm text-gray-600 text-center">
            {t.alreadyAccount}{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              {t.login}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;