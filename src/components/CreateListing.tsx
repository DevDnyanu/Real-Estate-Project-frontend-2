// import { useState, useRef, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useToast } from '@/hooks/use-toast';
// import { useNavigate } from 'react-router-dom';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { 
//   MapPin, 
//   FileText, 
//   Upload,
//   Ruler,
//   X,
//   Edit3,
//   ImageIcon,
//   AlertCircle,
//   VideoIcon,
//   IndianRupee,
//   ChevronDown
// } from 'lucide-react';
// import { createListingApi, uploadImagesApi, uploadVideoApi } from '@/lib/api';
// import { PackageSelection } from '@/components/PackageSelection';

// // Define the form data interface for TypeScript
// interface FormData {
//   name: string;
//   description: string;
//   address: string;
//   type: string;
//   plotType: string;
//   plotSubType: string;
//   plotSize: number;
//   plotSizeUnit: string;
//   pricePerUnit: number;
//   priceUnit: string;
//   totalPrice: number;
//   userRef: string;
// }

// interface CreateListingProps {
//   currentLang: 'en' | 'mr'; // Add language prop
// }

// const CreateListing = ({ currentLang = 'en' }: CreateListingProps) => {
//   const [files, setFiles] = useState<File[]>([]);
//   const [videoFile, setVideoFile] = useState<File | null>(null);
//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     description: '',
//     address: '',
//     type: 'sale', // Set default to sale
//     plotType: '',
//     plotSubType: '',
//     plotSize: 0,
//     plotSizeUnit: 'acre',
//     pricePerUnit: 0,
//     priceUnit: 'perAcre',
//     totalPrice: 0,
//     userRef: localStorage.getItem('userId') || 'public',
//   });

//   const [errors, setErrors] = useState({
//     name: '',
//     description: '',
//     address: '',
//     type: '',
//     plotType: '',
//     plotSubType: '',
//     plotSize: '',
//     pricePerUnit: '',
//     totalPrice: '',
//     images: '',
//     video: ''
//   });

//   const [imageUploadError, setImageUploadError] = useState('');
//   const [videoUploadError, setVideoUploadError] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const [uploadingVideo, setUploadingVideo] = useState(false);
//   const [submitError, setSubmitError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [listingId, setListingId] = useState<string | null>(null);
//   const [textDataSubmitted, setTextDataSubmitted] = useState(false);
//   const [hasSellerPackage, setHasSellerPackage] = useState(false);
//   const [checkingPackage, setCheckingPackage] = useState(true);
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const imageInputRef = useRef<HTMLInputElement>(null);
//   const videoInputRef = useRef<HTMLInputElement>(null);

//   // Check if user has seller package on component mount
//   useEffect(() => {
//     checkSellerPackage();
//   }, []);

//   const checkSellerPackage = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setCheckingPackage(false);
//         return;
//       }

//       const response = await fetch('/api/user/seller-package', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         setHasSellerPackage(data.hasPackage);
//       }
//     } catch (error) {
//       console.error('Error checking seller package:', error);
//     } finally {
//       setCheckingPackage(false);
//     }
//   };

//   // Enhanced translations with all form field placeholders
//   const translations = {
//     en: {
//       header: "Fill in the details to create your plot listing",
//       plotName: "Plot Name",
//       plotDetails: "Plot Details",
//       plotType: "Plot Type",
//       plotSubType: "Plot Sub-Type",
//       plotSize: "Plot Size",
//       plotSizeUnit: "Unit",
//       pricePerUnit: "Expected Price",
//       priceUnit: "Price Unit",
//       totalPrice: "Total Price (₹)",
//       address: "Address",
//       description: "Description",
//       createPlotListing: "Create Plot Listing",
//       creating: "Creating...",
//       uploadPlotMedia: "Upload Plot Media",
//       selectImages: "Select Images (Maximum 6)",
//       selectVideo: "Select Video (Optional)",
//       uploadUpTo: "Upload up to 6 images of your plot (each under 5MB). Click edit button to replace individual images.",
//       uploadVideoDesc: "Upload a video tour of your plot (under 50MB).",
//       selectedImages: "Selected Images Preview",
//       selectedVideo: "Selected Video Preview",
//       addMore: "Add More",
//       remaining: "remaining",
//       uploadMedia: "Upload Media",
//       uploadingImages: "Uploading Images...",
//       uploadingVideo: "Uploading Video...",
//       skip: "Skip for Now",
//       success: "Success",
//       plotCreated: "Plot listing created successfully! Please upload media.",
//       imagesUploaded: "Images uploaded successfully!",
//       videoUploaded: "Video uploaded successfully!",
//       error: "Error",
//       pleaseFixErrors: "Please fix the errors in the form",
//       somethingWentWrong: "Something went wrong. Please try again.",
//       failedUploadImages: "Failed to upload images",
//       failedUploadVideo: "Failed to upload video",
//       pleaseSelectImage: "Please select at least one image",
//       pleaseUploadMedia: "Please upload at least one image or video",
//       plotTypeOptions: {
//         agriculture: "Agriculture Plot",
//         nonAgriculture: "Non-Agricultural Plot",
//         mountain: "Mountain Plot"
//       },
//       plotSubTypes: {
//         land: "Land",
//         vegetable: "Vegetable Plot",
//         fruit: "Fruit Plot",
//         sugarcane: "Sugarcane",
//         banana: "Banana",
//         grapes: "Grapes",
//         na: "NA",
//         gunta: "Gunta",
//         top: "Top",
//         bottom: "Bottom",
//         tilt: "Tilt"
//       },
//       sizeUnits: {
//         acre: "Acre",
//         guntha: "Guntha",
//         hectare: "Hectare"
//       },
//       priceUnits: {
//         perAcre: "Per Acre",
//         perGuntha: "Per Guntha",
//         perSqft: "Per Sq. Ft.",
//         perKilo: "Per Kilo"
//       },
//       validation: {
//         plotNameRequired: "Plot name is required",
//         nameMinLength: "Name must be at least 10 characters",
//         nameMaxLength: "Name cannot exceed 62 characters",
//         nameLettersOnly: "Name can only contain letters and spaces",
//         addressRequired: "Address is required",
//         addressMinLength: "Please enter a complete address",
//         addressValid: "Please enter a valid address",
//         descriptionRequired: "Description is required",
//         descriptionMinLength: "Description must be at least 10 characters",
//         plotTypeRequired: "Please select a plot type",
//         plotSubTypeRequired: "Please select a plot sub-type",
//         plotSizeNumber: "Plot size must be a number",
//         plotSizeMin: "Plot size cannot be less than 0.01",
//         plotSizeMax: "Plot size cannot be more than 1000",
//         priceNumber: "Price per unit must be a number",
//         priceMin: "Price cannot be less than ₹1,000",
//         priceMax: "Price cannot exceed ₹10,00,000",
//         totalPriceNumber: "Total price must be a number",
//         totalPriceMin: "Price cannot be less than ₹1,00,000",
//         totalPriceMax: "Price cannot exceed ₹5,00,00,000",
//         imagesRequired: "Please upload at least one image",
//         imagesMax: "You can upload a maximum of 6 images",
//         imagesType: "Only image files are allowed",
//         imagesSize: "Each image should be less than 5MB",
//         videoType: "Only video files are allowed",
//         videoSize: "Video should be less than 50MB"
//       },
//       placeholders: {
//         plotName: "Enter plot name (letters only)",
//         address: "Enter complete address",
//         description: "Describe your plot in detail (minimum 10 characters)...",
//         selectPlotType: "Select Plot Type",
//         selectSubType: "Select Sub-Type",
//         selectSizeUnit: "Select Unit",
//         selectPriceUnit: "Select Unit"
//       }
//     },
//     mr: {
//       header: "तुमची प्लॉट लिस्टिंग तयार करण्यासाठी तपशील भरा",
//       plotName: "प्लॉटचे नाव",
//       plotDetails: "प्लॉट तपशील",
//       plotType: "प्लॉट प्रकार",
//       plotSubType: "प्लॉट उप-प्रकार",
//       plotSize: "प्लॉट आकार",
//       plotSizeUnit: "युनिट",
//       pricePerUnit: "अपेक्षित किंमत",
//       priceUnit: "किंमत युनिट",
//       totalPrice: "एकूण किंमत (₹)",
//       address: "पत्ता",
//       description: "वर्णन",
//       createPlotListing: "प्लॉट लिस्टिंग तयार करा",
//       creating: "तयार करत आहे...",
//       uploadPlotMedia: "प्लॉट मीडिया अपलोड करा",
//       selectImages: "प्रतिमा निवडा (जास्तीत जास्त ६)",
//       selectVideo: "व्हिडिओ निवडा (पर्यायी)",
//       uploadUpTo: "तुमच्या प्लॉटच्या ६ प्रतिमा अपलोड करा (प्रत्येक 5MB पेक्षा कमी). वैयक्तिक प्रतिमा बदलण्यासाठी संपादन बटणावर क्लिक करा.",
//       uploadVideoDesc: "तुमच्या प्लॉटचा व्हिडिओ टूर अपलोड करा (50MB पेक्षा कमी).",
//       selectedImages: "निवडलेल्या प्रतिमांचे पूर्वावलोकन",
//       selectedVideo: "निवडलेल्या व्हिडिओचे पूर्वावलोकन",
//       addMore: "अजून जोडा",
//       remaining: "शिल्लक",
//       uploadMedia: "मीडिया अपलोड करा",
//       uploadingImages: "प्रतिमा अपलोड करत आहे...",
//       uploadingVideo: "व्हिडिओ अपलोड करत आहे...",
//       skip: "आत्तासाठी वगळा",
//       success: "यश",
//       plotCreated: "प्लॉट लिस्टिंग यशस्वीरित्या तयार झाली! कृपया मीडिया अपलोड करा.",
//       imagesUploaded: "प्रतिमा यशस्वीरित्या अपलोड झाल्या!",
//       videoUploaded: "व्हिडिओ यशस्वीरित्या अपलोड झाला!",
//       error: "त्रुटी",
//       pleaseFixErrors: "कृपया फॉर्ममधील त्रुटी दुरुस्त करा",
//       somethingWentWrong: "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.",
//       failedUploadImages: "प्रतिमा अपलोड करण्यात अयशस्वी",
//       failedUploadVideo: "व्हिडिओ अपलोड करण्यात अयशस्वी",
//       pleaseSelectImage: "कृपया किमान एक प्रतिमा निवडा",
//       pleaseUploadMedia: "कृपया किमान एक प्रतिमा किंवा व्हिडिओ अपलोड करा",
//       plotTypeOptions: {
//         agriculture: "शेती जमीन",
//         nonAgriculture: "नॉन-एग्रीकल्चर जमीन",
//         mountain: "डोंगराळ जमीन"
//       },
//       plotSubTypes: {
//         land: "जमीन",
//         vegetable: "भाजीपाला जमीन",
//         fruit: "फळबागा जमीन",
//         sugarcane: "ऊस",
//         banana: "केळी",
//         grapes: "द्राक्षे",
//         na: "एनए",
//         gunta: "गुंटा",
//         top: "वरचा भाग",
//         bottom: "खालचा भाग",
//         tilt: "झुकणारा"
//       },
//       sizeUnits: {
//         acre: "एकर",
//         guntha: "गुंठा",
//         hectare: "हेक्टर"
//       },
//       priceUnits: {
//         perAcre: "प्रति एकर",
//         perGuntha: "प्रति गुंठा",
//         perSqft: "प्रति चौ. फुट",
//         perKilo: "प्रति किलो"
//       },
//       validation: {
//         plotNameRequired: "प्लॉटचे नाव आवश्यक आहे",
//         nameMinLength: "नाव किमान १० वर्णांचे असणे आवश्यक आहे",
//         nameMaxLength: "नाव ६२ वर्णांपेक्षा जास्त असू शकत नाही",
//         nameLettersOnly: "नावात फक्त अक्षरे आणि स्पेस असू शकतात",
//         addressRequired: "पत्ता आवश्यक आहे",
//         addressMinLength: "कृपया संपूर्ण पत्ता प्रविष्ट करा",
//         addressValid: "कृपया वैध पत्ता प्रविष्ट करा",
//         descriptionRequired: "वर्णन आवश्यक आहे",
//         descriptionMinLength: "वर्णन किमान १० वर्णांचे असणे आवश्यक आहे",
//         plotTypeRequired: "कृपया प्लॉट प्रकार निवडा",
//         plotSubTypeRequired: "कृपया प्लॉट उप-प्रकार निवडा",
//         plotSizeNumber: "प्लॉट आकार संख्यात्मक असणे आवश्यक आहे",
//         plotSizeMin: "प्लॉट आकार ०.०१ पेक्षा कमी असू शकत नाही",
//         plotSizeMax: "प्लॉट आकार १००० पेक्षा जास्त असू शकत नाही",
//         priceNumber: "प्रति युनिट किंमत संख्यात्मक असणे आवश्यक आहे",
//         priceMin: "किंमत ₹१,००० पेक्षा कमी असू शकत नाही",
//         priceMax: "किंमत ₹१०,००,००० पेक्षा जास्त असू शकत नाही",
//         totalPriceNumber: "एकूण किंमत संख्यात्मक असणे आवश्यक आहे",
//         totalPriceMin: "किंमत ₹१,००,००० पेक्षा कमी असू शकत नाही",
//         totalPriceMax: "किंमत ₹५,००,००,००० पेक्षा जास्त असू शकत नाही",
//         imagesRequired: "कृपया किमान एक प्रतिमा अपलोड करा",
//         imagesMax: "तुम्ही जास्तीत जास्त ६ प्रतिमा अपलोड करू शकता",
//         imagesType: "फक्त प्रतिमा फाइल्स परवानगी आहेत",
//         imagesSize: "प्रत्येक प्रतिमा 5MB पेक्षा कमी असावी",
//         videoType: "फक्त व्हिडिओ फाइल्स परवानगी आहेत",
//         videoSize: "व्हिडिओ 50MB पेक्षा कमी असावा"
//       },
//       placeholders: {
//         plotName: "प्लॉटचे नाव प्रविष्ट करा (फक्त अक्षरे)",
//         address: "संपूर्ण पत्ता प्रविष्ट करा",
//         description: "तुमच्या प्लॉटचे तपशीलवार वर्णन करा (किमान १० वर्ण)...",
//         selectPlotType: "प्लॉट प्रकार निवडा",
//         selectSubType: "उप-प्रकार निवडा",
//         selectSizeUnit: "युनिट निवडा",
//         selectPriceUnit: "युनिट निवडा"
//       }
//     }
//   };

