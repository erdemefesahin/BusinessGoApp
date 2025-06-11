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
  Modal,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
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

  // Location and restaurant state
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [visitedRestaurants, setVisitedRestaurants] = useState<string[]>([]);

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    initializeLocation();
    startPulseAnimation();
  }, []);

  const initializeLocation = async () => {
    try {
      setLoading(true);
      const location = await locationService.getCurrentLocation();
      
      if (location) {
        setUserLocation(location);
        await fetchNearbyRestaurants(location);
      } else {
        // Use default location (Istanbul) if location fails
        const defaultLocation = {
          latitude: 41.0082,
          longitude: 28.9784
        };
        setUserLocation(defaultLocation);
        setRestaurants(mockRestaurants);
      }
    } catch (error) {
      console.error('Error initializing location:', error);
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
  };

  const handleRestaurantPress = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowRestaurantModal(true);
  };

  const handleVisitRestaurant = () => {
    if (selectedRestaurant) {
      setVisitedRestaurants(prev => [...prev, selectedRestaurant.id]);
      Alert.alert(
        'Restaurant Visited! 🎉',
        `You visited ${selectedRestaurant.name}! +10 points earned.`,
        [{ text: 'Awesome!', onPress: () => setShowRestaurantModal(false) }]
      );
    }
  };

  const handleRefreshLocation = () => {
    if (userLocation) {
      fetchNearbyRestaurants(userLocation);
    }
  };

  // Generate restaurant markers with proper coordinates
  const getRestaurantMarkers = () => {
    return restaurants.map((restaurant, index) => {
      let coordinates;
      
      if (restaurant.latitude && restaurant.longitude) {
        // Use real coordinates if available
        coordinates = {
          latitude: restaurant.latitude,
          longitude: restaurant.longitude,
        };
      } else if (userLocation) {
        // Generate random coordinates around user location for mock data
        const offset = 0.005; // Roughly 500m radius
        coordinates = {
          latitude: userLocation.latitude + (Math.random() - 0.5) * offset,
          longitude: userLocation.longitude + (Math.random() - 0.5) * offset,
        };
      } else {
        // Fallback coordinates
        coordinates = {
          latitude: 41.0082 + (Math.random() - 0.5) * 0.01,
          longitude: 28.9784 + (Math.random() - 0.5) * 0.01,
        };
      }

      return {
        ...restaurant,
        coordinates,
      };
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar barStyle="light-content" backgroundColor="#4169E1" />
        <LinearGradient
          colors={['#87CEEB', '#4169E1']}
          style={styles.loadingBackground}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Finding restaurants near you...</Text>
          <Text style={styles.loadingSubtext}>🍽️ Getting ready for your food adventure!</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4169E1" />
      
      {/* Google Maps */}
      {userLocation && (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
          scrollEnabled={true}
          zoomEnabled={true}
          rotateEnabled={false}
          pitchEnabled={false}>
          
          {/* Restaurant Markers on Map */}
          {getRestaurantMarkers().map((restaurant, index) => (
            <Marker
              key={restaurant.id || index}
              coordinate={restaurant.coordinates}
              onPress={() => handleRestaurantPress(restaurant)}>
              <Animated.View
                style={[
                  styles.mapMarker,
                  {
                    transform: [{ scale: pulseAnim }],
                  },
                  visitedRestaurants.includes(restaurant.id) && styles.visitedMarker,
                ]}>
                <View style={styles.markerContainer}>
                  <Text style={styles.markerEmoji}>
                    {getRestaurantEmoji(restaurant.types?.[0] || 'restaurant')}
                  </Text>
                  {visitedRestaurants.includes(restaurant.id) && (
                    <View style={styles.visitedBadge}>
                      <Text style={styles.visitedBadgeText}>✓</Text>
                    </View>
                  )}
                </View>
              </Animated.View>
            </Marker>
          ))}
        </MapView>
      )}

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.userInfo}>
          <TouchableOpacity style={styles.userAvatar} onPress={onCustomizeAvatar}>
            <View style={[styles.avatarPreview, { backgroundColor: currentAvatar.skinColor }]}>
              <Text style={styles.avatarPreviewFace}>{currentAvatar.face}</Text>
            </View>
            <View style={styles.editIconBadge}>
              <Text style={styles.editIcon}>✏️</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>Restaurant Explorer</Text>
            <Text style={styles.userLevel}>Level {Math.floor(visitedRestaurants.length / 3) + 1}</Text>
          </View>
        </View>
        
        <View style={styles.topBarActions}>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefreshLocation}>
            <Text style={styles.refreshIcon}>🔄</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuButton} onPress={onLogout}>
            <Text style={styles.menuIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom UI */}
      <View style={styles.bottomUI}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statValue}>{visitedRestaurants.length}</Text>
            <Text style={styles.statLabel}>Visited</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>📍</Text>
            <Text style={styles.statValue}>{restaurants.length}</Text>
            <Text style={styles.statLabel}>Nearby</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statValue}>{visitedRestaurants.length * 10}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={onCustomizeAvatar}>
            <LinearGradient
              colors={['#ff6b6b', '#ff8e53']}
              style={styles.actionButtonGradient}>
              <Text style={styles.actionButtonText}>👕</Text>
            </LinearGradient>
            <Text style={styles.actionButtonLabel}>Customize</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mainActionButton} onPress={handleRefreshLocation}>
            <LinearGradient
              colors={['#4ecdc4', '#44a08d']}
              style={styles.mainActionButtonGradient}>
              <Text style={styles.mainActionButtonText}>🍽️</Text>
              <Text style={styles.mainActionButtonLabel}>Find Food</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => mapRef.current?.animateToRegion({
            latitude: userLocation?.latitude || 41.0082,
            longitude: userLocation?.longitude || 28.9784,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          })}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.actionButtonGradient}>
              <Text style={styles.actionButtonText}>📍</Text>
            </LinearGradient>
            <Text style={styles.actionButtonLabel}>Center</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Tap restaurant markers to explore! 🗺️ • {restaurants.length} restaurants nearby
        </Text>
      </View>

      {/* Restaurant Modal */}
      <Modal
        visible={showRestaurantModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRestaurantModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedRestaurant && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalRestaurantEmoji}>
                    {getRestaurantEmoji(selectedRestaurant.types?.[0] || 'restaurant')}
                  </Text>
                  <Text style={styles.modalRestaurantName}>{selectedRestaurant.name}</Text>
                  {selectedRestaurant.rating && (
                    <Text style={styles.modalRestaurantRating}>
                      ⭐ {selectedRestaurant.rating.toFixed(1)}
                    </Text>
                  )}
                </View>

                <ScrollView style={styles.modalBody}>
                  {selectedRestaurant.address && (
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalInfoLabel}>📍 Address:</Text>
                      <Text style={styles.modalInfoText}>{selectedRestaurant.address}</Text>
                    </View>
                  )}

                  {selectedRestaurant.priceLevel && (
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalInfoLabel}>💰 Price:</Text>
                      <Text style={styles.modalInfoText}>
                        {getPriceLevelString(selectedRestaurant.priceLevel)}
                      </Text>
                    </View>
                  )}

                  {selectedRestaurant.types && selectedRestaurant.types.length > 0 && (
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalInfoLabel}>🍽️ Type:</Text>
                      <Text style={styles.modalInfoText}>
                        {selectedRestaurant.types[0].replace(/_/g, ' ').toUpperCase()}
                      </Text>
                    </View>
                  )}

                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalInfoLabel}>🎯 Status:</Text>
                    <Text style={[
                      styles.modalInfoText,
                      visitedRestaurants.includes(selectedRestaurant.id) && styles.visitedText
                    ]}>
                      {visitedRestaurants.includes(selectedRestaurant.id) ? 'Visited ✓' : 'Not visited yet'}
                    </Text>
                  </View>
                </ScrollView>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => setShowRestaurantModal(false)}>
                    <Text style={styles.modalCancelText}>Close</Text>
                  </TouchableOpacity>

                  {!visitedRestaurants.includes(selectedRestaurant.id) && (
                    <TouchableOpacity
                      style={styles.modalVisitButton}
                      onPress={handleVisitRestaurant}>
                      <LinearGradient
                        colors={['#4ecdc4', '#44a08d']}
                        style={styles.modalVisitGradient}>
                        <Text style={styles.modalVisitText}>Visit Restaurant 🍽️</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  map: {
    flex: 1,
  },
  // Map Markers
  mapMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerContainer: {
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
    position: 'relative',
  },
  visitedMarker: {
    opacity: 0.7,
  },
  markerEmoji: {
    fontSize: 28,
  },
  visitedBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#4ecdc4',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  visitedBadgeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  // Top Bar
  topBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    position: 'relative',
  },
  avatarPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  avatarPreviewFace: {
    fontSize: 18,
  },
  editIconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ff6b6b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    fontSize: 8,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  userLevel: {
    fontSize: 12,
    color: '#666',
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  refreshIcon: {
    fontSize: 24,
  },
  menuButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  menuIcon: {
    fontSize: 24,
  },
  // Bottom UI
  bottomUI: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  actionButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButtonText: {
    fontSize: 28,
  },
  actionButtonLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  mainActionButton: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  mainActionButtonGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  mainActionButtonText: {
    fontSize: 32,
  },
  mainActionButtonLabel: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 2,
  },
  // Instructions
  instructionsContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 5,
  },
  instructionsText: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    fontSize: 14,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    textAlign: 'center',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
    maxHeight: height * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 15,
  },
  modalRestaurantEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  modalRestaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalRestaurantRating: {
    fontSize: 16,
    color: '#666',
  },
  modalBody: {
    maxHeight: height * 0.4,
  },
  modalInfoRow: {
    marginBottom: 15,
  },
  modalInfoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  modalInfoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  visitedText: {
    color: '#4ecdc4',
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalCancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  modalVisitButton: {
    flex: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalVisitGradient: {
    padding: 15,
    alignItems: 'center',
  },
  modalVisitText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
