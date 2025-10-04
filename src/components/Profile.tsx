import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, Camera, Save, X, Mail, Phone, ArrowLeft, Loader2 } from 'lucide-react';

interface ProfileProps {
  userRole: string;
  onLogout: () => void;
  currentLang: "en" | "mr";
  userId: string;
  onUpdateProfile: (name: string, email: string, phone: string, image: string) => void;
  userName: string;
  userEmail: string;
  userPhone: string;
  userImage: string;
  onClose?: () => void;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  image?: string;
}

const BASE_URL = "http://localhost:5000";

const Profile: React.FC<ProfileProps> = ({ 
  userRole, 
  onLogout, 
  currentLang, 
  userId, 
  onUpdateProfile,
  userName: propUserName,
  userEmail: propUserEmail,
  userPhone: propUserPhone,
  userImage: propUserImage,
  onClose 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData>({
    name: propUserName || '',
    email: propUserEmail || '',
    phone: propUserPhone || '',
    image: propUserImage || ''
  });
  const [originalData, setOriginalData] = useState<UserData>({
    name: propUserName || '',
    email: propUserEmail || '',
    phone: propUserPhone || '',
    image: propUserImage || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const t = {
    en: {
      title: "My Profile",
      personalInfo: "Personal Information",
      edit: "Edit Profile",
      save: "Save Changes",
      cancel: "Cancel",
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      role: "Account Type",
      buyer: "Buyer",
      seller: "Seller",
      updateSuccess: "Profile updated successfully",
      updateError: "Failed to update profile",
      changePhoto: "Change Photo",
      removePhoto: "Remove Photo",
      loading: "Loading...",
      saving: "Saving...",
      profileImage: "Profile Image",
      close: "Close",
      back: "Back",
      imageUploadSuccess: "Profile image uploaded successfully",
      imageUploadError: "Failed to upload image",
      imageTooLarge: "Image size should be less than 2MB",
      invalidImage: "Please select a valid image file"
    },
    mr: {
      title: "माझे प्रोफाइल",
      personalInfo: "वैयक्तिक माहिती",
      edit: "प्रोफाइल संपादित करा",
      save: "बदल जतन करा",
      cancel: "रद्द करा",
      name: "पूर्ण नाव",
      email: "ईमेल पत्ता",
      phone: "फोन नंबर",
      role: "खात्याचा प्रकार",
      buyer: "खरेदीदार",
      seller: "विक्रेता",
      updateSuccess: "प्रोफाइल यशस्वीरित्या अद्यतनित केले",
      updateError: "प्रोफाइल अद्यतनित करण्यात अयशस्वी",
      changePhoto: "फोटो बदला",
      removePhoto: "फोटो काढून टाका",
      loading: "लोड होत आहे...",
      saving: "जतन होत आहे...",
      profileImage: "प्रोफाइल फोटो",
      close: "बंद करा",
      back: "मागे",
      imageUploadSuccess: "प्रोफाइल फोटो यशस्वीरित्या अपलोड केला",
      imageUploadError: "फोटो अपलोड करण्यात अयशस्वी",
      imageTooLarge: "फोटोचा आकार 2MB पेक्षा कमी असावा",
      invalidImage: "कृपया एक वैध फोटो फाइल निवडा"
    }
  }[currentLang];

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        return;
      }

      console.log('🔄 Profile: Fetching profile data...');
      const response = await fetch(`${BASE_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Profile: API response received', data);
        
        if (data.status === 'success' && data.data.user) {
          const userDataFromAPI = data.data.user;
          console.log('✅ Profile: User data from API', { 
            name: userDataFromAPI.name,
            image: userDataFromAPI.image ? `Has image (${userDataFromAPI.image.substring(0, 50)}...)` : 'No image'
          });
          
          const finalData = {
            name: userDataFromAPI.name || '',
            email: userDataFromAPI.email || '',
            phone: userDataFromAPI.phone || '',
            image: userDataFromAPI.image || ''
          };

          setUserData(finalData);
          setOriginalData(finalData);
          
          // IMMEDIATELY update parent component with fresh data
          onUpdateProfile(
            finalData.name, 
            finalData.email, 
            finalData.phone, 
            finalData.image
          );
          
          console.log('✅ Profile: Parent component updated with new data');
        }
      } else {
        console.error('❌ Profile: Failed to fetch profile:', response.status);
        // Use props as fallback
        setUserData({
          name: propUserName || '',
          email: propUserEmail || '',
          phone: propUserPhone || '',
          image: propUserImage || ''
        });
      }
      
    } catch (error) {
      console.error('❌ Profile: Error fetching user data:', error);
      // Use props as fallback
      setUserData({
        name: propUserName || '',
        email: propUserEmail || '',
        phone: propUserPhone || '',
        image: propUserImage || ''
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    const newData = { ...userData, [field]: value };
    setUserData(newData);
    
    // Check if there are any changes compared to original data
    const newHasChanges = JSON.stringify(newData) !== JSON.stringify(originalData);
    setHasChanges(newHasChanges);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Selected file:', file.name, file.size, file.type);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: t.invalidImage,
        variant: "destructive"
      });
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: t.imageTooLarge,
        variant: "destructive"
      });
      return;
    }

    setIsImageLoading(true);
    
    try {
      // Convert image to Base64
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const imageBase64 = event.target?.result as string;
          console.log('Base64 image data length:', imageBase64.length);

          const token = localStorage.getItem('token');
          
          const response = await fetch(`${BASE_URL}/api/auth/profile/upload-image`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              imageBase64: imageBase64
            })
          });

          const data = await response.json();
          console.log('Upload response:', data);
          
          if (response.ok && data.status === 'success') {
            const newImageUrl = data.data.imageUrl;
            console.log('✅ Profile: New image URL from server:', newImageUrl);
            
            const newData = { ...userData, image: newImageUrl };
            setUserData(newData);
            setHasChanges(true);
            
            // IMMEDIATELY update parent component
            onUpdateProfile(userData.name, userData.email, userData.phone, newImageUrl);
            
            toast({
              title: t.imageUploadSuccess,
              description: currentLang === 'en' 
                ? "Your profile image has been updated" 
                : "तुमचा प्रोफाइल फोटो अद्यतनित केला गेला आहे"
            });

            // Force refresh user data from server
            await fetchUserData();
          } else {
            throw new Error(data.message || 'Upload failed');
          }
        } catch (error: any) {
          console.error('Image upload error:', error);
          toast({
            title: t.imageUploadError,
            description: error.message || (currentLang === 'en' 
              ? "Failed to upload image. Please try again." 
              : "फोटो अपलोड करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा."),
            variant: "destructive"
          });
        } finally {
          setIsImageLoading(false);
        }
      };

      reader.onerror = () => {
        console.error('File reading error');
        toast({
          title: "Error",
          description: "Failed to read image file",
          variant: "destructive"
        });
        setIsImageLoading(false);
      };

      reader.readAsDataURL(file); // Convert to base64

    } catch (error: any) {
      console.error('Image processing error:', error);
      toast({
        title: t.imageUploadError,
        description: error.message || "Failed to process image",
        variant: "destructive"
      });
      setIsImageLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/auth/profile/remove-image`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        const newData = { ...userData, image: '' };
        setUserData(newData);
        setHasChanges(true);
        
        // Update parent component
        onUpdateProfile(userData.name, userData.email, userData.phone, '');
        
        toast({
          title: currentLang === 'en' ? "Image Removed" : "फोटो काढून टाकला",
          description: currentLang === 'en' 
            ? "Profile image removed successfully" 
            : "प्रोफाइल फोटो यशस्वीरित्या काढून टाकला"
        });
      } else {
        throw new Error(data.message || 'Remove failed');
      }
    } catch (error: any) {
      console.error('Remove image error:', error);
      toast({
        title: "Error",
        description: error.message || (currentLang === 'en' 
          ? "Failed to remove image" 
          : "फोटो काढून टाकण्यात अयशस्वी"),
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    if (!hasChanges) {
      toast({
        title: currentLang === 'en' ? "No changes to save" : "जतन करण्यासाठी कोणतेही बदल नाहीत",
        description: currentLang === 'en' 
          ? "Make some changes before saving" 
          : "जतन करण्यापूर्वी काही बदल करा",
        variant: "default"
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone
        })
      });

      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        // Update original data and parent component
        setOriginalData(userData);
        onUpdateProfile(userData.name, userData.email, userData.phone, userData.image || '');
        
        setHasChanges(false);
        toast({
          title: t.updateSuccess,
          description: currentLang === 'en' 
            ? "Your profile has been updated successfully" 
            : "तुमचे प्रोफाइल यशस्वीरित्या अद्यतनित केले गेले आहे"
        });
      } else {
        throw new Error(data.message || 'Update failed');
      }
    } catch (error: any) {
      console.error('Update error:', error);
      toast({
        title: t.updateError,
        description: error.message || (currentLang === 'en' 
          ? "Failed to update profile. Please try again." 
          : "प्रोफाइल अद्यतनित करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा."),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setUserData(originalData);
    setHasChanges(false);
  };

  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm(
        currentLang === 'en' 
          ? "You have unsaved changes. Are you sure you want to leave?"
          : "तुमच्याकडे जतन न केलेले बदल आहेत. तुम्हाला खरोखर बाहेर पडायचे आहे?"
      )) {
        if (onClose) {
          onClose();
        } else {
          navigate(-1);
        }
      }
    } else {
      if (onClose) {
        onClose();
      } else {
        navigate(-1);
      }
    }
  };

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const getImageUrl = (imagePath: string) => {
    console.log('Getting image URL for:', imagePath ? 'Has image' : 'No image');
    
    if (!imagePath) {
      return '';
    }
    
    // If it's base64 data URL, return directly
    if (imagePath.startsWith('data:image')) {
      return imagePath;
    }
    
    // If it's a relative path (old method), construct URL
    if (imagePath.startsWith('/uploads')) {
      return `${BASE_URL}${imagePath}`;
    }
    
    // Return as is (could be base64 or other format)
    return imagePath;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 px-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full shadow-xl border-0 relative overflow-hidden">
          {/* Close Button - Desktop */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 hidden sm:flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 z-10"
            aria-label={t.close}
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>

          {/* Back Button - Mobile */}
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 flex sm:hidden items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 z-10"
            aria-label={t.back}
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>

          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg py-6 sm:py-8">
            <CardTitle className="text-2xl sm:text-3xl font-bold">{t.title}</CardTitle>
            <CardDescription className="text-blue-100">{t.personalInfo}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 sm:space-y-8 p-4 sm:p-8">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center space-y-4 sm:space-y-6">
              <div className="relative group">
                {isImageLoading ? (
                  <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-600" />
                  </div>
                ) : userData.image ? (
                  <img
                    src={getImageUrl(userData.image)}
                    alt="Profile"
                    className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover border-4 border-white shadow-2xl transition-all duration-300 group-hover:scale-105"
                    onError={(e) => {
                      console.error("Image failed to load:", userData.image);
                    }}
                  />
                ) : (
                  <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-3xl sm:text-5xl font-bold border-4 border-white shadow-2xl">
                    {getInitials(userData.name)}
                  </div>
                )}
                
                {/* Image editing options */}
                <div className="absolute -bottom-2 sm:bottom-2 -right-2 sm:right-2 flex space-x-1 sm:space-x-2">
                  <label className="bg-blue-600 text-white p-2 sm:p-3 rounded-full cursor-pointer hover:bg-blue-700 transition-all shadow-lg">
                    <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isImageLoading}
                    />
                  </label>
                  {userData.image && (
                    <button
                      onClick={handleRemoveImage}
                      className="bg-red-600 text-white p-2 sm:p-3 rounded-full hover:bg-red-700 transition-all shadow-lg"
                      disabled={isImageLoading}
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  )}
                </div>
              </div>
              
              <p className="text-xs sm:text-sm text-gray-600 text-center max-w-md px-2">
                {currentLang === 'en' 
                  ? "Click the camera icon to change your profile photo (Max 2MB)" 
                  : "तुमचा प्रोफाइल फोटो बदलण्यासाठी कॅमेरा आयकॉनवर क्लिक करा (जास्तीत जास्त 2MB)"}
              </p>
            </div>

            {/* Save/Cancel Buttons */}
            {hasChanges && (
              <div className="flex justify-end space-x-2 sm:space-x-3">
                <div className="flex space-x-2 sm:space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="px-4 sm:px-6 py-2 text-sm sm:text-base"
                    size="sm"
                  >
                    {t.cancel}
                  </Button>
                  <Button 
                    onClick={handleSave} 
                    disabled={isLoading || isImageLoading}
                    className="bg-green-600 hover:bg-green-700 px-4 sm:px-6 py-2 text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
                    size="sm"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {isLoading ? t.saving : t.save}
                  </Button>
                </div>
              </div>
            )}

            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 border-b pb-2">
                {t.personalInfo}
              </h3>
              
              {isLoading && !hasChanges ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Left Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center space-x-2 text-sm font-medium">
                        <User className="h-4 w-4" />
                        <span>{t.name}</span>
                      </Label>
                      <Input
                        id="name"
                        value={userData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="h-10 sm:h-11 text-sm sm:text-base"
                        placeholder={currentLang === 'en' ? "Enter your full name" : "तुमचे पूर्ण नाव प्रविष्ट करा"}
                      />
                    </div>
                    
                    {/* Email Address */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center space-x-2 text-sm font-medium">
                        <Mail className="h-4 w-4" />
                        <span>{t.email}</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={userData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="h-10 sm:h-11 text-sm sm:text-base"
                        placeholder={currentLang === 'en' ? "Enter your email address" : "तुमचा ईमेल पत्ता प्रविष्ट करा"}
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center space-x-2 text-sm font-medium">
                        <Phone className="h-4 w-4" />
                        <span>{t.phone}</span>
                      </Label>
                      <Input
                        id="phone"
                        value={userData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="h-10 sm:h-11 text-sm sm:text-base"
                        placeholder={currentLang === 'en' ? "Enter your phone number" : "तुमचा फोन नंबर प्रविष्ट करा"}
                      />
                    </div>
                    
                    {/* Account Type (Read-only) */}
                    <div className="space-y-2">
                      <Label htmlFor="role" className="flex items-center space-x-2 text-sm font-medium">
                        <User className="h-4 w-4" />
                        <span>{t.role}</span>
                      </Label>
                      <Input
                        id="role"
                        value={userRole === 'seller' ? t.seller : t.buyer}
                        disabled
                        className="h-10 sm:h-11 text-sm sm:text-base bg-gray-100 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {currentLang === 'en' 
                          ? "Account type cannot be changed from here"
                          : "खात्याचा प्रकार येथून बदलता येत नाही"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;