//   const t = translations[currentLang];

//   // Plot type options
//   const plotTypes = [
//     { 
//       id: 'agriculture', 
//       label: t.plotTypeOptions.agriculture,
//       subTypes: [
//         { id: 'land', label: t.plotSubTypes.land },
//         { id: 'vegetable', label: t.plotSubTypes.vegetable },
//         { id: 'fruit', label: t.plotSubTypes.fruit },
//         { id: 'sugarcane', label: t.plotSubTypes.sugarcane },
//         { id: 'banana', label: t.plotSubTypes.banana },
//         { id: 'grapes', label: t.plotSubTypes.grapes }
//       ]
//     },
//     { 
//       id: 'non-agriculture', 
//       label: t.plotTypeOptions.nonAgriculture,
//       subTypes: [
//         { id: 'na', label: t.plotSubTypes.na },
//         { id: 'gunta', label: t.plotSubTypes.gunta }
//       ]
//     },
//     { 
//       id: 'mountain', 
//       label: t.plotTypeOptions.mountain,
//       subTypes: [
//         { id: 'top', label: t.plotSubTypes.top },
//         { id: 'bottom', label: t.plotSubTypes.bottom },
//         { id: 'tilt', label: t.plotSubTypes.tilt }
//       ]
//     }
//   ];

//   // Size units
//   const sizeUnits = [
//     { id: 'acre', label: t.sizeUnits.acre },
//     { id: 'guntha', label: t.sizeUnits.guntha },
//     { id: 'hectare', label: t.sizeUnits.hectare }
//   ];

//   // Price units
//   const priceUnits = [
//     { id: 'perAcre', label: t.priceUnits.perAcre },
//     { id: 'perGuntha', label: t.priceUnits.perGuntha },
//     { id: 'perSqft', label: t.priceUnits.perSqft },
//     { id: 'perKilo', label: t.priceUnits.perKilo }
//   ];

//   // Validation functions
//   const validateName = (name: string) => {
//     if (!name.trim()) return t.validation.plotNameRequired;
//     if (name.length < 10) return t.validation.nameMinLength;
//     if (name.length > 62) return t.validation.nameMaxLength;
//     if (!/^[a-zA-Z\s]+$/.test(name)) return t.validation.nameLettersOnly;
//     return '';
//   };

//   const validateAddress = (address: string) => {
//     if (!address.trim()) return t.validation.addressRequired;
//     if (address.length < 15) return t.validation.addressMinLength;
//     if (!/^[a-zA-Z0-9\s,.-]+$/.test(address)) return t.validation.addressValid;
//     return '';
//   };

//   const validateDescription = (description: string) => {
//     if (!description.trim()) return t.validation.descriptionRequired;
//     if (description.length < 10) return t.validation.descriptionMinLength;
//     return '';
//   };

//   const validateNumber = (value: number, field: string, min: number, max: number) => {
//     if (isNaN(value)) return `${field} must be a number`;
//     if (value < min) return `${field} cannot be less than ${min}`;
//     if (value > max) return `${field} cannot be more than ${max}`;
//     return '';
//   };

//   const validatePlotSize = (value: number) => {
//     return validateNumber(value, 'Plot size', 0.01, 1000);
//   };

//   const validatePricePerUnit = (price: number) => {
//     if (isNaN(price)) return t.validation.priceNumber;
//     if (price < 1000) return t.validation.priceMin;
//     if (price > 1000000) return t.validation.priceMax;
//     return '';
//   };

//   const validateTotalPrice = (price: number) => {
//     if (isNaN(price)) return t.validation.totalPriceNumber;
//     if (price < 100000) return t.validation.totalPriceMin;
//     if (price > 50000000) return t.validation.totalPriceMax;
//     return '';
//   };

//   const validateImages = (files: File[]) => {
//     if (files.length === 0) return t.validation.imagesRequired;
//     if (files.length > 6) return t.validation.imagesMax;
    
//     for (const file of files) {
//       if (!file.type.startsWith('image/')) {
//         return t.validation.imagesType;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         return t.validation.imagesSize;
//       }
//     }
    
//     return '';
//   };

//   const validateVideo = (file: File | null) => {
//     if (!file) return '';
    
//     if (!file.type.startsWith('video/')) {
//       return t.validation.videoType;
//     }
    
//     if (file.size > 50 * 1024 * 1024) {
//       return t.validation.videoSize;
//     }
    
//     return '';
//   };

//   // Validate individual field on change
//   const validateField = (name: string, value: any) => {
//     switch (name) {
//       case 'name':
//         return validateName(value);
//       case 'address':
//         return validateAddress(value);
//       case 'description':
//         return validateDescription(value);
//       case 'plotSize':
//         return validatePlotSize(value);
//       case 'pricePerUnit':
//         return validatePricePerUnit(value);
//       case 'totalPrice':
//         return validateTotalPrice(value);
//       default:
//         return '';
//     }
//   };

//   // Handle input changes with validation
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { id, value } = e.target;
    
//     if (id === 'sale' || id === 'rent') {
//       setFormData({ ...formData, type: id });
//       setErrors({ ...errors, type: '' });
//       return;
//     }
    
//     if (id === 'plotType') {
//       setFormData({ 
//         ...formData, 
//         plotType: value,
//         plotSubType: '' // Reset sub-type when main type changes
//       });
      
//       setErrors({
//         ...errors,
//         plotType: '',
//         plotSubType: ''
//       });
//       return;
//     }
    
//     if (id === 'plotSubType') {
//       setFormData({ 
//         ...formData, 
//         plotSubType: value
//       });
      
//       setErrors({
//         ...errors,
//         plotSubType: ''
//       });
//       return;
//     }
    
//     if (id === 'plotSizeUnit' || id === 'priceUnit') {
//       setFormData({ 
//         ...formData, 
//         [id]: value
//       });
//       return;
//     }
    
//     const isNumber = e.target.type === 'number';
//     let newValue = isNumber ? parseFloat(value) || 0 : value;
    
//     // Calculate total price if plotSize or pricePerUnit changes
//     if ((id === 'plotSize' || id === 'pricePerUnit') && formData.plotSize > 0 && formData.pricePerUnit > 0) {
//       const plotSize = id === 'plotSize' ? newValue : formData.plotSize;
//       const pricePerUnit = id === 'pricePerUnit' ? newValue : formData.pricePerUnit;
//       const totalPrice = Number(plotSize) * Number(pricePerUnit);
      
