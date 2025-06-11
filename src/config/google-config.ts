// Google Places API Configuration
export const GOOGLE_PLACES_API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY_HERE';

// Note: To use real restaurant data, you need to:
// 1. Get a Google Places API key from Google Cloud Console
// 2. Enable Places API in your project
// 3. Replace the API key above with your actual key
// 4. For production, use environment variables to store API keys securely

export const GOOGLE_MAPS_CONFIG = {
  enableRealData: false, // Set to true when you have a valid API key
  defaultLocation: {
    latitude: 41.0082,
    longitude: 28.9784, // Istanbul, Turkey
  },
  searchRadius: 2000, // 2km in meters
};
