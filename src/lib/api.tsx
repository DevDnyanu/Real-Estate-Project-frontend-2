// ✅ DYNAMIC BASE URL for production
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const currentHost = window.location.hostname;
    
    // Production - HTTPS
    if (currentHost.includes('plotchamps.in')) {
      return "https://real-estate-project-backend-2-2.onrender.com";
    }
    
    // Local development
    return "http://localhost:5000";
  }
  
  return "http://localhost:5000";
};

export const BASE = getBaseUrl();
console.log('🌍 API Base URL:', BASE);

// Enhanced authHeaders function with role support
export const authHeaders = () => {
  const token = localStorage.getItem("token");
  
  // ✅ FIXED: Get current role with better fallback logic
  let currentRole = localStorage.getItem('currentRole');
  
  // If no currentRole, try to get from role or default to buyer
  if (!currentRole) {
    currentRole = localStorage.getItem('role') || 'buyer';
    // Save it for future use
    localStorage.setItem('currentRole', currentRole);
  }
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // ✅ CRITICAL: Always send the current selected role - UPPERCASE header
  headers['X-Current-Role'] = currentRole;
  
  console.log('🔧 authHeaders - Headers being sent:', headers);
  
  return headers;
};

// Enhanced parseJson function
const parseJson = async (res: Response) => {
  const text = await res.text();
  if (!text) {
    return { success: res.ok };
  }

  try {
    const data = JSON.parse(text);
    
    if (data.errors && Array.isArray(data.errors)) {
      const validationErrors: { [key: string]: string } = {};
      data.errors.forEach((error: { field: string; message: string }) => {
        validationErrors[error.field] = error.message;
      });
      
      return {
        success: false,
        message: data.message || 'Validation failed',
        errors: validationErrors
      };
    }
    
    return data;
  } catch (e) {
    console.error("JSON parse error:", e, "Response text:", text);
    return { success: false, message: "Invalid JSON response" };
  }
};

/* ---------------- IMAGE HANDLING UTILITIES - FIXED ---------------- */

// ✅ CORRECT: Image URL processing function
export const processImageUrl = (img: any): string => {
  if (!img) {
    return 'https://via.placeholder.com/400x300?text=No+Image';
  }

  // If it's already a full URL
  if (typeof img === 'string' && img.startsWith('http')) {
    return img;
  }

  // If it's a filename or path
  if (typeof img === 'string') {
    // Remove any leading slashes or backslashes
    const cleanPath = img.replace(/^[\\/]+/, '');
    
    // Check if it's already a full path from backend
    if (cleanPath.includes('uploads/')) {
      return `${BASE}/${cleanPath}`;
    }
    
    // Default image endpoint
    return `${BASE}/api/listings/image/${cleanPath}`;
  }

  // If it's an object with url property
  if (typeof img === 'object' && img.url) {
    return processImageUrl(img.url);
  }

  // Fallback to placeholder
  return 'https://via.placeholder.com/400x300?text=Image+Not+Found';
};

// ✅ CORRECT: Process multiple images
export const processImages = (images: any[]): string[] => {
  if (!Array.isArray(images) || images.length === 0) {
    return ['https://via.placeholder.com/400x300?text=No+Images'];
  }

  return images.map(processImageUrl);
};

/* ---------------- ROLE SWITCH API - FIXED ---------------- */
/* ---------------- ROLE SWITCH API - PRODUCTION FIXED ---------------- */
export const switchRoleApi = async (newRole: string) => {
  try {
    console.log(`🔄 Switching role to: ${newRole}`);
    
    const response = await fetch(`${BASE}/api/auth/switch-role`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ newRole })
    });

    console.log('📡 Role switch response status:', response.status);
    
    // ✅ CRITICAL FIX: Handle 404 specifically
    if (response.status === 404) {
      console.error('❌ Role switch endpoint not found (404)');
      throw new Error('Role switch feature is currently unavailable. Please try again later.');
    }

    const data = await parseJson(response);

    if (!response.ok) {
      throw new Error(data.message || `Failed to switch role: ${response.status}`);
    }

    // ✅ Update local storage only after successful API call
    localStorage.setItem('currentRole', newRole);
    
    console.log('✅ Role switch API response:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Role switch API error:', error);
    
    // ✅ PRODUCTION: Provide user-friendly error messages
    if (error.message.includes('404')) {
      throw new Error('Unable to switch role at the moment. Please try again later.');
    } else if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    throw error;
  }
};

