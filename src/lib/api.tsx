// lib/api.ts
// const BASE = "http://localhost:5000";
const BASE = "https://real-estate-project-backend-2-2.onrender.com";

// Attach Authorization header if token is present
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
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

/* ---------------- AUTH APIS ---------------- */
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
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
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

/* ---------------- LISTINGS APIS ---------------- */
export const createListingApi = async (formData: any) => {
  const res = await fetch(`${BASE}/api/listings`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create listing");
  return data;
};

export const uploadImagesApi = async (listingId: string, files: File[]) => {
  try {
    const formData = new FormData();
    
    // Append each file to the formData
    files.forEach((file) => {
      formData.append('images', file);
    });
    
    const response = await fetch(`${BASE}/api/listings/${listingId}/upload-images`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
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
      Authorization: `Bearer ${localStorage.getItem("token")}`
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

    if (data && data.listing) {
      return data.listing;
    } else if (data && data.data) {
      return data.data;
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error fetching listing:", error);
    throw error;
  }
};

export const updateListingApi = async (id: string, payload: any) => {
  const res = await fetch(`${BASE}/api/listings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
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

export const getListingsApi = async () => {
  try {
    const res = await fetch(`${BASE}/api/listings`, {
      headers: authHeaders()
    });
    const data = await parseJson(res);

    if (!res.ok) {
      throw new Error(data.message || `Failed to fetch listings: ${res.status}`);
    }

    // Handle different response formats
    let listings = [];
    if (data && data.listings) {
      listings = data.listings;
    } else if (Array.isArray(data)) {
      listings = data;
    } else if (data && data.data) {
      listings = data.data;
    }

    // Ensure all listings have proper image URLs
    const listingsWithMedia = listings.map((listing: any) => {
      // Handle both string URLs and ObjectId references
      const images = Array.isArray(listing.images) ? listing.images : [];
      const videos = Array.isArray(listing.videos) ? listing.videos : [];
      
      const processedImages = images.map((img: any) => {
        if (typeof img === 'string' && img.startsWith('http')) {
          return img; // Already a URL
        }
        // Convert ObjectId to URL
        return `${BASE}/api/listings/image/${img}`;
      });

      const processedVideos = videos.map((vid: any) => {
        if (typeof vid === 'string' && vid.startsWith('http')) {
          return vid; // Already a URL
        }
        // Convert ObjectId to URL
        return `${BASE}/api/listings/video/${vid}`;
      });

      return {
        ...listing,
        images: processedImages,
        videos: processedVideos
      };
    });

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
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders()
    },
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

    // Extract token without 'Bearer ' prefix if present
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
      role: payload.role,
      name: payload.name || payload.username,
      email: payload.email,
      exp: payload.exp // expiration timestamp
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    // Clear invalid token
    localStorage.removeItem('token');
    return null;
  }
};

export const createPaymentOrderApi = async (amount: number, packageType: string, userType: string = 'buyer') => {
  const res = await fetch(`${BASE}/api/payment/order`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ amount, packageType, userType }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create order");
  return data;
};

export const verifyPaymentApi = async (response: any, amount: number, packageType: string, userType: string = 'buyer') => {
  const res = await fetch(`${BASE}/api/payment/verify`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ ...response, amount, packageType, userType }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Payment verification failed");
  return data;
};