//       setFormData({
//         ...formData,
//         [id]: newValue,
//         totalPrice: totalPrice
//       });
//     } else {
//       setFormData({
//         ...formData,
//         [id]: newValue,
//       });
//     }
    
//     // Validate the field and set error
//     if (id !== 'type' && id !== 'plotType' && id !== 'plotSubType' && id !== 'plotSizeUnit' && id !== 'priceUnit') {
//       setErrors({
//         ...errors,
//         [id]: validateField(id, newValue)
//       });
//     }
//   };

//   // Handle number input with keyboard events
//   const handleNumberInput = (e: React.KeyboardEvent<HTMLInputElement>, field: string) => {
//     if (e.key === '0' && (e.target as HTMLInputElement).value === '') {
//       e.preventDefault();
//     }
//   };

//   // Handle increment/decrement for number inputs
//   const handleNumberChange = (field: string, increment: boolean) => {
//     const currentValue = formData[field as keyof FormData] as number;
//     let newValue = increment ? currentValue + 1 : currentValue - 1;
    
//     // Set minimum values
//     if (field === 'plotSize') {
//       newValue = Math.max(0.01, Math.min(1000, newValue));
//     } else if (field === 'pricePerUnit') {
//       newValue = Math.max(1000, Math.min(1000000, newValue));
//     } else if (field === 'totalPrice') {
//       newValue = Math.max(100000, Math.min(50000000, newValue));
//     }
    
//     setFormData({
//       ...formData,
//       [field]: newValue,
//     });
    
//     setErrors({
//       ...errors,
//       [field]: validateField(field, newValue)
//     });
//   };

//   // Handle image upload with preview
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFiles = e.target.files;
//     if (!selectedFiles) return;
    
//     const filesArray = Array.from(selectedFiles);
//     const newFiles = [...files, ...filesArray].slice(0, 6); // Limit to 6 images
    
//     const imageError = validateImages(newFiles);
//     if (imageError) {
//       setImageUploadError(imageError);
//       return;
//     }
    
//     setFiles(newFiles);
//     setImageUploadError('');
//   };

//   // Handle video upload
//   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (!selectedFile) return;
    
//     const videoError = validateVideo(selectedFile);
//     if (videoError) {
//       setVideoUploadError(videoError);
//       return;
//     }
    
//     setVideoFile(selectedFile);
//     setVideoUploadError('');
//   };

//   // Remove specific image
//   const removeImage = (index: number) => {
//     const newFiles = files.filter((_, i) => i !== index);
//     setFiles(newFiles);
//     setImageUploadError('');
//   };

//   // Remove video
//   const removeVideo = () => {
//     setVideoFile(null);
//     setVideoUploadError('');
//   };

//   // Replace specific image
//   const replaceImage = (index: number) => {
//     if (imageInputRef.current) {
//       imageInputRef.current.onchange = (e) => {
//         const file = (e.target as HTMLInputElement).files?.[0];
//         if (file) {
//           if (file.size > 5 * 1024 * 1024) {
//             setImageUploadError(t.validation.imagesSize);
//             return;
//           }
//           if (!file.type.startsWith('image/')) {
//             setImageUploadError(t.validation.imagesType);
//             return;
//           }
          
//           const newFiles = [...files];
//           newFiles[index] = file;
//           setFiles(newFiles);
//           setImageUploadError('');
//         }
//       };
//       imageInputRef.current.click();
//     }
//   };

//   // Replace video
//   const replaceVideo = () => {
//     if (videoInputRef.current) {
//       videoInputRef.current.onchange = (e) => {
//         const file = (e.target as HTMLInputElement).files?.[0];
//         if (file) {
//           const videoError = validateVideo(file);
//           if (videoError) {
//             setVideoUploadError(videoError);
//             return;
//           }
          
//           setVideoFile(file);
//           setVideoUploadError('');
//         }
//       };
//       videoInputRef.current.click();
//     }
//   };

//   // Upload images after text data is submitted
//   // In your CreateListing.tsx component
// const uploadImages = async () => {
//   if (!listingId || files.length === 0) {
//     setImageUploadError(t.pleaseSelectImage);
//     return;
//   }
  
//   try {
//     setUploading(true);
//     setImageUploadError('');
    
//     const imageError = validateImages(files);
//     if (imageError) {
//       setImageUploadError(imageError);
//       return;
//     }
    
//     const response = await uploadImagesApi(listingId, files);
    
//     if (response.success) {
//       toast({ 
//         title: t.success, 
//         description: t.imagesUploaded,
//         variant: 'default'
//       });
      
//       // If video is also selected, upload it too
//       if (videoFile) {
//         await uploadVideo();
//       } else {
//         navigate('/properties');
//       }
//     } else {
//       setImageUploadError(t.failedUploadImages);
//     }
//   } catch (e: any) {
//     console.error('Error uploading images:', e);
//     setImageUploadError(e.message || t.failedUploadImages);
//   } finally {
//     setUploading(false);
//   }
// };

//   // Upload video
//   const uploadVideo = async () => {
//     if (!listingId || !videoFile) {
//       return;
//     }
    
//     try {
//       setUploadingVideo(true);
//       setVideoUploadError('');
      
//       const videoError = validateVideo(videoFile);
//       if (videoError) {
//         setVideoUploadError(videoError);
//         return;
//       }
      
//       const response = await uploadVideoApi(listingId, videoFile);
      
//       if (response.success) {
//         toast({ 
//           title: t.success, 
//           description: t.videoUploaded,
//           variant: 'default'
//         });
        
//         navigate('/properties');
//       } else {
//         setVideoUploadError(t.failedUploadVideo);
//       }
//     } catch (e: any) {
//       console.error('Error uploading video:', e);
//       setVideoUploadError(e.message || t.failedUploadVideo);
//     } finally {
//       setUploadingVideo(false);
//     }
//   };

//   // Upload both images and video
//   const uploadMedia = async () => {
//     if (files.length > 0) {
//       await uploadImages();
//     } else if (videoFile) {
//       await uploadVideo();
//     } else {
//       setImageUploadError(t.pleaseUploadMedia);
//     }
//   };

//   // Validate entire form before submission
//   const validateForm = () => {
//     const newErrors = {
//       name: validateName(formData.name),
//       description: validateDescription(formData.description),
//       address: validateAddress(formData.address),
//       type: '',
//       plotType: formData.plotType ? '' : t.validation.plotTypeRequired,
//       plotSubType: formData.plotSubType ? '' : t.validation.plotSubTypeRequired,
//       plotSize: validatePlotSize(formData.plotSize),
//       pricePerUnit: validatePricePerUnit(formData.pricePerUnit),
//       totalPrice: validateTotalPrice(formData.totalPrice),
//       images: '',
//       video: ''
//     };
    
//     setErrors(newErrors);
//     return !Object.values(newErrors).some(error => error !== '');
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       setSubmitError(t.pleaseFixErrors);
//       return;
//     }
    
//     try {
//       setLoading(true);
//       setSubmitError('');

//       const data = await createListingApi(formData);
//       setListingId(data.listingId);
//       setTextDataSubmitted(true);
      
//       toast({ 
//         title: t.success, 
//           description: t.plotCreated,
//         variant: 'default'
//       });
//     } catch (e: any) {
//       console.error('Error creating listing:', e);
//       setSubmitError(e.message || t.somethingWentWrong);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Format price for display
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       maximumFractionDigits: 0
//     }).format(price);
//   };

//   // Parse formatted price back to number
//   const parsePrice = (formattedPrice: string) => {
//     return parseInt(formattedPrice.replace(/,/g, '')) || 0;
//   };

//   // Handle price input with formatting
//   const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
//     const value = e.target.value;
//     const numericValue = parsePrice(value);
    
//     if (field === 'pricePerUnit' && numericValue === 0) {
//       return;
//     }
    
//     setFormData({
//       ...formData,
//       [field]: numericValue
//     });
    
//     setErrors({
//       ...errors,
//       [field]: validateField(field, numericValue)
//     });
//   };

//   // Get current plot type
//   const getCurrentPlotType = () => {
//     return plotTypes.find(pt => pt.id === formData.plotType);
//   };

//   // Show package selection if user doesn't have a seller package
//   if (checkingPackage) {
//     return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
//   }

//   if (!hasSellerPackage) {
//     return (
//       <PackageSelection 
//         currentLang={currentLang}
//         userType="seller"
//         onSuccess={() => setHasSellerPackage(true)}
//       />
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-3">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-4">
//           <p className="text-sm text-gray-600">{t.header}</p>
//         </div>

//         {!textDataSubmitted ? (
//           <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-3">
//             {/* Left Column - Plot Information */}
//             <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
//               <CardContent className="space-y-3 p-4">
//                 <div className="space-y-1">
//                   <Label htmlFor="name" className="text-sm font-medium text-gray-700">
//                     {t.plotName} <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     id="name"
//                     type="text"
//                     placeholder={t.placeholders.plotName}
//                     maxLength={62}
//                     required
//                     onChange={handleChange}
//                     value={formData.name}
//                     className="h-9 text-sm"
//                   />
//                   {errors.name && (
//                     <p className="text-red-600 text-xs flex items-center gap-1">
//                       <AlertCircle className="h-3 w-3" />
//                       {errors.name}
//                     </p>
//                   )}
//                 </div>

//                 {/* Plot Type */}
//                 <div className="space-y-1">
//                   <Label className="text-sm font-medium text-gray-700">
//                     {t.plotType} <span className="text-red-500">*</span>
//                   </Label>
//                   <select
//                     id="plotType"
//                     className="w-full p-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
//                     onChange={handleChange}
//                     value={formData.plotType}
//                     required
//                   >
//                     <option value="">{t.placeholders.selectPlotType}</option>
//                     {plotTypes.map((type) => (
//                       <option key={type.id} value={type.id}>
//                         {type.label}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.plotType && (
//                     <p className="text-red-600 text-xs flex items-center gap-1">
//                       <AlertCircle className="h-3 w-3" />
//                       {errors.plotType}
//                     </p>
//                   )}
//                 </div>