/* ---------------- PACKAGE APIS - COMPLETELY FIXED ---------------- */

export interface UserPackage {
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
}

export interface PackageResponse {
  success: boolean;
  package: UserPackage | null;
  message?: string;
}

// Get user's current package - COMPLETELY FIXED
export const getUserPackageApi = async (): Promise<PackageResponse> => {
  try {
    const headers = authHeaders();
    console.log('🔄 Fetching package with headers:', headers);

    const response = await fetch(`${BASE}/api/packages/user-package`, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error fetching user package:', error);
    throw error;
  }
};

// Activate free package - FIXED
export const activateFreePackageApi = async (packageType: string): Promise<PackageResponse> => {
  try {
    const headers = authHeaders();
    const url = `${BASE}/api/packages/activate-free`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ packageType })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error activating free package:', error);
    throw error;
  }
};

// Check if user can perform action - FIXED
export const canPerformActionApi = async (actionType: string = 'view') => {
  try {
    const headers = authHeaders();
    const url = `${BASE}/api/packages/can-perform?actionType=${actionType}`;
    
    console.log('🔍 Checking action permission at:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error checking action permission:', error);
    throw error;
  }
};

// Update package usage - FIXED
export const updatePackageUsageApi = async (action: 'increment' | 'decrement') => {
  try {
    const headers = authHeaders();
    const url = `${BASE}/api/packages/update-usage`;
    
    console.log('🔄 Updating package usage at:', url, { action });

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ action })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error updating package usage:', error);
    throw error;
  }
};

/* ---------------- PAYMENT APIS - FIXED ---------------- */

export interface CreateOrderResponse {
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
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  package: any;
  payment: any;
}

// Create payment order - FIXED
export const createPaymentOrderApi = async (packageType: string): Promise<CreateOrderResponse> => {
  try {
    const headers = authHeaders();
    const url = `${BASE}/api/payments/create-order`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ 
        packageType: packageType
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error creating payment order:', error);
    throw error;
  }
};

// Verify payment - FIXED
export const verifyPaymentApi = async (paymentData: any) => {
  try {
    const headers = authHeaders();
    const url = `${BASE}/api/payments/verify-payment`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(paymentData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

/* ---------------- PROFILE APIS - FIXED ---------------- */

// Get user profile
export const getProfileApi = async () => {
  try {
    const response = await fetch(`${BASE}/api/auth/profile`, {
      method: "GET",
      headers: authHeaders()
    });

    const data = await parseJson(response);

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch profile");
    }

    // Process profile image
    if (data.user && data.user.image) {
      data.user.image = processImageUrl(data.user.image);
    }

    return data;
  } catch (error) {
    console.error("Get profile error:", error);
    throw error;
  }
};

// Update user profile
export const updateProfileApi = async (profileData: {
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
}) => {
  try {
    const response = await fetch(`${BASE}/api/auth/profile`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(profileData)
    });

    const data = await parseJson(response);

    if (!response.ok) {
      throw new Error(data.message || "Failed to update profile");
    }

    return data;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
};

// Upload profile image
export const uploadProfileImageApi = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await fetch(`${BASE}/api/auth/profile/upload-image`, {
      method: "POST",
      headers: {
        'Authorization': authHeaders().Authorization || ''
      },
      body: formData
    });

    const data = await parseJson(response);

    if (!response.ok) {
      throw new Error(data.message || "Failed to upload profile image");
    }

    return data;
  } catch (error) {
    console.error("Upload profile image error:", error);
    throw error;
  }
};

// Remove profile image
export const removeProfileImageApi = async () => {
  try {
    const response = await fetch(`${BASE}/api/auth/profile/remove-image`, {
      method: "DELETE",
      headers: authHeaders()
    });

    const data = await parseJson(response);

    if (!response.ok) {
      throw new Error(data.message || "Failed to remove profile image");
    }

    return data;
  } catch (error) {
    console.error("Remove profile image error:", error);
    throw error;
  }
};

