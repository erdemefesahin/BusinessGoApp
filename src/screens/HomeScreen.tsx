import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { AvatarConfig } from './AvatarCustomizationScreen';
import { 
  googlePlacesService, 
  mockRestaurants, 
  Restaurant, 
  getRestaurantEmoji, 
  getPriceLevelString 
} from '../services/googlePlaces';
import { locationService, LocationCoords } from '../services/locationService';

const { width, height } = Dimensions.get('window');

interface HomeScreenProps {
  onLogout: () => void;
  onCustomizeAvatar: () => void;
  userAvatar?: AvatarConfig;
}

const HomeScreen = ({ onLogout, onCustomizeAvatar, userAvatar }: HomeScreenProps) => {
  // Default avatar if none provided
  const defaultAvatar: AvatarConfig = {
    face: '😊',
    hairColor: '#8B4513',
    skinColor: '#FFE4B5',
    shirtColor: '#4169E1',
    pantsColor: '#2F4F4F',
    accessory: '',
    gender: 'male',
  };

  const currentAvatar = userAvatar || defaultAvatar;

  // UI State
  const [currentView, setCurrentView] = useState<'dashboard' | 'map'>('dashboard');
  
  // Location and restaurant state
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [visitedRestaurants, setVisitedRestaurants] = useState<string[]>([]);
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const mapRef = useRef<MapView>(null);
  useEffect(() => {
    initializeLocation();
    startPulseAnimation();
    startCharacterPulse();
  }, []);

  const startCharacterPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };
  const initializeLocation = async () => {
    try {
      setLoading(true);
      
      // Always use default location first to avoid crashes
      const defaultLocation = {
        latitude: 41.0082,
        longitude: 28.9784
      };
      setUserLocation(defaultLocation);
      setRestaurants(mockRestaurants);
      
      // Try to get real location but don't crash if it fails
      try {
        const location = await locationService.getCurrentLocation();
        if (location) {
          setUserLocation(location);
          await fetchNearbyRestaurants(location);
        }
      } catch (locationError) {
        console.log('Location service not available, using default location');
        // Keep using default location - no crash
      }
    } catch (error) {
      console.error('Error initializing location:', error);
      // Ensure we always have a valid location
      const defaultLocation = {
        latitude: 41.0082,
        longitude: 28.9784
      };
      setUserLocation(defaultLocation);
      setRestaurants(mockRestaurants);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyRestaurants = async (location: LocationCoords) => {
    try {
      const nearbyRestaurants = await googlePlacesService.searchNearbyRestaurants(
        location.latitude,
        location.longitude,
        2000 // 2km radius
      );

      if (nearbyRestaurants.length > 0) {
        setRestaurants(nearbyRestaurants);
      } else {
        // Fallback to mock data if no restaurants found
        setRestaurants(mockRestaurants);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setRestaurants(mockRestaurants);
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };  const handleRefreshLocation = async () => {
    if (userLocation) {
      await fetchNearbyRestaurants(userLocation);
      // Center map on user location with smooth animation
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }
    } else {
      // Re-initialize location if we don't have one
      await initializeLocation();
    }
  };
  // Real-time location tracking
  useEffect(() => {
    let locationWatcher: number | null = null;
    
    const startLocationTracking = async () => {
      try {
        const hasPermission = await locationService.requestLocationPermission();
        if (hasPermission && userLocation) {
          // Watch position changes
          locationWatcher = Geolocation.watchPosition(
            (position: any) => {
              const newLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              setUserLocation(newLocation);
              
              // Auto-refresh restaurants when location changes significantly
              const distance = calculateDistance(userLocation, newLocation);
              if (distance > 0.5) { // 500 meters
                fetchNearbyRestaurants(newLocation);
              }
            },
            (error: any) => {
              console.log('Location tracking error:', error);
            },
            {
              enableHighAccuracy: true,
              distanceFilter: 10, // Update every 10 meters
              interval: 5000, // Check every 5 seconds
              fastestInterval: 2000, // Fastest update interval
            }
          );
        }
      } catch (error) {
        console.error('Error starting location tracking:', error);
      }
    };

    startLocationTracking();

    // Cleanup
    return () => {
      if (locationWatcher) {
        Geolocation.clearWatch(locationWatcher);
      }
    };
  }, [userLocation]);
  // Calculate distance between two coordinates (in km)
  const calculateDistance = (point1: LocationCoords, point2: LocationCoords) => {
    const lat1 = point1.latitude;
    const lon1 = point1.longitude;
    const lat2 = point2.latitude;
    const lon2 = point2.longitude;

    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };
  // Navigation functions for dashboard cards
  const navigateToProfile = () => {
    try {
      onCustomizeAvatar();
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Unable to open profile. Please try again.');
    }
  };

  const navigateToTasks = () => {
    try {
      Alert.alert(
        'Tasks 📋', 
        'Daily challenges and achievements are coming soon!\n\n🎯 Visit restaurants to unlock rewards\n⭐ Complete challenges to level up',
        [{ text: 'Got it!' }]
      );
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const navigateToMap = () => {
    try {
      setCurrentView('map');
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Unable to open map. Please try again.');
    }
  };

  const navigateToStats = () => {
    try {
      const level = Math.floor(visitedRestaurants.length / 3) + 1;
      const pointsToNextLevel = (level * 3) - visitedRestaurants.length;
      
      Alert.alert(
        'Your Progress 📊',
        `🏆 Restaurants Visited: ${visitedRestaurants.length}\n📍 Nearby Restaurants: ${restaurants.length}\n⭐ Total Points: ${visitedRestaurants.length * 10}\n📊 Current Level: ${level}\n🎯 Visits to next level: ${pointsToNextLevel > 0 ? pointsToNextLevel : 'Level up ready!'}`,
        [{ text: 'Awesome!' }]
      );
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Unable to load stats. Please try again.');
    }
  };

  const backToDashboard = () => {
    setCurrentView('dashboard');
  };
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.loadingBackground}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading your dashboard...</Text>
          <Text style={styles.loadingSubtext}>🍽️ Setting up your restaurant adventure!</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render Dashboard View
  const renderDashboard = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.greetingText}>Welcome back,</Text>
          <Text style={styles.userNameText}>Restaurant Explorer!</Text>
          
          {/* User Avatar */}
          <TouchableOpacity style={styles.headerAvatar} onPress={onCustomizeAvatar}>
            <View style={[styles.avatarContainer, { backgroundColor: currentAvatar.skinColor }]}>
              <Text style={styles.avatarFace}>{currentAvatar.face}</Text>
            </View>
            <View style={styles.avatarBadge}>
              <Text style={styles.badgeText}>✏️</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStatsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{visitedRestaurants.length}</Text>
            <Text style={styles.statLabel}>Visited</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{restaurants.length}</Text>
            <Text style={styles.statLabel}>Nearby</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{Math.floor(visitedRestaurants.length / 3) + 1}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
        </View>

        {/* Main Dashboard Cards - 2x2 Grid */}
        <View style={styles.dashboardGrid}>
          {/* Profile Card */}
          <Pressable 
            style={styles.dashboardCard}
            onPress={navigateToProfile}
            android_ripple={{ color: '#E3F2FD' }}>
            <View style={[styles.cardIcon, { backgroundColor: '#E3F2FD' }]}>
              <Text style={styles.cardIconText}>👤</Text>
            </View>
            <Text style={styles.cardTitle}>Profile</Text>
            <Text style={styles.cardSubtitle}>Customize avatar</Text>
          </Pressable>

          {/* Tasks Card */}
          <Pressable 
            style={styles.dashboardCard}
            onPress={navigateToTasks}
            android_ripple={{ color: '#FFF3E0' }}>
            <View style={[styles.cardIcon, { backgroundColor: '#FFF3E0' }]}>
              <Text style={styles.cardIconText}>📋</Text>
            </View>
            <Text style={styles.cardTitle}>Tasks</Text>
            <Text style={styles.cardSubtitle}>Daily challenges</Text>
          </Pressable>

          {/* Map Card */}
          <Pressable 
            style={styles.dashboardCard}
            onPress={navigateToMap}
            android_ripple={{ color: '#E8F5E8' }}>
            <View style={[styles.cardIcon, { backgroundColor: '#E8F5E8' }]}>
              <Text style={styles.cardIconText}>🗺️</Text>
            </View>
            <Text style={styles.cardTitle}>Map</Text>
            <Text style={styles.cardSubtitle}>Explore restaurants</Text>
          </Pressable>

          {/* Stats Card */}
          <Pressable 
            style={styles.dashboardCard}
            onPress={navigateToStats}
            android_ripple={{ color: '#FFF8E1' }}>
            <View style={[styles.cardIcon, { backgroundColor: '#FFF8E1' }]}>
              <Text style={styles.cardIconText}>📊</Text>
            </View>
            <Text style={styles.cardTitle}>Stats</Text>
            <Text style={styles.cardSubtitle}>View progress</Text>
          </Pressable>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={navigateToMap}>
            <Text style={styles.primaryButtonText}>Find Restaurants</Text>
          </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => {
            try {
              Alert.alert(
                'Settings ⚙️',
                'What would you like to do?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Logout', 
                    style: 'destructive',
                    onPress: () => {
                      Alert.alert(
                        'Logout',
                        'Are you sure you want to logout?',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          { 
                            text: 'Logout', 
                            style: 'destructive',
                            onPress: onLogout 
                          }
                        ]
                      );
                    }
                  }
                ]
              );
            } catch (error) {
              console.error('Settings error:', error);
              // Fallback to direct logout
              onLogout();
            }
          }}>
            <Text style={styles.secondaryButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  // Render Map View
  const renderMapView = () => (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      
      {/* Map Header */}
      <View style={styles.mapHeader}>
        <TouchableOpacity style={styles.backButton} onPress={backToDashboard}>
          <Text style={styles.backButtonText}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.mapTitle}>Restaurant Map</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefreshLocation}>
          <Text style={styles.refreshButtonText}>📍</Text>
        </TouchableOpacity>
      </View>      {/* Google Maps */}
      {userLocation ? (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}
          region={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
          showsCompass={true}
          showsScale={true}
          showsBuildings={true}
          showsTraffic={false}
          loadingEnabled={true}
          onMapReady={() => {
            console.log('Map is ready');
          }}
          onUserLocationChange={(event) => {
            try {
              const { coordinate } = event.nativeEvent;
              if (coordinate) {
                setUserLocation({
                  latitude: coordinate.latitude,
                  longitude: coordinate.longitude,
                });
              }
            } catch (error) {
              console.error('Location update error:', error);
            }
          }}>
        
        {/* User Character Marker - Custom Avatar */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="You are here!"
            description="Your current location - Character follows you"
            anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.userCharacterMarker}>
              <Animated.View 
                style={[
                  styles.characterPulse,
                  {
                    transform: [{ scale: pulseAnim }],
                  },
                ]} 
              />
              <View style={[styles.avatarMarker, { backgroundColor: currentAvatar.skinColor }]}>
                <Text style={styles.avatarMarkerFace}>{currentAvatar.face}</Text>
              </View>
            </View>
          </Marker>
        )}
        
        {/* Restaurant Markers */}
        {restaurants.map((restaurant, index) => (
          <Marker
            key={restaurant.id || index}
            coordinate={{
              latitude: restaurant.latitude || (41.0082 + (Math.random() - 0.5) * 0.01),
              longitude: restaurant.longitude || (28.9784 + (Math.random() - 0.5) * 0.01),
            }}
            title={restaurant.name}
            description={`⭐ ${restaurant.rating}/5 • ${getPriceLevelString(restaurant.priceLevel)} • ${restaurant.vicinity}`}
            onPress={() => {
              try {
                Alert.alert(
                  restaurant.name,
                  `⭐ Rating: ${restaurant.rating}/5\n💰 Price: ${getPriceLevelString(restaurant.priceLevel)}\n📍 Address: ${restaurant.address || restaurant.vicinity}`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Visit', 
                      onPress: () => {
                        try {
                          if (!visitedRestaurants.includes(restaurant.id)) {
                            setVisitedRestaurants([...visitedRestaurants, restaurant.id]);
                            Alert.alert('Congratulations! 🎉', `You visited ${restaurant.name}! Keep exploring to level up!`);
                          } else {
                            Alert.alert('Already Visited ✅', `You've been to ${restaurant.name} before. Discover new places to earn more points!`);
                          }
                        } catch (error) {
                          console.error('Visit restaurant error:', error);
                        }
                      }
                    }
                  ]
                );
              } catch (error) {
                console.error('Restaurant marker error:', error);
              }
            }}>
            <View style={styles.customMarker}>
              <Text style={styles.markerEmoji}>
                {getRestaurantEmoji(restaurant.types?.[0] || 'restaurant')}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>
      ) : (
        <View style={[styles.mapView, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }]}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 20, color: '#666', fontSize: 16 }}>Loading Map...</Text>
        </View>
      )}

      {/* Map Bottom Info */}
      <View style={styles.mapBottomInfo}>
        <Text style={styles.mapInfoText}>
          🚶‍♂️ Character follows you! • 🍽️ {restaurants.length} restaurants nearby
        </Text>
      </View>
    </View>
  );

  return currentView === 'dashboard' ? renderDashboard() : renderMapView();
};