//                 {/* Plot Sub-Type */}
//                 {formData.plotType && (
//                   <div className="space-y-1">
//                     <Label className="text-sm font-medium text-gray-700">
//                       {t.plotSubType} <span className="text-red-500">*</span>
//                     </Label>
//                     <select
//                       id="plotSubType"
//                       className="w-full p-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
//                       onChange={handleChange}
//                       value={formData.plotSubType}
//                       required
//                     >
//                       <option value="">{t.placeholders.selectSubType}</option>
//                       {getCurrentPlotType()?.subTypes.map((subType) => (
//                         <option key={subType.id} value={subType.id}>
//                           {subType.label}
//                         </option>
//                       ))}
//                     </select>
//                     {errors.plotSubType && (
//                       <p className="text-red-600 text-xs flex items-center gap-1">
//                         <AlertCircle className="h-3 w-3" />
//                         {errors.plotSubType}
//                       </p>
//                     )}
//                   </div>
//                 )}

//                 {/* Plot Size with Unit Dropdown */}
//                 <div className="space-y-1">
//                   <Label htmlFor="plotSize" className="text-sm font-medium text-gray-700">
//                     <Ruler className="h-3 w-3 inline mr-1" />
//                     {t.plotSize} <span className="text-red-500">*</span>
//                   </Label>
//                   <div className="flex gap-2">
//                     <div className="flex-1">
//                       <div className="flex items-center">
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="sm"
//                           className="h-9 w-9 rounded-r-none"
//                           onClick={() => handleNumberChange('plotSize', false)}
//                           disabled={formData.plotSize <= 0.01}
//                         >
//                           -
//                         </Button>
//                         <Input
//                           type="number"
//                           id="plotSize"
//                           min="0.01"
//                           max="1000"
//                           step="0.01"
//                           required
//                           className="h-9 text-center rounded-none border-l-0 border-r-0"
//                           onChange={handleChange}
//                           onKeyDown={(e) => handleNumberInput(e, 'plotSize')}
//                           value={formData.plotSize}
//                         />
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="sm"
//                           className="h-9 w-9 rounded-l-none"
//                           onClick={() => handleNumberChange('plotSize', true)}
//                           disabled={formData.plotSize >= 1000}
//                         >
//                           +
//                         </Button>
//                       </div>
//                     </div>
//                     <div className="w-28">
//                       <select
//                         id="plotSizeUnit"
//                         className="w-full h-9 p-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
//                         onChange={handleChange}
//                         value={formData.plotSizeUnit}
//                       >
//                         {sizeUnits.map((unit) => (
//                           <option key={unit.id} value={unit.id}>
//                             {unit.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                   {errors.plotSize && (
//                     <p className="text-red-600 text-xs flex items-center gap-1">
//                       <AlertCircle className="h-3 w-3" />
//                       {errors.plotSize}
//                     </p>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Right Column - Pricing & Description */}
//             <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
//               <CardContent className="space-y-3 p-4">
//                 {/* Price Per Unit with Unit Dropdown */}
//                 <div className="space-y-1">
//                   <Label htmlFor="pricePerUnit" className="text-sm font-medium text-gray-700">
//                     {t.pricePerUnit} <span className="text-red-500">*</span>
//                   </Label>
//                   <div className="flex gap-2">
//                     <div className="flex-1">
//                       <div className="flex items-center">
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="sm"
//                           className="h-9 w-9 rounded-r-none"
//                           onClick={() => handleNumberChange('pricePerUnit', false)}
//                           disabled={formData.pricePerUnit <= 1000}
//                         >
//                           -
//                         </Button>
//                         <div className="relative flex-1">
//                           <Input
//                             type="text"
//                             id="pricePerUnit"
//                             required
//                             className="h-9 text-sm pl-6 rounded-none border-l-0 border-r-0"
//                             onChange={(e) => handlePriceChange(e, 'pricePerUnit')}
//                             value={formatPrice(formData.pricePerUnit)}
//                           />
//                           <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
//                         </div>
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="sm"
//                           className="h-9 w-9 rounded-l-none"
//                           onClick={() => handleNumberChange('pricePerUnit', true)}
//                           disabled={formData.pricePerUnit >= 1000000}
//                         >
//                           +
//                         </Button>
//                       </div>
//                     </div>
//                     <div className="w-28">
//                       <select
//                         id="priceUnit"
//                         className="w-full h-9 p-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
//                         onChange={handleChange}
//                         value={formData.priceUnit}
//                       >
//                         {priceUnits.map((unit) => (
//                           <option key={unit.id} value={unit.id}>
//                             {unit.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                   {errors.pricePerUnit && (
//                     <p className="text-red-600 text-xs flex items-center gap-1">
//                       <AlertCircle className="h-3 w-3" />
//                       {errors.pricePerUnit}
//                     </p>
//                   )}
//                 </div>

//                 {/* Total Price (calculated automatically) */}
//                 <div className="space-y-1">
//                   <Label htmlFor="totalPrice" className="text-sm font-medium text-gray-700">
//                     {t.totalPrice} <span className="text-red-500">*</span>
//                   </Label>
//                   <div className="flex items-center">
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       className="h-9 w-9 rounded-r-none"
//                       onClick={() => handleNumberChange('totalPrice', false)}
//                       disabled={formData.totalPrice <= 100000}
//                     >
//                       -
//                     </Button>
//                     <div className="relative flex-1">
//                       <Input
//                         type="text"
//                         id="totalPrice"
//                         required
//                         className="h-9 text-sm pl-6 rounded-none border-l-0 border-r-0 bg-gray-100"
//                         value={formatPrice(formData.totalPrice)}
//                         readOnly
//                       />
//                       <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
//                     </div>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       className="h-9 w-9 rounded-l-none"
//                       onClick={() => handleNumberChange('totalPrice', true)}
//                       disabled={formData.totalPrice >= 50000000}
//                     >
//                       +
//                     </Button>
//                   </div>
                  
//                   {errors.totalPrice && (
//                     <p className="text-red-600 text-xs flex items-center gap-1">
//                       <AlertCircle className="h-3 w-3" />
//                       {errors.totalPrice}
//                     </p>
//                   )}
//                 </div>

//                 {/* Address */}
//                 <div className="space-y-1">
//                   <Label htmlFor="address" className="text-sm font-medium text-gray-700">
//                     <MapPin className="h-3 w-3 inline mr-1" />
//                     {t.address} <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     id="address"
//                     type="text"
//                     placeholder={t.placeholders.address}
//                     required
//                     onChange={handleChange}
//                     value={formData.address}
//                     className="h-9 text-sm"
//                   />
//                   {errors.address && (
//                     <p className="text-red-600 text-xs flex items-center gap-1">
//                       <AlertCircle className="h-3 w-3" />
//                       {errors.address}
//                     </p>
//                   )}
//                 </div>

//                 {/* Description */}
//                 <div className="space-y-1">
//                   <Label htmlFor="description" className="text-sm font-medium text-gray-700">
//                     {t.description} <span className="text-red-500">*</span>
//                   </Label>
//                   <textarea
//                     id="description"
//                     placeholder={t.placeholders.description}
//                     className="w-full p-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none text-sm"
//                     required
//                     rows={3}
//                     onChange={handleChange}
//                     value={formData.description}
//                   />
//                   {errors.description && (
//                     <p className="text-red-600 text-xs flex items-center gap-1">
//                       <AlertCircle className="h-3 w-3" />
//                       {errors.description}
//                     </p>
//                   )}
//                 </div>

//                 {/* Submit Button and Error */}
//                 <div className="space-y-2 pt-1">
//                   {submitError && (
//                     <div className="bg-red-50 border border-red-200 rounded-lg p-2">
//                       <p className="text-red-700 text-sm text-center flex items-center justify-center gap-1">
//                         <AlertCircle className="h-4 w-4" />
//                         {submitError}
//                       </p>
//                     </div>
//                   )}
                  
//                   <Button 
//                     disabled={loading} 
//                     className="w-full h-10 text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl" 
//                     type="submit"
//                   >
//                     {loading ? (
//                       <div className="flex items-center gap-2">
//                         <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                         {t.creating}
//                       </div>
//                     ) : (
//                       t.createPlotListing
//                     )}
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </form>
//         ) : (
//           /* Media Upload Section with Enhanced Preview and Edit */
//           <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm max-w-4xl mx-auto">
//             <CardHeader className="pb-3">
//               <CardTitle className="flex items-center gap-2 text-lg">
//                 <Upload className="h-4 w-4 text-blue-600" />
//                 {t.uploadPlotMedia} ({files.length}/6 images, {videoFile ? '1' : '0'}/1 video)
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {/* Hidden file inputs for replace functionality */}
//               <input
//                 ref={imageInputRef}
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 style={{ display: 'none' }}
//               />
//               <input
//                 ref={videoInputRef}
//                 type="file"
//                 accept="video/*"
//                 style={{ display: 'none' }}
//               />
              
//               {/* Image Upload Input */}
//               <div className="space-y-2">
//                 <Label htmlFor="images" className="text-sm font-medium text-gray-700">
//                   {t.selectImages} <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="images"
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="h-9 text-sm"
//                   disabled={files.length >= 6}
//                 />
//                 <p className="text-xs text-gray-500">
//                   {t.uploadUpTo}
//                 </p>
                
//                 {imageUploadError && (
//                   <p className="text-red-600 text-xs flex items-center gap-1">
//                     <AlertCircle className="h-3 w-3" />
//                     {imageUploadError}
//                   </p>
//                 )}
//               </div>

//               {/* Video Upload Input */}
//               <div className="space-y-2">
//                 <Label htmlFor="video" className="text-sm font-medium text-gray-700">
//                   {t.selectVideo}
//                 </Label>
//                 <Input
//                   id="video"
//                   type="file"
//                   accept="video/*"
//                   onChange={handleVideoChange}
//                   className="h-9 text-sm"
//                   disabled={!!videoFile}
//                 />
//                 <p className="text-xs text-gray-500">
//                   {t.uploadVideoDesc}
//                 </p>
                
//                 {videoUploadError && (
//                   <p className="text-red-600 text-xs flex items-center gap-1">
//                     <AlertCircle className="h-3 w-3" />
//                     {videoUploadError}
//                   </p>
//                 )}
//               </div>

//               {/* Image Preview Grid with Edit Options */}
//               {files.length > 0 && (
//                 <div className="space-y-3">
//                   <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                     <ImageIcon className="h-4 w-4" />
//                     {t.selectedImages}
//                   </h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                     {files.map((file, index) => (
//                       <div key={index} className="relative group">
//                         <div className="aspect-video w-full rounded-lg overflow-hidden border-2 border-gray-200">
//                           <img
//                             src={URL.createObjectURL(file)}
//                             alt={`Preview ${index + 1}`}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
                        