/* ---------------- AUTH APIS - FIXED ---------------- */
export const signupApi = async (userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}) => {
  const res = await fetch(`${BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await parseJson(res);
  
  if (!res.ok) {
    if (data.errors) {
      throw { 
        message: data.message || "Validation failed", 
        errors: data.errors 
      };
    }
    throw new Error(data.message || "Signup failed");
  }
  
  return data;
};

export const loginApi = async (email: string, password: string, role: string) => {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });
  const data = await parseJson(res);
  
  if (!res.ok) {
    if (data.errors) {
      throw { 
        message: data.message || "Validation failed", 
        errors: data.errors 
      };
    }
    throw new Error(data.message || "Login failed");
  }
  
  return data;
};

export const verifyToken = async (token: string) => {
  try {
    const res = await fetch(`${BASE}/api/auth/verify`, {
      method: "GET",
      headers: authHeaders()
    });
    
    const data = await parseJson(res);
    
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
      }
      throw new Error(data.message || "Token verification failed");
    }
    
    return data;
  } catch (error) {
    console.error('Token verification error:', error);
    throw error;
  }
};

export interface ApiResponse {
  status: string;
  message: string;
  data?: any;
  token?: string;
}

export const forgotPasswordApi = async (email: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${BASE}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await parseJson(response);
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('Forgot password API error:', error);
    throw error;
  }
};

export const verifyOtpApi = async (email: string, otp: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${BASE}/api/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });
    
    const data = await parseJson(response);
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('Verify OTP API error:', error);
    throw error;
  }
};

export const resetPasswordApi = async (email: string, resetToken: string, newPassword: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${BASE}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, resetToken, newPassword }),
    });
    
    const data = await parseJson(response);
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('Reset password API error:', error);
    throw error;
  }
};

/* ---------------- LISTINGS APIS - COMPLETELY FIXED ---------------- */
export const createListingApi = async (formData: any) => {
  const res = await fetch(`${BASE}/api/listings`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create listing");
  return data;
};

export const uploadImagesApi = async (listingId: string, files: File[]) => {
  try {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('images', file);
    });
    
    const response = await fetch(`${BASE}/api/listings/${listingId}/upload-images`, {
      method: 'POST',
      headers: {
        'Authorization': authHeaders().Authorization || ''
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload images');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};

export const uploadVideoApi = async (listingId: string, file: File) => {
  const formData = new FormData();
  formData.append('videos', file);
  
  const res = await fetch(`${BASE}/api/listings/${listingId}/upload-videos`, {
    method: "POST",
    headers: { 
      'Authorization': authHeaders().Authorization || ''
    },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to upload video");
  return data;
};

export const getListingApi = async (id: string) => {
  try {
    const res = await fetch(`${BASE}/api/listings/${id}`, {
      headers: authHeaders()
    });
    const data = await parseJson(res);

    if (!res.ok) {
      throw new Error(data.message || `Failed to fetch listing: ${res.status}`);
    }

    let listing = data.listing || data.data || data;

    // ✅ CORRECT: Process images for single listing
    if (listing) {
      listing.images = processImages(listing.images || []);
      listing.videos = processImages(listing.videos || []);
    }

    return listing;
  } catch (error) {
    console.error("Error fetching listing:", error);
    throw error;
  }
};

export const updateListingApi = async (id: string, payload: any) => {
  const res = await fetch(`${BASE}/api/listings/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.message || "Failed to update listing");
  return data;
};