const styles = StyleSheet.create({
  // Base container styles
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#007AFF',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.8,
  },

  // Dashboard styles
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 30,
    position: 'relative',
  },
  greetingText: {
    fontSize: 24,
    color: '#666',
    textAlign: 'center',
  },
  userNameText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 5,
  },
  headerAvatar: {
    position: 'absolute',
    top: 10,
    right: 0,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarFace: {
    fontSize: 28,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
  },

  // Quick stats styles
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 25,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },

  // Dashboard grid styles
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  dashboardCard: {
    width: (width - 60) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardIconText: {
    fontSize: 28,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },

  // Quick actions styles
  quickActionsContainer: {
    gap: 15,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Map view styles
  mapHeader: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
  },
  backButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },  mapTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  refreshButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  refreshButtonText: {
    fontSize: 20,
    color: '#ffffff',
  },
  mapView: {
    flex: 1,
  },
  mapBottomInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  mapInfoText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
  },

  // Map marker styles
  customMarker: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#4ecdc4',
  },
  userCharacterMarker: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarMarker: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 2,
  },
  avatarMarkerFace: {
    fontSize: 24,
  },
  characterPulse: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(66, 184, 239, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(66, 184, 239, 0.6)',
    zIndex: 1,
  },
  markerEmoji: {
    fontSize: 28,
  },});

export default HomeScreen;