//                         {/* Image Number Badge */}
//                         <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
//                           {index + 1}
//                         </div>
                        
//                         {/* Edit and Remove Buttons (appear on hover) */}
//                         <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant="secondary"
//                             className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
//                             onClick={() => replaceImage(index)}
//                             title="Replace image"
//                           >
//                             <Edit3 className="h-3 w-3" />
//                           </Button>
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant="destructive"
//                             className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-500"
//                             onClick={() => removeImage(index)}
//                             title="Remove image"
//                           >
//                             <X className="h-3 w-3" />
//                           </Button>
//                         </div>
                        
//                         {/* Image Info */}
//                         <div className="mt-1 text-center">
//                           <p className="text-xs text-gray-600 truncate">
//                             {file.name}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             {(file.size / 1024 / 1024).toFixed(1)} MB
//                           </p>
//                         </div>
//                       </div>
//                     ))}
                    
//                     {/* Add More Images Placeholder */}
//                     {files.length < 6 && (
//                       <div 
//                         className="aspect-video w-full rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
//                         onClick={() => document.getElementById('images')?.click()}
//                       >
//                         <Upload className="h-6 w-6 text-gray-400 mb-1" />
//                         <p className="text-xs text-gray-600 font-medium">{t.addMore}</p>
//                         <p className="text-xs text-gray-500">{6 - files.length} {t.remaining}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Video Preview */}
//               {videoFile && (
//                 <div className="space-y-3">
//                   <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                     <VideoIcon className="h-4 w-4" />
//                     {t.selectedVideo}
//                   </h3>
//                   <div className="relative group">
//                     <div className="aspect-video w-full rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
//                       <video 
//                         src={URL.createObjectURL(videoFile)} 
//                         className="max-h-48"
//                         controls
//                       />
//                     </div>
                    
//                     {/* Edit and Remove Buttons (appear on hover) */}
//                     <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <Button
//                         type="button"
//                         size="sm"
//                         variant="secondary"
//                         className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
//                         onClick={replaceVideo}
//                         title="Replace video"
//                       >
//                         <Edit3 className="h-3 w-3" />
//                       </Button>
//                       <Button
//                         type="button"
//                         size="sm"
//                         variant="destructive"
//                         className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-500"
//                         onClick={removeVideo}
//                         title="Remove video"
//                       >
//                         <X className="h-3 w-3" />
//                       </Button>
//                     </div>
                    
//                     {/* Video Info */}
//                     <div className="mt-1 text-center">
//                       <p className="text-xs text-gray-600 truncate">
//                         {videoFile.name}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {(videoFile.size / 1024 / 1024).toFixed(1)} MB
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
              
//               {/* Action Buttons */}
//               <div className="flex gap-3 pt-3 border-t border-gray-200">
//                 <Button
//                   type="button"
//                   onClick={uploadMedia}
//                   disabled={uploading || uploadingVideo || (files.length === 0 && !videoFile)}
//                   className="flex-1 h-10 text-sm font-medium bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
//                 >
//                   {(uploading || uploadingVideo) ? (
//                     <div className="flex items-center gap-2">
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       {uploading ? t.uploadingImages : t.uploadingVideo}
//                     </div>
//                   ) : (
//                     <>
//                       <Upload className="h-4 w-4 mr-2" />
//                       {t.uploadMedia}
//                       {files.length > 0 && ` (${files.length} image${files.length !== 1 ? 's' : ''})`}
//                       {videoFile && ' + Video'}
//                     </>
//                   )}
//                 </Button>
                
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => navigate(`/listing/${listingId}`)}
//                   className="h-10 text-sm px-4"
//                 >
//                   {t.skip}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CreateListing;





import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MapPin,
  FileText,
  Upload,
  Ruler,
  X,
  Edit3,
  ImageIcon,
  AlertCircle,
  VideoIcon,
  IndianRupee,
  ChevronDown,
  Package
} from 'lucide-react';
import { createListingApi, uploadImagesApi, uploadVideoApi } from '@/lib/api';
import { incrementPropertyCount, getRemainingProperties, validatePackage } from '@/lib/packageUtils';
import PackageExpiryPopup from './PackageExpiryPopup';

// Define the form data interface for TypeScript
interface FormData {
  name: string;
  description: string;
  address: string;
  type: string;
  plotType: string;
  plotSubType: string;
  plotSize: number;
  plotSizeUnit: string;
  pricePerUnit: number;
  priceUnit: string;
  totalPrice: number;
  userRef: string;
}

interface CreateListingProps {
  currentLang: 'en' | 'mr';
  onLanguageChange: (lang: 'en' | 'mr') => void;
  userId: string;
}