export const deleteListingApi = async (id: string) => {
  const res = await fetch(`${BASE}/api/listings/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.message || "Failed to delete listing");
  return data;
};

// ✅ CORRECT: Get all listings with proper image handling
export const getListingsApi = async () => {
  try {
    const headers = authHeaders();
    console.log('🔄 getListingsApi - Making request with headers:', headers);
    
    const res = await fetch(`${BASE}/api/listings`, {
      headers: headers
    });
    
    console.log('📊 getListingsApi - Response status:', res.status);
    
    const data = await parseJson(res);
    console.log('📊 getListingsApi - Raw API response:', data);

    if (!res.ok) {
      throw new Error(data.message || `Failed to fetch listings: ${res.status}`);
    }

    let listings = [];
    if (data && data.listings) {
      listings = data.listings;
    } else if (Array.isArray(data)) {
      listings = data;
    } else if (data && data.data) {
      listings = data.data;
    }

    // ✅ CORRECT: Process images for all listings
    const listingsWithMedia = listings.map((listing: any) => {
      console.log(`🏠 Processing listing ${listing._id}:`, listing.images);
      
      return {
        ...listing,
        images: processImages(listing.images || []),
        videos: processImages(listing.videos || [])
      };
    });

    console.log('🎉 Final processed listings:', listingsWithMedia);

    return {
      success: true,
      listings: listingsWithMedia,
    };
  } catch (error: any) {
    console.error("Error fetching listings:", error);
    return {
      success: false,
      message: error.message,
      listings: [],
    };
  }
};

export const deleteImageApi = async (listingId: string, imageUrl: string) => {
  const response = await fetch(`${BASE}/api/listings/${listingId}/images`, {
    method: 'DELETE',
    headers: authHeaders(),
    body: JSON.stringify({ imageUrl }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete image');
  }
  
  return response.json();
};

// Get user info from token
export const getCurrentUserFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const currentRole = localStorage.getItem('currentRole') || localStorage.getItem('role');
    
    const actualToken = token.replace(/^Bearer\s+/i, '');
    
    if (actualToken.split('.').length !== 3) {
      console.warn('Invalid JWT format');
      return null;
    }

    const payloadBase64 = actualToken.split('.')[1];
    const padded = payloadBase64.padEnd(payloadBase64.length + (4 - payloadBase64.length % 4) % 4, '=');
    
    const jsonPayload = decodeURIComponent(atob(padded).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    
    return {
      _id: payload.userId || payload._id || payload.sub,
      role: currentRole || payload.role,
      name: payload.name || payload.username,
      email: payload.email,
      exp: payload.exp
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    localStorage.removeItem('token');
    localStorage.removeItem('currentRole');
    return null;
  }
};

// Get package history - FIXED
export const getPackageHistoryApi = async () => {
  try {
    const headers = authHeaders();
    const url = `${BASE}/api/packages/history`;
    
    console.log('📚 Fetching package history from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error fetching package history:', error);
    throw error;
  }
};

// Get available packages - FIXED
export const getAvailablePackagesApi = async (userType: string = 'buyer') => {
  try {
    const headers = authHeaders();
    const url = `${BASE}/api/packages/available?userType=${userType}`;
    
    console.log('📦 Fetching available packages from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error fetching available packages:', error);
    throw error;
  }
};

// Test package routes
export const testPackageRoutesApi = async () => {
  try {
    const url = `${BASE}/api/packages/test`;
    console.log('🧪 Testing package routes at:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Package routes test result:', data);
    return data;
  } catch (error) {
    console.error('❌ Error testing package routes:', error);
    throw error;
  }
};

// Get user's own listings
export const getMyListingsApi = async () => {
  try {
    const headers = authHeaders();
    const url = `${BASE}/api/listings/my-listings`;
    
    console.log('📋 Fetching my listings from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process images for my listings
    if (data.listings) {
      data.listings = data.listings.map((listing: any) => ({
        ...listing,
        images: processImages(listing.images || []),
        videos: processImages(listing.videos || [])
      }));
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching my listings:', error);
    throw error;
  }
};

// Search listings
export const searchListingsApi = async (filters: any) => {
  try {
    const headers = authHeaders();
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const url = `${BASE}/api/listings/search?${queryParams}`;
    console.log('🔍 Searching listings at:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process images for search results
    if (data.listings) {
      data.listings = data.listings.map((listing: any) => ({
        ...listing,
        images: processImages(listing.images || []),
        videos: processImages(listing.videos || [])
      }));
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error searching listings:', error);
    throw error;
  }
};