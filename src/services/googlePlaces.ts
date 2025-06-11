// Google Places API Service for fetching real restaurant data
import { Platform } from 'react-native';
import { GOOGLE_PLACES_API_KEY, GOOGLE_MAPS_CONFIG } from '../config/google-config';

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  priceLevel?: number;
  vicinity: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  photoReference?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  businessStatus?: string;
  openingHours?: {
    openNow: boolean;
  };
}

export interface RestaurantDetails extends Restaurant {
  formattedAddress: string;
  internationalPhoneNumber?: string;
  website?: string;
  reviews?: Array<{
    authorName: string;
    rating: number;
    text: string;
    time: number;
  }>;
  photos?: Array<{
    photoReference: string;
    height: number;
    width: number;
  }>;
}

class GooglePlacesService {
  private apiKey: string;
  private baseUrl: string = 'https://maps.googleapis.com/maps/api/place';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Search for nearby restaurants
   */
  async searchNearbyRestaurants(
    latitude: number,
    longitude: number,
    radius: number = 1500, // 1.5km radius
    type: string = 'restaurant'
  ): Promise<Restaurant[]> {
    try {
      const url = `${this.baseUrl}/nearbysearch/json?` +
        `location=${latitude},${longitude}&` +
        `radius=${radius}&` +
        `type=${type}&` +
        `key=${this.apiKey}`;

      console.log('Fetching restaurants from:', { latitude, longitude, radius });

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        return data.results.map((place: any) => ({
          id: place.place_id,
          name: place.name,
          rating: place.rating || 0,
          priceLevel: place.price_level,
          vicinity: place.vicinity,
          photoReference: place.photos?.[0]?.photo_reference,
          geometry: place.geometry,
          types: place.types,
          businessStatus: place.business_status,
          openingHours: place.opening_hours
        }));
      } else {
        console.error('Google Places API error:', data.status, data.error_message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return [];
    }
  }

  /**
   * Get detailed information about a specific restaurant
   */
  async getRestaurantDetails(placeId: string): Promise<RestaurantDetails | null> {
    try {
      const url = `${this.baseUrl}/details/json?` +
        `place_id=${placeId}&` +
        `fields=name,rating,formatted_address,international_phone_number,website,reviews,photos,geometry,types,business_status,opening_hours&` +
        `key=${this.apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        const result = data.result;
        return {
          id: placeId,
          name: result.name,
          rating: result.rating || 0,
          vicinity: result.formatted_address,
          formattedAddress: result.formatted_address,
          internationalPhoneNumber: result.international_phone_number,
          website: result.website,
          geometry: result.geometry,
          types: result.types,
          businessStatus: result.business_status,
          openingHours: result.opening_hours,
          reviews: result.reviews?.slice(0, 5), // Get first 5 reviews
          photos: result.photos?.slice(0, 5) // Get first 5 photos
        };
      } else {
        console.error('Google Places API error:', data.status, data.error_message);
        return null;
      }
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      return null;
    }
  }

  /**
   * Get photo URL from photo reference
   */
  getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
    return `${this.baseUrl}/photo?` +
      `maxwidth=${maxWidth}&` +
      `photo_reference=${photoReference}&` +
      `key=${this.apiKey}`;
  }

  /**
   * Search for restaurants by text query
   */
  async searchRestaurantsByText(
    query: string,
    latitude?: number,
    longitude?: number
  ): Promise<Restaurant[]> {
    try {
      let url = `${this.baseUrl}/textsearch/json?` +
        `query=${encodeURIComponent(query)}&` +
        `type=restaurant&` +
        `key=${this.apiKey}`;

      if (latitude && longitude) {
        url += `&location=${latitude},${longitude}&radius=5000`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        return data.results.map((place: any) => ({
          id: place.place_id,
          name: place.name,
          rating: place.rating || 0,
          priceLevel: place.price_level,
          vicinity: place.formatted_address,
          photoReference: place.photos?.[0]?.photo_reference,
          geometry: place.geometry,
          types: place.types,
          businessStatus: place.business_status,
          openingHours: place.opening_hours
        }));
      } else {
        console.error('Google Places API error:', data.status, data.error_message);
        return [];
      }
    } catch (error) {
      console.error('Error searching restaurants:', error);
      return [];
    }
  }
}

// Mock data for development/testing when API key is not available
export const mockRestaurants: Restaurant[] = [
  {
    id: 'mock_1',
    name: 'Pizza Palace',
    rating: 4.5,
    priceLevel: 2,
    vicinity: 'Downtown Area',
    address: '123 Main St, Downtown',
    latitude: 41.0082,
    longitude: 28.9784,
    geometry: {
      location: {
        lat: 41.0082,
        lng: 28.9784
      }
    },
    types: ['restaurant', 'food', 'establishment'],
    businessStatus: 'OPERATIONAL'
  },
  {
    id: 'mock_2',
    name: 'Sushi Master',
    rating: 4.8,
    priceLevel: 3,
    vicinity: 'City Center',
    address: '456 Center Ave, City Center',
    latitude: 41.0100,
    longitude: 28.9800,
    geometry: {
      location: {
        lat: 41.0100,
        lng: 28.9800
      }
    },
    types: ['restaurant', 'food', 'establishment'],
    businessStatus: 'OPERATIONAL'
  },
  {
    id: 'mock_3',
    name: 'Burger House',
    rating: 4.2,
    priceLevel: 1,
    vicinity: 'Main Street',
    address: '789 Main St, Central',
    latitude: 41.0050,
    longitude: 28.9750,
    geometry: {
      location: {
        lat: 41.0050,
        lng: 28.9750
      }
    },
    types: ['restaurant', 'food', 'establishment'],
    businessStatus: 'OPERATIONAL'
  },
  {
    id: 'mock_4',
    name: 'Turkish Delight',
    rating: 4.6,
    priceLevel: 2,
    vicinity: 'Historic District',
    address: '321 Historic Ave, Old Town',
    latitude: 41.0120,
    longitude: 28.9820,
    geometry: {
      location: {
        lat: 41.0120,
        lng: 28.9820
      }
    },
    types: ['restaurant', 'food', 'establishment'],
    businessStatus: 'OPERATIONAL'
  },
  {
    id: 'mock_5',
    name: 'Coffee Corner',
    rating: 4.3,
    priceLevel: 1,
    vicinity: 'Business District',
    geometry: {
      location: {
        lat: 41.0070,
        lng: 28.9770
      }
    },
    types: ['cafe', 'restaurant', 'food', 'establishment'],
    businessStatus: 'OPERATIONAL'
  }
];

// Create and export the service instance
export const googlePlacesService = new GooglePlacesService(GOOGLE_PLACES_API_KEY);

// Helper function to get restaurant emoji based on type
export const getRestaurantEmoji = (types: string[] | string): string => {
  const typeArray = Array.isArray(types) ? types : [types];
  
  if (typeArray.includes('bakery')) return '🥖';
  if (typeArray.includes('cafe')) return '☕';
  if (typeArray.includes('bar')) return '🍻';
  if (typeArray.some(type => type.includes('pizza'))) return '🍕';
  if (typeArray.some(type => type.includes('chinese'))) return '🥡';
  if (typeArray.some(type => type.includes('japanese'))) return '🍣';
  if (typeArray.some(type => type.includes('mexican'))) return '🌮';
  if (typeArray.some(type => type.includes('italian'))) return '🍝';
  if (typeArray.some(type => type.includes('indian'))) return '🍛';
  if (typeArray.some(type => type.includes('fast_food'))) return '🍔';
  return '🍽️'; // Default restaurant emoji
};

// Helper function to get price level string
export const getPriceLevelString = (priceLevel?: number): string => {
  switch (priceLevel) {
    case 1: return '$';
    case 2: return '$$';
    case 3: return '$$$';
    case 4: return '$$$$';
    default: return 'N/A';
  }
};
