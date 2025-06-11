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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
  const [visitedRestaurants, setVisitedRestaurants] = useState<string[]>([]);

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

  const handleRefreshLocation = () => {
    if (userLocation) {
      fetchNearbyRestaurants(userLocation);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar barStyle="light-content" backgroundColor="#4169E1" />
        <LinearGradient
          colors={['#87CEEB', '#4169E1']}
          style={styles.loadingBackground}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Restoran bulunuyor...</Text>
          <Text style={styles.loadingSubtext}>🍽️ Yemek maceranız için hazırlanıyor!</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4169E1" />
      
      {/* Geçici Harita Arka Planı */}
      <LinearGradient
        colors={['#87CEEB', '#4169E1', '#9370DB']}
        style={styles.mapBackground}>
        
        {/* Restoran Markerları */}
        {restaurants.map((restaurant, index) => (
          <TouchableOpacity
            key={restaurant.id || index}
            style={[
              styles.restaurantMarker,
              {
                left: (index * 100 + 50) % (width - 100),
                top: 200 + (index * 80) % (height - 400),
              }
            ]}
            onPress={() => {
              Alert.alert(
                restaurant.name,
                `📍 ${restaurant.address || restaurant.vicinity}`,
                [{ text: 'Tamam' }]
              );
            }}>
            <Animated.View
              style={[
                styles.markerContainer,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}>
              <Text style={styles.markerEmoji}>
                {getRestaurantEmoji(restaurant.types?.[0] || 'restaurant')}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </LinearGradient>

      {/* Üst Bar */}
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
            <Text style={styles.userName}>Restoran Kaşifi</Text>
            <Text style={styles.userLevel}>Seviye {Math.floor(visitedRestaurants.length / 3) + 1}</Text>
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

      {/* Alt UI */}
      <View style={styles.bottomUI}>
        {/* İstatistikler */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statValue}>{visitedRestaurants.length}</Text>
            <Text style={styles.statLabel}>Ziyaret</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>📍</Text>
            <Text style={styles.statValue}>{restaurants.length}</Text>
            <Text style={styles.statLabel}>Yakın</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statValue}>{visitedRestaurants.length * 10}</Text>
            <Text style={styles.statLabel}>Puan</Text>
          </View>
        </View>

        {/* Aksiyon Butonları */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={onCustomizeAvatar}>
            <LinearGradient
              colors={['#ff6b6b', '#ff8e53']}
              style={styles.actionButtonGradient}>
              <Text style={styles.actionButtonText}>👕</Text>
            </LinearGradient>
            <Text style={styles.actionButtonLabel}>Özelleştir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mainActionButton} onPress={handleRefreshLocation}>
            <LinearGradient
              colors={['#4ecdc4', '#44a08d']}
              style={styles.mainActionButtonGradient}>
              <Text style={styles.mainActionButtonText}>🍽️</Text>
              <Text style={styles.mainActionButtonLabel}>Yemek Bul</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => {
            Alert.alert('Konum', 'Konumunuz: ' + (userLocation ? `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}` : 'Bilinmiyor'));
          }}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.actionButtonGradient}>
              <Text style={styles.actionButtonText}>📍</Text>
            </LinearGradient>
            <Text style={styles.actionButtonLabel}>Konum</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Talimatlar */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Restoran işaretçilerine dokunarak keşfedin! 🗺️ • {restaurants.length} restoran yakınınızda
        </Text>
      </View>
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
  mapBackground: {
    flex: 1,
    position: 'relative',
  },
  restaurantMarker: {
    position: 'absolute',
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
  },
  markerEmoji: {
    fontSize: 28,
  },
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
});

export default HomeScreen;
