import { useMemo } from 'react';

export const useApiHeaders = () => {
  const getHeaders = useMemo(() => {
    return () => {
      const token = localStorage.getItem('token');
      const currentRole = localStorage.getItem('currentRole') || localStorage.getItem('role') || 'buyer';
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Always send the current role in headers
      headers['x-current-role'] = currentRole;
      
      console.log('🔧 API Headers:', { 
        hasToken: !!token, 
        currentRole,
        headers 
      });
      
      return headers;
    };
  }, []);

  return { getHeaders };
};

export default useApiHeaders;