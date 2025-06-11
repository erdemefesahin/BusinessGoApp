import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

interface AvatarCustomizationScreenProps {
  onBack: () => void;
  onSaveAvatar: (avatar: AvatarConfig) => void;
  currentAvatar?: AvatarConfig;
}

export interface AvatarConfig {
  face: string;
  hairColor: string;
  skinColor: string;
  shirtColor: string;
  pantsColor: string;
  accessory: string;
  gender: 'male' | 'female';
}

const AvatarCustomizationScreen = ({ 
  onBack, 
  onSaveAvatar, 
  currentAvatar 
}: AvatarCustomizationScreenProps) => {
  const [avatar, setAvatar] = useState<AvatarConfig>(currentAvatar || {
    face: '😊',
    hairColor: '#8B4513',
    skinColor: '#FFE4B5',
    shirtColor: '#4169E1',
    pantsColor: '#2F4F4F',
    accessory: '',
    gender: 'male',
  });

  const previewAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Preview avatar animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(previewAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(previewAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const faces = ['😊', '😄', '😎', '🤓', '😴', '🤗', '🥰', '🤔', '😋', '🤩'];
  const hairColors = ['#8B4513', '#FFD700', '#FF4500', '#000000', '#696969', '#DDA0DD'];
  const skinColors = ['#FFE4B5', '#F5DEB3', '#DEB887', '#D2B48C', '#CD853F', '#A0522D'];
  const shirtColors = ['#4169E1', '#FF6B6B', '#32CD32', '#FFD700', '#FF1493', '#00CED1'];
  const pantsColors = ['#2F4F4F', '#000080', '#8B4513', '#556B2F', '#800000', '#483D8B'];
  const accessories = ['', '🎩', '👓', '🕶️', '🎯', '⭐'];

  const handleSave = () => {
    onSaveAvatar(avatar);
    onBack();
  };

  const renderColorPicker = (
    colors: string[], 
    currentColor: string, 
    onSelect: (color: string) => void,
    title: string
  ) => (
    <View style={styles.customizationSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.colorPicker}>
        {colors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              currentColor === color && styles.selectedColor
            ]}
            onPress={() => onSelect(color)}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderFacePicker = () => (
    <View style={styles.customizationSection}>
      <Text style={styles.sectionTitle}>Face Expression</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.facePicker}>
        {faces.map((face, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.faceOption,
              avatar.face === face && styles.selectedFace
            ]}
            onPress={() => setAvatar(prev => ({ ...prev, face }))}>
            <Text style={styles.faceEmoji}>{face}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderAccessoryPicker = () => (
    <View style={styles.customizationSection}>
      <Text style={styles.sectionTitle}>Accessories</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.accessoryPicker}>
        {accessories.map((accessory, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.accessoryOption,
              avatar.accessory === accessory && styles.selectedAccessory
            ]}
            onPress={() => setAvatar(prev => ({ ...prev, accessory }))}>
            <Text style={styles.accessoryEmoji}>
              {accessory || '❌'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPreviewAvatar = () => (
    <Animated.View
      style={[
        styles.previewAvatarContainer,
        {
          transform: [
            {
              scale: previewAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.1],
              }),
            },
            {
              rotateY: rotateAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: ['0deg', '10deg', '0deg'],
              }),
            },
          ],
        },
      ]}>
      
      {/* Avatar Shadow */}
      <View style={styles.previewAvatarShadow} />
      
      {/* Avatar Body */}
      <View style={styles.previewAvatar}>
        {/* Accessory (rendered behind head for hats) */}
        {avatar.accessory && avatar.accessory !== '👓' && avatar.accessory !== '🕶️' && (
          <View style={styles.previewAccessoryBack}>
            <Text style={styles.previewAccessoryText}>{avatar.accessory}</Text>
          </View>
        )}
        
        {/* Head */}
        <View style={[styles.previewAvatarHead, { backgroundColor: avatar.skinColor }]}>
          {/* Hair */}
          <View style={[styles.previewHair, { backgroundColor: avatar.hairColor }]} />
          
          {/* Face */}
          <Text style={styles.previewAvatarFace}>{avatar.face}</Text>
          
          {/* Glasses/Sunglasses accessory */}
          {(avatar.accessory === '👓' || avatar.accessory === '🕶️') && (
            <View style={styles.previewAccessoryFront}>
              <Text style={styles.previewAccessoryText}>{avatar.accessory}</Text>
            </View>
          )}
        </View>
        
        {/* Body */}
        <View style={styles.previewAvatarBody}>
          <View style={[styles.previewAvatarTorso, { backgroundColor: avatar.shirtColor }]} />
          <View style={[styles.previewAvatarLegs, { backgroundColor: avatar.pantsColor }]} />
        </View>
      </View>
      
      {/* Avatar Ring */}
      <Animated.View
        style={[
          styles.previewAvatarRing,
          {
            transform: [
              {
                scale: previewAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.2],
                }),
              },
            ],
          },
        ]}
      />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.backgroundGradient}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Customize Avatar</Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Preview Section */}
        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>Preview</Text>
          {renderPreviewAvatar()}
        </View>

        {/* Customization Options */}
        <ScrollView style={styles.customizationContainer}>
          {/* Gender Selection */}
          <View style={styles.customizationSection}>
            <Text style={styles.sectionTitle}>Gender</Text>
            <View style={styles.genderSelection}>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  avatar.gender === 'male' && styles.selectedGender
                ]}
                onPress={() => setAvatar(prev => ({ ...prev, gender: 'male' }))}>
                <Text style={styles.genderText}>👨 Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  avatar.gender === 'female' && styles.selectedGender
                ]}
                onPress={() => setAvatar(prev => ({ ...prev, gender: 'female' }))}>
                <Text style={styles.genderText}>👩 Female</Text>
              </TouchableOpacity>
            </View>
          </View>

          {renderFacePicker()}
          
          {renderColorPicker(
            hairColors, 
            avatar.hairColor, 
            (color) => setAvatar(prev => ({ ...prev, hairColor: color })),
            'Hair Color'
          )}
          
          {renderColorPicker(
            skinColors, 
            avatar.skinColor, 
            (color) => setAvatar(prev => ({ ...prev, skinColor: color })),
            'Skin Color'
          )}
          
          {renderColorPicker(
            shirtColors, 
            avatar.shirtColor, 
            (color) => setAvatar(prev => ({ ...prev, shirtColor: color })),
            'Shirt Color'
          )}
          
          {renderColorPicker(
            pantsColors, 
            avatar.pantsColor, 
            (color) => setAvatar(prev => ({ ...prev, pantsColor: color })),
            'Pants Color'
          )}

          {renderAccessoryPicker()}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  previewSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  previewAvatarContainer: {
    width: 120,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewAvatarShadow: {
    position: 'absolute',
    bottom: -10,
    left: 10,
    width: 100,
    height: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 50,
    transform: [{ scaleX: 1.2 }],
  },
  previewAvatar: {
    flex: 1,
    alignItems: 'center',
  },
  previewAvatarHead: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 2,
    position: 'relative',
  },
  previewHair: {
    position: 'absolute',
    top: -15,
    left: -5,
    width: 70,
    height: 40,
    borderRadius: 35,
    zIndex: -1,
  },
  previewAvatarFace: {
    fontSize: 24,
  },
  previewAccessoryBack: {
    position: 'absolute',
    top: -20,
    zIndex: 1,
  },
  previewAccessoryFront: {
    position: 'absolute',
    top: 10,
    zIndex: 3,
  },
  previewAccessoryText: {
    fontSize: 20,
  },
  previewAvatarBody: {
    alignItems: 'center',
    marginTop: -10,
  },
  previewAvatarTorso: {
    width: 50,
    height: 40,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  previewAvatarLegs: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginTop: 5,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  previewAvatarRing: {
    position: 'absolute',
    top: -20,
    left: -20,
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  customizationContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
  },
  customizationSection: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  genderSelection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  genderOption: {
    flex: 1,
    paddingVertical: 15,
    marginHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    alignItems: 'center',
  },
  selectedGender: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 2,
    borderColor: '#fff',
  },
  genderText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  colorPicker: {
    flexDirection: 'row',
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectedColor: {
    borderWidth: 4,
    borderColor: '#fff',
    transform: [{ scale: 1.1 }],
  },
  facePicker: {
    flexDirection: 'row',
  },
  faceOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectedFace: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderColor: '#fff',
    transform: [{ scale: 1.1 }],
  },
  faceEmoji: {
    fontSize: 24,
  },
  accessoryPicker: {
    flexDirection: 'row',
  },
  accessoryOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectedAccessory: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderColor: '#fff',
    transform: [{ scale: 1.1 }],
  },
  accessoryEmoji: {
    fontSize: 20,
  },
});

export default AvatarCustomizationScreen;
