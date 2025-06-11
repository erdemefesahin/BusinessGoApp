import Geolocation from 'react-native-geolocation-service';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { GOOGLE_MAPS_CONFIG } from '../config/google-config';

export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

class LocationService {
  /**
   * Request location permissions
   */
  async requestLocationPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'RestaurantGO Location Permission',
            message: 'RestaurantGO needs access to your location to find nearby restaurants.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // iOS permissions are handled automatically
    } catch (err) {
      console.warn('Location permission error:', err);
      return false;
    }
  }
  /**
   * Get current location
   */
  async getCurrentLocation(): Promise<LocationCoords | null> {
    try {
      // First request permission
      const hasPermission = await this.requestLocationPermission();
      
      if (!hasPermission) {
        console.log('Location permission denied, using default location');
        return GOOGLE_MAPS_CONFIG.defaultLocation;
      }

      return new Promise((resolve, reject) => {      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          console.error('Location error:', error);
          
          // Fallback to default location
          console.log('Using default location due to error');
          resolve(GOOGLE_MAPS_CONFIG.defaultLocation);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
      });
    } catch (error) {
      console.error('getCurrentLocation error:', error);
      return GOOGLE_MAPS_CONFIG.defaultLocation;
    }
  }

  /**
   * Watch location changes
   */
  watchLocation(
    onLocationChange: (location: LocationCoords) => void,
    onError?: (error: any) => void
  ): number {
    return Geolocation.watchPosition(
      (position) => {
        onLocationChange({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        console.error('Location watch error:', error);
        onError?.(error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10, // Update when moved 10 meters
        interval: 5000, // Update every 5 seconds
        fastestInterval: 2000, // Fastest update interval
      }
    );
  }

  /**
   * Stop watching location
   */
  stopWatchingLocation(watchId: number): void {
    Geolocation.clearWatch(watchId);
  }

  /**
   * Calculate distance between two points in kilometers
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export const locationService = new LocationService();
