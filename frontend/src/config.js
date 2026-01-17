// ===========================================
// API Configuration - Auto-detects Environment
// ===========================================

// Auto-detect environment and set API URL accordingly
const getApiBaseUrl = () => {
  // Check if we're in production (Netlify, Vercel, etc.)
  const isProduction = window.location.hostname !== 'localhost' && 
                       window.location.hostname !== '127.0.0.1';
  
  // Priority 1: Check for environment variable (Netlify/Vercel) - RECOMMENDED
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Priority 2: Production URL - Update this with your actual backend URL
  if (isProduction) {
    // Option 1: Railway (uncomment if using Railway)
    return 'https://bookingpms-production.up.railway.app/api';
    
    // Option 2: Custom server (uncomment if using custom server)
    // return 'http://207.180.240.176:9004/api';
    
    // Option 3: Render (uncomment if using Render)
    // return 'https://your-app.onrender.com/api';
  }
  
  // Priority 3: Development URL
  return 'http://localhost:5000/api';
};

const config = {
  // Base URL for all API calls - Auto-detects environment
  API_BASE_URL: getApiBaseUrl(),

  // App settings
  APP_NAME: 'BookingPMS',
  APP_VERSION: '1.0.0',
};

export default config;