const CreateListing = ({ currentLang = 'en', onLanguageChange, userId }: CreateListingProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    address: '',
    type: 'sale',
    plotType: '',
    plotSubType: '',
    plotSize: 0,
    plotSizeUnit: 'acre',
    pricePerUnit: 0,
    priceUnit: 'perAcre',
    totalPrice: 0,
    userRef: userId || 'public',
  });

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    address: '',
    type: '',
    plotType: '',
    plotSubType: '',
    plotSize: '',
    pricePerUnit: '',
    totalPrice: '',
    images: '',
    video: ''
  });

  const [imageUploadError, setImageUploadError] = useState('');
  const [videoUploadError, setVideoUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [listingId, setListingId] = useState<string | null>(null);
  const [textDataSubmitted, setTextDataSubmitted] = useState(false);
  const [remainingListings, setRemainingListings] = useState(getRemainingProperties());
  const [showPackagePopup, setShowPackagePopup] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // ✅ Enhanced package validation for sellers
  useEffect(() => {
    const userRole = localStorage.getItem('role') || '';
    const validation = validatePackage(userRole);

    console.log('🔍 CreateListing - Package validation:', validation);

    // If package is expired or limit reached, redirect to packages page
    if (!validation.isValid) {
      console.log('⚠️ Package invalid, redirecting to packages page');
      toast({
        title: "Package Required",
        description: validation.reason === 'expired'
          ? "Your package has expired. Please purchase a new package to create listings."
          : "You've reached your listing limit. Please upgrade your package.",
        variant: "destructive"
      });
      navigate('/packages');
      return;
    }

    // Show popup for warnings
    if (validation.warnings.nearExpiry || validation.warnings.limitNearReached) {
      setShowPackagePopup(true);
    }

    setRemainingListings(validation.remaining);
  }, [navigate, toast]);

  // Enhanced translations
  const translations = {
    en: {
      header: "Fill in the details to create your plot listing",
      plotName: "Plot Name",
      plotDetails: "Plot Details",
      plotType: "Plot Type",
      plotSubType: "Plot Sub-Type",
      plotSize: "Plot Size",
      plotSizeUnit: "Unit",
      pricePerUnit: "Expected Price",
      priceUnit: "Price Unit",
      totalPrice: "Total Price (₹)",
      address: "Address",
      description: "Description",
      createPlotListing: "Create Plot Listing",
      creating: "Creating...",
      uploadPlotMedia: "Upload Plot Media",
      selectImages: "Select Images (Maximum 6)",
      selectVideo: "Select Video (Optional)",
      uploadUpTo: "Upload up to 6 images of your plot (each under 5MB). Click edit button to replace individual images.",
      uploadVideoDesc: "Upload a video tour of your plot (under 50MB).",
      selectedImages: "Selected Images Preview",
      selectedVideo: "Selected Video Preview",
      addMore: "Add More",
      remaining: "remaining",
      uploadMedia: "Upload Media",
      uploadingImages: "Uploading Images...",
      uploadingVideo: "Uploading Video...",
      skip: "Skip for Now",
      success: "Success",
      plotCreated: "Plot listing created successfully! Please upload media.",
      imagesUploaded: "Images uploaded successfully!",
      videoUploaded: "Video uploaded successfully!",
      error: "Error",
      pleaseFixErrors: "Please fix the errors in the form",
      somethingWentWrong: "Something went wrong. Please try again.",
      failedUploadImages: "Failed to upload images",
      failedUploadVideo: "Failed to upload video",
      pleaseSelectImage: "Please select at least one image",
      pleaseUploadMedia: "Please upload at least one image or video",
      packageInfo: "Package Information",
      remainingListings: "Remaining Listings",
      listingLimitReached: "Listing Limit Reached",
      limitMessage: "You have reached your listing limit. Please upgrade your package to list more properties.",
      upgradePackage: "Upgrade Package",
      plotTypeOptions: {
        agriculture: "Agriculture Plot",
        nonAgriculture: "Non-Agricultural Plot",
        mountain: "Mountain Plot"
      },
      plotSubTypes: {
        land: "Land",
        vegetable: "Vegetable Plot",
        fruit: "Fruit Plot",
        sugarcane: "Sugarcane",
        banana: "Banana",
        grapes: "Grapes",
        na: "NA",
        gunta: "Gunta",
        top: "Top",
        bottom: "Bottom",
        tilt: "Tilt"
      },
      sizeUnits: {
        acre: "Acre",
        guntha: "Guntha",
        hectare: "Hectare"
      },
      priceUnits: {
        perAcre: "Per Acre",
        perGuntha: "Per Guntha",
        perSqft: "Per Sq. Ft.",
        perKilo: "Per Kilo"
      },
      validation: {
        plotNameRequired: "Plot name is required",
        nameMinLength: "Name must be at least 10 characters",
        nameMaxLength: "Name cannot exceed 62 characters",
        nameLettersOnly: "Name can only contain letters and spaces",
        addressRequired: "Address is required",
        addressMinLength: "Please enter a complete address",
        addressValid: "Please enter a valid address",
        descriptionRequired: "Description is required",
        descriptionMinLength: "Description must be at least 10 characters",
        plotTypeRequired: "Please select a plot type",
        plotSubTypeRequired: "Please select a plot sub-type",
        plotSizeNumber: "Plot size must be a number",
        plotSizeMin: "Plot size cannot be less than 0.01",
        plotSizeMax: "Plot size cannot be more than 1000",
        priceNumber: "Price per unit must be a number",
        priceMin: "Price cannot be less than ₹1,000",
        priceMax: "Price cannot exceed ₹10,00,000",
        totalPriceNumber: "Total price must be a number",
        totalPriceMin: "Price cannot be less than ₹1,00,000",
        totalPriceMax: "Price cannot exceed ₹5,00,00,000",
        imagesRequired: "Please upload at least one image",
        imagesMax: "You can upload a maximum of 6 images",
        imagesType: "Only image files are allowed",
        imagesSize: "Each image should be less than 5MB",
        videoType: "Only video files are allowed",
        videoSize: "Video should be less than 50MB"
      },
      placeholders: {
        plotName: "Enter plot name (letters only)",
        address: "Enter complete address",
        description: "Describe your plot in detail (minimum 10 characters)...",
        selectPlotType: "Select Plot Type",
        selectSubType: "Select Sub-Type",
        selectSizeUnit: "Select Unit",
        selectPriceUnit: "Select Unit"
      }
    },
    mr: {
      header: "तुमची प्लॉट लिस्टिंग तयार करण्यासाठी तपशील भरा",
      plotName: "प्लॉटचे नाव",
      plotDetails: "प्लॉट तपशील",
      plotType: "प्लॉट प्रकार",
      plotSubType: "प्लॉट उप-प्रकार",
      plotSize: "प्लॉट आकार",
      plotSizeUnit: "युनिट",
      pricePerUnit: "अपेक्षित किंमत",
      priceUnit: "किंमत युनिट",
      totalPrice: "एकूण किंमत (₹)",
      address: "पत्ता",
      description: "वर्णन",
      createPlotListing: "प्लॉट लिस्टिंग तयार करा",
      creating: "तयार करत आहे...",
      uploadPlotMedia: "प्लॉट मीडिया अपलोड करा",
      selectImages: "प्रतिमा निवडा (जास्तीत जास्त ६)",
      selectVideo: "व्हिडिओ निवडा (पर्यायी)",
      uploadUpTo: "तुमच्या प्लॉटच्या ६ प्रतिमा अपलोड करा (प्रत्येक 5MB पेक्षा कमी). वैयक्तिक प्रतिमा बदलण्यासाठी संपादन बटणावर क्लिक करा.",
      uploadVideoDesc: "तुमच्या प्लॉटचा व्हिडिओ टूर अपलोड करा (50MB पेक्षा कमी).",
      selectedImages: "निवडलेल्या प्रतिमांचे पूर्वावलोकन",
      selectedVideo: "निवडलेल्या व्हिडिओचे पूर्वावलोकन",
      addMore: "अजून जोडा",
      remaining: "शिल्लक",
      uploadMedia: "मीडिया अपलोड करा",
      uploadingImages: "प्रतिमा अपलोड करत आहे...",
      uploadingVideo: "व्हिडिओ अपलोड करत आहे...",
      skip: "आत्तासाठी वगळा",
      success: "यश",
      plotCreated: "प्लॉट लिस्टिंग यशस्वीरित्या तयार झाली! कृपया मीडिया अपलोड करा.",
      imagesUploaded: "प्रतिमा यशस्वीरित्या अपलोड झाल्या!",
      videoUploaded: "व्हिडिओ यशस्वीरित्या अपलोड झाला!",
      error: "त्रुटी",
      pleaseFixErrors: "कृपया फॉर्ममधील त्रुटी दुरुस्त करा",
      somethingWentWrong: "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.",
      failedUploadImages: "प्रतिमा अपलोड करण्यात अयशस्वी",
      failedUploadVideo: "व्हिडिओ अपलोड करण्यात अयशस्वी",
      pleaseSelectImage: "कृपया किमान एक प्रतिमा निवडा",
      pleaseUploadMedia: "कृपया किमान एक प्रतिमा किंवा व्हिडिओ अपलोड करा",
      packageInfo: "पॅकेज माहिती",
      remainingListings: "उर्वरित लिस्टिंग",
      listingLimitReached: "लिस्टिंग मर्यादा पूर्ण",
      limitMessage: "तुम्ही तुमची लिस्टिंग मर्यादा पूर्ण केली आहे. अधिक properties लिस्ट करण्यासाठी कृपया तुमचा पॅकेज अपग्रेड करा.",
      upgradePackage: "पॅकेज अपग्रेड करा",
      plotTypeOptions: {
        agriculture: "शेती जमीन",
        nonAgriculture: "नॉन-एग्रीकल्चर जमीन",
        mountain: "डोंगराळ जमीन"
      },
      plotSubTypes: {
        land: "जमीन",
        vegetable: "भाजीपाला जमीन",
        fruit: "फळबागा जमीन",
        sugarcane: "ऊस",
        banana: "केळी",
        grapes: "द्राक्षे",
        na: "एनए",
        gunta: "गुंटा",
        top: "वरचा भाग",
        bottom: "खालचा भाग",
        tilt: "झुकणारा"
      },
      sizeUnits: {
        acre: "एकर",
        guntha: "गुंठा",
        hectare: "हेक्टर"
      },
      priceUnits: {
        perAcre: "प्रति एकर",
        perGuntha: "प्रति गुंठा",
        perSqft: "प्रति चौ. फुट",
        perKilo: "प्रति किलो"
      },
      validation: {
        plotNameRequired: "प्लॉटचे नाव आवश्यक आहे",
        nameMinLength: "नाव किमान १० वर्णांचे असणे आवश्यक आहे",
        nameMaxLength: "नाव ६२ वर्णांपेक्षा जास्त असू शकत नाही",
        nameLettersOnly: "नावात फक्त अक्षरे आणि स्पेस असू शकतात",
        addressRequired: "पत्ता आवश्यक आहे",
        addressMinLength: "कृपया संपूर्ण पत्ता प्रविष्ट करा",
        addressValid: "कृपया वैध पत्ता प्रविष्ट करा",
        descriptionRequired: "वर्णन आवश्यक आहे",
        descriptionMinLength: "वर्णन किमान १० वर्णांचे असणे आवश्यक आहे",
        plotTypeRequired: "कृपया प्लॉट प्रकार निवडा",
        plotSubTypeRequired: "कृपया प्लॉट उप-प्रकार निवडा",
        plotSizeNumber: "प्लॉट आकार संख्यात्मक असणे आवश्यक आहे",
        plotSizeMin: "प्लॉट आकार ०.०१ पेक्षा कमी असू शकत नाही",
        plotSizeMax: "प्लॉट आकार १००० पेक्षा जास्त असू शकत नाही",
        priceNumber: "प्रति युनिट किंमत संख्यात्मक असणे आवश्यक आहे",
        priceMin: "किंमत ₹१,००० पेक्षा कमी असू शकत नाही",
        priceMax: "किंमत ₹१०,००,००० पेक्षा जास्त असू शकत नाही",
        totalPriceNumber: "एकूण किंमत संख्यात्मक असणे आवश्यक आहे",
        totalPriceMin: "किंमत ₹१,००,००० पेक्षा कमी असू शकत नाही",
        totalPriceMax: "किंमत ₹५,००,००,००० पेक्षा जास्त असू शकत नाही",
        imagesRequired: "कृपया किमान एक प्रतिमा अपलोड करा",
        imagesMax: "तुम्ही जास्तीत जास्त ६ प्रतिमा अपलोड करू शकता",
        imagesType: "फक्त प्रतिमा फाइल्स परवानगी आहेत",
        imagesSize: "प्रत्येक प्रतिमा 5MB पेक्षा कमी असावी",
        videoType: "फक्त व्हिडिओ फाइल्स परवानगी आहेत",
        videoSize: "व्हिडिओ 50MB पेक्षा कमी असावा"
      },
      placeholders: {
        plotName: "प्लॉटचे नाव प्रविष्ट करा (फक्त अक्षरे)",
        address: "संपूर्ण पत्ता प्रविष्ट करा",
        description: "तुमच्या प्लॉटचे तपशीलवार वर्णन करा (किमान १० वर्ण)...",
        selectPlotType: "प्लॉट प्रकार निवडा",
        selectSubType: "उप-प्रकार निवडा",
        selectSizeUnit: "युनिट निवडा",
        selectPriceUnit: "युनिट निवडा"
      }
    }
  };

  const t = translations[currentLang];

  // Plot type options
  const plotTypes = [
    { 
      id: 'agriculture', 
      label: t.plotTypeOptions.agriculture,
      subTypes: [
        { id: 'land', label: t.plotSubTypes.land },
        { id: 'vegetable', label: t.plotSubTypes.vegetable },
        { id: 'fruit', label: t.plotSubTypes.fruit },
        { id: 'sugarcane', label: t.plotSubTypes.sugarcane },
        { id: 'banana', label: t.plotSubTypes.banana },
        { id: 'grapes', label: t.plotSubTypes.grapes }
      ]
    },
    { 
      id: 'non-agriculture', 
      label: t.plotTypeOptions.nonAgriculture,
      subTypes: [
        { id: 'na', label: t.plotSubTypes.na },
        { id: 'gunta', label: t.plotSubTypes.gunta }
      ]
    },
    { 
      id: 'mountain', 
      label: t.plotTypeOptions.mountain,
      subTypes: [
        { id: 'top', label: t.plotSubTypes.top },
        { id: 'bottom', label: t.plotSubTypes.bottom },
        { id: 'tilt', label: t.plotSubTypes.tilt }
      ]
    }
  ];

  // Size units
  const sizeUnits = [
    { id: 'acre', label: t.sizeUnits.acre },
    { id: 'guntha', label: t.sizeUnits.guntha },
    { id: 'hectare', label: t.sizeUnits.hectare }
  ];

  // Price units
  const priceUnits = [
    { id: 'perAcre', label: t.priceUnits.perAcre },
    { id: 'perGuntha', label: t.priceUnits.perGuntha },
    { id: 'perSqft', label: t.priceUnits.perSqft },
    { id: 'perKilo', label: t.priceUnits.perKilo }
  ];

  // Validation functions
  const validateName = (name: string) => {
    if (!name.trim()) return t.validation.plotNameRequired;
    if (name.length < 10) return t.validation.nameMinLength;
    if (name.length > 62) return t.validation.nameMaxLength;
    if (!/^[a-zA-Z\s]+$/.test(name)) return t.validation.nameLettersOnly;
    return '';
  };

  const validateAddress = (address: string) => {
    if (!address.trim()) return t.validation.addressRequired;
    if (address.length < 15) return t.validation.addressMinLength;
    if (!/^[a-zA-Z0-9\s,.-]+$/.test(address)) return t.validation.addressValid;
    return '';
  };

  const validateDescription = (description: string) => {
    if (!description.trim()) return t.validation.descriptionRequired;
    if (description.length < 10) return t.validation.descriptionMinLength;
    return '';
  };

  const validateNumber = (value: number, field: string, min: number, max: number) => {
    if (isNaN(value)) return `${field} must be a number`;
    if (value < min) return `${field} cannot be less than ${min}`;
    if (value > max) return `${field} cannot be more than ${max}`;
    return '';
  };

  const validatePlotSize = (value: number) => {
    return validateNumber(value, 'Plot size', 0.01, 1000);
  };

  const validatePricePerUnit = (price: number) => {
    if (isNaN(price)) return t.validation.priceNumber;
    if (price < 1000) return t.validation.priceMin;
    if (price > 1000000) return t.validation.priceMax;
    return '';
  };

  const validateTotalPrice = (price: number) => {
    if (isNaN(price)) return t.validation.totalPriceNumber;
    if (price < 100000) return t.validation.totalPriceMin;
    if (price > 50000000) return t.validation.totalPriceMax;
    return '';
  };

  const validateImages = (files: File[]) => {
    if (files.length === 0) return t.validation.imagesRequired;
    if (files.length > 6) return t.validation.imagesMax;
    
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return t.validation.imagesType;
      }
      if (file.size > 5 * 1024 * 1024) {
        return t.validation.imagesSize;
      }
    }
    
    return '';
  };

  const validateVideo = (file: File | null) => {
    if (!file) return '';
    
    if (!file.type.startsWith('video/')) {
      return t.validation.videoType;
    }
    
    if (file.size > 50 * 1024 * 1024) {
      return t.validation.videoSize;
    }
    
    return '';
  };

  // Validate individual field on change
  const validateField = (name: string, value: any) => {
    switch (name) {
      case 'name':
        return validateName(value);
      case 'address':
        return validateAddress(value);
      case 'description':
        return validateDescription(value);
      case 'plotSize':
        return validatePlotSize(value);
      case 'pricePerUnit':
        return validatePricePerUnit(value);
      case 'totalPrice':
        return validateTotalPrice(value);
      default:
        return '';
    }
  };

  // Handle input changes with validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    
    if (id === 'sale' || id === 'rent') {
      setFormData({ ...formData, type: id });
      setErrors({ ...errors, type: '' });
      return;
    }
    
    if (id === 'plotType') {
      setFormData({ 
        ...formData, 
        plotType: value,
        plotSubType: '' // Reset sub-type when main type changes
      });
      
      setErrors({
        ...errors,
        plotType: '',
        plotSubType: ''
      });
      return;
    }
    
    if (id === 'plotSubType') {
      setFormData({ 
        ...formData, 
        plotSubType: value
      });
      
      setErrors({
        ...errors,
        plotSubType: ''
      });
      return;
    }
    
    if (id === 'plotSizeUnit' || id === 'priceUnit') {
      setFormData({ 
        ...formData, 
        [id]: value
      });
      return;
    }
    
    const isNumber = e.target.type === 'number';
    let newValue = isNumber ? parseFloat(value) || 0 : value;
    
    // Calculate total price if plotSize or pricePerUnit changes
    if ((id === 'plotSize' || id === 'pricePerUnit') && formData.plotSize > 0 && formData.pricePerUnit > 0) {
      const plotSize = id === 'plotSize' ? newValue : formData.plotSize;
      const pricePerUnit = id === 'pricePerUnit' ? newValue : formData.pricePerUnit;
      const totalPrice = Number(plotSize) * Number(pricePerUnit);
      
      setFormData({
        ...formData,
        [id]: newValue,
        totalPrice: totalPrice
      });
    } else {
      setFormData({
        ...formData,
        [id]: newValue,
      });
    }
    
    // Validate the field and set error
    if (id !== 'type' && id !== 'plotType' && id !== 'plotSubType' && id !== 'plotSizeUnit' && id !== 'priceUnit') {
      setErrors({
        ...errors,
        [id]: validateField(id, newValue)
      });
    }
  };

  // Handle number input with keyboard events
  const handleNumberInput = (e: React.KeyboardEvent<HTMLInputElement>, field: string) => {
    if (e.key === '0' && (e.target as HTMLInputElement).value === '') {
      e.preventDefault();
    }
  };

  // Handle increment/decrement for number inputs
  const handleNumberChange = (field: string, increment: boolean) => {
    const currentValue = formData[field as keyof FormData] as number;
    let newValue = increment ? currentValue + 1 : currentValue - 1;
    
    // Set minimum values
    if (field === 'plotSize') {
      newValue = Math.max(0.01, Math.min(1000, newValue));
    } else if (field === 'pricePerUnit') {
      newValue = Math.max(1000, Math.min(1000000, newValue));
    } else if (field === 'totalPrice') {
      newValue = Math.max(100000, Math.min(50000000, newValue));
    }
    
    setFormData({
      ...formData,
      [field]: newValue,
    });
    
    setErrors({
      ...errors,
      [field]: validateField(field, newValue)
    });
  };

  // Handle image upload with preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    
    const filesArray = Array.from(selectedFiles);
    const newFiles = [...files, ...filesArray].slice(0, 6); // Limit to 6 images
    
    const imageError = validateImages(newFiles);
    if (imageError) {
      setImageUploadError(imageError);
      return;
    }
    
    setFiles(newFiles);
    setImageUploadError('');
  };

  // Handle video upload
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    const videoError = validateVideo(selectedFile);
    if (videoError) {
      setVideoUploadError(videoError);
      return;
    }
    
    setVideoFile(selectedFile);
    setVideoUploadError('');
  };

  // Remove specific image
  const removeImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    setImageUploadError('');
  };

  // Remove video
  const removeVideo = () => {
    setVideoFile(null);
    setVideoUploadError('');
  };

  // Replace specific image
  const replaceImage = (index: number) => {
    if (imageInputRef.current) {
      imageInputRef.current.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          if (file.size > 5 * 1024 * 1024) {
            setImageUploadError(t.validation.imagesSize);
            return;
          }
          if (!file.type.startsWith('image/')) {
            setImageUploadError(t.validation.imagesType);
            return;
          }
          
          const newFiles = [...files];
          newFiles[index] = file;
          setFiles(newFiles);
          setImageUploadError('');
        }
      };
      imageInputRef.current.click();
    }
  };

  // Replace video
  const replaceVideo = () => {
    if (videoInputRef.current) {
      videoInputRef.current.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const videoError = validateVideo(file);
          if (videoError) {
            setVideoUploadError(videoError);
            return;
          }
          
          setVideoFile(file);
          setVideoUploadError('');
        }
      };
      videoInputRef.current.click();
    }
  };

  // Upload images after text data is submitted
  const uploadImages = async () => {
    if (!listingId || files.length === 0) {
      setImageUploadError(t.pleaseSelectImage);
      return;
    }
    
    try {
      setUploading(true);
      setImageUploadError('');
      
      const imageError = validateImages(files);
      if (imageError) {
        setImageUploadError(imageError);
        return;
      }
      
      const response = await uploadImagesApi(listingId, files);
      
      if (response.success) {
        toast({ 
          title: t.success, 
          description: t.imagesUploaded,
          variant: 'default'
        });
        
        // If video is also selected, upload it too
        if (videoFile) {
          await uploadVideo();
        } else {
          navigate('/properties');
        }
      } else {
        setImageUploadError(t.failedUploadImages);
      }
    } catch (e: any) {
      console.error('Error uploading images:', e);
      setImageUploadError(e.message || t.failedUploadImages);
    } finally {
      setUploading(false);
    }
  };

  // Upload video
  const uploadVideo = async () => {
    if (!listingId || !videoFile) {
      return;
    }
    
    try {
      setUploadingVideo(true);
      setVideoUploadError('');
      
      const videoError = validateVideo(videoFile);
      if (videoError) {
        setVideoUploadError(videoError);
        return;
      }
      
      const response = await uploadVideoApi(listingId, videoFile);
      
      if (response.success) {
        toast({ 
          title: t.success, 
          description: t.videoUploaded,
          variant: 'default'
        });
        
        navigate('/properties');
      } else {
        setVideoUploadError(t.failedUploadVideo);
      }
    } catch (e: any) {
      console.error('Error uploading video:', e);
      setVideoUploadError(e.message || t.failedUploadVideo);
    } finally {
      setUploadingVideo(false);
    }
  };

  // Upload both images and video
  const uploadMedia = async () => {
    if (files.length > 0) {
      await uploadImages();
    } else if (videoFile) {
      await uploadVideo();
    } else {
      setImageUploadError(t.pleaseUploadMedia);
    }
  };

  // Validate entire form before submission
  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      description: validateDescription(formData.description),
      address: validateAddress(formData.address),
      type: '',
      plotType: formData.plotType ? '' : t.validation.plotTypeRequired,
      plotSubType: formData.plotSubType ? '' : t.validation.plotSubTypeRequired,
      plotSize: validatePlotSize(formData.plotSize),
      pricePerUnit: validatePricePerUnit(formData.pricePerUnit),
      totalPrice: validateTotalPrice(formData.totalPrice),
      images: '',
      video: ''
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user can create more listings
    if (!canPerformAction('create')) {
      toast({
        title: t.listingLimitReached,
        description: t.limitMessage,
        variant: "destructive"
      });
      navigate('/packages');
      return;
    }
    
    if (!validateForm()) {
      setSubmitError(t.pleaseFixErrors);
      return;
    }
    
    try {
      setLoading(true);
      setSubmitError('');

      const data = await createListingApi(formData);
      setListingId(data.listingId);
      setTextDataSubmitted(true);
      
      // Increment the property count
      incrementPropertyCount();
      setRemainingListings(getRemainingProperties());
      
      toast({ 
        title: t.success, 
        description: t.plotCreated,
        variant: 'default'
      });
    } catch (e: any) {
      console.error('Error creating listing:', e);
      setSubmitError(e.message || t.somethingWentWrong);
    } finally {
      setLoading(false);
    }
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(price);
  };

  // Parse formatted price back to number
  const parsePrice = (formattedPrice: string) => {
    return parseInt(formattedPrice.replace(/,/g, '')) || 0;
  };

  // Handle price input with formatting
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    const numericValue = parsePrice(value);
    
    if (field === 'pricePerUnit' && numericValue === 0) {
      return;
    }
    
    setFormData({
      ...formData,
      [field]: numericValue
    });
    
    setErrors({
      ...errors,
      [field]: validateField(field, numericValue)
    });
  };

  // Get current plot type
  const getCurrentPlotType = () => {
    return plotTypes.find(pt => pt.id === formData.plotType);
  };

  // Check if user can create listings
  const userRole = localStorage.getItem('role') || '';
  const validation = validatePackage(userRole);
  const canCreate = validation.isValid && validation.remaining > 0;

  return (
    <>
      {/* ✅ Package Expiry Popup */}
      {showPackagePopup && (
        <PackageExpiryPopup
          currentLang={currentLang}
          onClose={() => setShowPackagePopup(false)}
          userType={userRole}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-3">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">{t.header}</p>
        </div>

        {/* Package Status */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium">{t.packageInfo}</h3>
                  <p className="text-sm text-gray-600">
                    {t.remainingListings}: <span className="font-bold text-blue-600">{remainingListings}</span>
                  </p>
                </div>
              </div>
              {!canCreate && (
                <Button onClick={() => navigate('/packages')} size="sm">
                  {t.upgradePackage}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {!textDataSubmitted ? (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Left Column - Plot Information */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="space-y-3 p-4">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    {t.plotName} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t.placeholders.plotName}
                    maxLength={62}
                    required
                    onChange={handleChange}
                    value={formData.name}
                    className="h-9 text-sm"
                    disabled={!canCreate}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Plot Type */}
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700">
                    {t.plotType} <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="plotType"
                    className="w-full p-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                    onChange={handleChange}
                    value={formData.plotType}
                    required
                    disabled={!canCreate}
                  >
                    <option value="">{t.placeholders.selectPlotType}</option>
                    {plotTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.plotType && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.plotType}
                    </p>
                  )}
                </div>

                {/* Plot Sub-Type */}
                {formData.plotType && (
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700">
                      {t.plotSubType} <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="plotSubType"
                      className="w-full p-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                      onChange={handleChange}
                      value={formData.plotSubType}
                      required
                      disabled={!canCreate}
                    >
                      <option value="">{t.placeholders.selectSubType}</option>
                      {getCurrentPlotType()?.subTypes.map((subType) => (
                        <option key={subType.id} value={subType.id}>
                          {subType.label}
                        </option>
                      ))}
                    </select>
                    {errors.plotSubType && (
                      <p className="text-red-600 text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.plotSubType}
                      </p>
                    )}
                  </div>
                )}

                {/* Plot Size with Unit Dropdown */}
                <div className="space-y-1">
                  <Label htmlFor="plotSize" className="text-sm font-medium text-gray-700">
                    <Ruler className="h-3 w-3 inline mr-1" />
                    {t.plotSize} <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-9 w-9 rounded-r-none"
                          onClick={() => handleNumberChange('plotSize', false)}
                          disabled={formData.plotSize <= 0.01 || !canCreate}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          id="plotSize"
                          min="0.01"
                          max="1000"
                          step="0.01"
                          required
                          className="h-9 text-center rounded-none border-l-0 border-r-0"
                          onChange={handleChange}
                          onKeyDown={(e) => handleNumberInput(e, 'plotSize')}
                          value={formData.plotSize}
                          disabled={!canCreate}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-9 w-9 rounded-l-none"
                          onClick={() => handleNumberChange('plotSize', true)}
                          disabled={formData.plotSize >= 1000 || !canCreate}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="w-28">
                      <select
                        id="plotSizeUnit"
                        className="w-full h-9 p-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                        onChange={handleChange}
                        value={formData.plotSizeUnit}
                        disabled={!canCreate}
                      >
                        {sizeUnits.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {errors.plotSize && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.plotSize}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Pricing & Description */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="space-y-3 p-4">
                {/* Price Per Unit with Unit Dropdown */}
                <div className="space-y-1">
                  <Label htmlFor="pricePerUnit" className="text-sm font-medium text-gray-700">
                    {t.pricePerUnit} <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-9 w-9 rounded-r-none"
                          onClick={() => handleNumberChange('pricePerUnit', false)}
                          disabled={formData.pricePerUnit <= 1000 || !canCreate}
                        >
                          -
                        </Button>
                        <div className="relative flex-1">
                          <Input
                            type="text"
                            id="pricePerUnit"
                            required
                            className="h-9 text-sm pl-6 rounded-none border-l-0 border-r-0"
                            onChange={(e) => handlePriceChange(e, 'pricePerUnit')}
                            value={formatPrice(formData.pricePerUnit)}
                            disabled={!canCreate}
                          />
                          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-9 w-9 rounded-l-none"
                          onClick={() => handleNumberChange('pricePerUnit', true)}
                          disabled={formData.pricePerUnit >= 1000000 || !canCreate}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="w-28">
                      <select
                        id="priceUnit"
                        className="w-full h-9 p-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                        onChange={handleChange}
                        value={formData.priceUnit}
                        disabled={!canCreate}
                      >
                        {priceUnits.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {errors.pricePerUnit && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.pricePerUnit}
                    </p>
                  )}
                </div>

                {/* Total Price (calculated automatically) */}
                <div className="space-y-1">
                  <Label htmlFor="totalPrice" className="text-sm font-medium text-gray-700">
                    {t.totalPrice} <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 rounded-r-none"
                      onClick={() => handleNumberChange('totalPrice', false)}
                      disabled={formData.totalPrice <= 100000 || !canCreate}
                    >
                      -
                    </Button>
                    <div className="relative flex-1">
                      <Input
                        type="text"
                        id="totalPrice"
                        required
                        className="h-9 text-sm pl-6 rounded-none border-l-0 border-r-0 bg-gray-100"
                        value={formatPrice(formData.totalPrice)}
                        readOnly
                      />
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 rounded-l-none"
                      onClick={() => handleNumberChange('totalPrice', true)}
                      disabled={formData.totalPrice >= 50000000 || !canCreate}
                    >
                      +
                    </Button>
                  </div>
                  
                  {errors.totalPrice && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.totalPrice}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-1">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    <MapPin className="h-3 w-3 inline mr-1" />
                    {t.address} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder={t.placeholders.address}
                    required
                    onChange={handleChange}
                    value={formData.address}
                    className="h-9 text-sm"
                    disabled={!canCreate}
                  />
                  {errors.address && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    {t.description} <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="description"
                    placeholder={t.placeholders.description}
                    className="w-full p-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none text-sm"
                    required
                    rows={3}
                    onChange={handleChange}
                    value={formData.description}
                    disabled={!canCreate}
                  />
                  {errors.description && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Submit Button and Error */}
                <div className="space-y-2 pt-1">
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                      <p className="text-red-700 text-sm text-center flex items-center justify-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {submitError}
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    disabled={loading || !canCreate} 
                    className="w-full h-10 text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl" 
                    type="submit"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {t.creating}
                      </div>
                    ) : (
                      t.createPlotListing
                    )}
                  </Button>

                  {!canCreate && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-yellow-700 text-sm text-center flex items-center justify-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {t.limitMessage}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        ) : (
          /* Media Upload Section */
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm max-w-4xl mx-auto">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="h-4 w-4 text-blue-600" />
                {t.uploadPlotMedia} ({files.length}/6 images, {videoFile ? '1' : '0'}/1 video)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Hidden file inputs for replace functionality */}
              <input
                ref={imageInputRef}
                type="file"
                multiple
                accept="image/*"
                style={{ display: 'none' }}
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                style={{ display: 'none' }}
              />
              
              {/* Image Upload Input */}
              <div className="space-y-2">
                <Label htmlFor="images" className="text-sm font-medium text-gray-700">
                  {t.selectImages} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="h-9 text-sm"
                  disabled={files.length >= 6}
                />
                <p className="text-xs text-gray-500">
                  {t.uploadUpTo}
                </p>
                
                {imageUploadError && (
                  <p className="text-red-600 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {imageUploadError}
                  </p>
                )}
              </div>

              {/* Video Upload Input */}
              <div className="space-y-2">
                <Label htmlFor="video" className="text-sm font-medium text-gray-700">
                  {t.selectVideo}
                </Label>
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="h-9 text-sm"
                  disabled={!!videoFile}
                />
                <p className="text-xs text-gray-500">
                  {t.uploadVideoDesc}
                </p>
                
                {videoUploadError && (
                  <p className="text-red-600 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {videoUploadError}
                  </p>
                )}
              </div>

              {/* Image Preview Grid */}
              {files.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    {t.selectedImages}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {files.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-video w-full rounded-lg overflow-hidden border-2 border-gray-200">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Image Number Badge */}
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {index + 1}
                        </div>
                        
                        {/* Edit and Remove Buttons */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                            onClick={() => replaceImage(index)}
                            title="Replace image"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-500"
                            onClick={() => removeImage(index)}
                            title="Remove image"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {/* Image Info */}
                        <div className="mt-1 text-center">
                          <p className="text-xs text-gray-600 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add More Images Placeholder */}
                    {files.length < 6 && (
                      <div 
                        className="aspect-video w-full rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                        onClick={() => document.getElementById('images')?.click()}
                      >
                        <Upload className="h-6 w-6 text-gray-400 mb-1" />
                        <p className="text-xs text-gray-600 font-medium">{t.addMore}</p>
                        <p className="text-xs text-gray-500">{6 - files.length} {t.remaining}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Video Preview */}
              {videoFile && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <VideoIcon className="h-4 w-4" />
                    {t.selectedVideo}
                  </h3>
                  <div className="relative group">
                    <div className="aspect-video w-full rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                      <video 
                        src={URL.createObjectURL(videoFile)} 
                        className="max-h-48"
                        controls
                      />
                    </div>
                    
                    {/* Edit and Remove Buttons */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                        onClick={replaceVideo}
                        title="Replace video"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-500"
                        onClick={removeVideo}
                        title="Remove video"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {/* Video Info */}
                    <div className="mt-1 text-center">
                      <p className="text-xs text-gray-600 truncate">
                        {videoFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(videoFile.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-3 border-t border-gray-200">
                <Button
                  type="button"
                  onClick={uploadMedia}
                  disabled={uploading || uploadingVideo || (files.length === 0 && !videoFile)}
                  className="flex-1 h-10 text-sm font-medium bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  {(uploading || uploadingVideo) ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {uploading ? t.uploadingImages : t.uploadingVideo}
                    </div>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      {t.uploadMedia}
                      {files.length > 0 && ` (${files.length} image${files.length !== 1 ? 's' : ''})`}
                      {videoFile && ' + Video'}
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/listing/${listingId}`)}
                  className="h-10 text-sm px-4"
                >
                  {t.skip}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    </>
  );
};

export default CreateListing;