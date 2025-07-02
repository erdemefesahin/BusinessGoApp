import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface SettingsScreenProps {
  onBack?: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

  const settingsItems = [
    {
      section: 'Preferences',
      items: [
        {
          title: 'Push Notifications',
          subtitle: 'Receive updates about tasks and achievements',
          value: notifications,
          onToggle: setNotifications,
          type: 'switch' as const
        },
        {
          title: 'Sound Effects',
          subtitle: 'Play sounds for achievements and interactions',
          value: soundEffects,
          onToggle: setSoundEffects,
          type: 'switch' as const
        },
        {
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme (Coming Soon)',
          value: darkMode,
          onToggle: setDarkMode,
          type: 'switch' as const
        },
        {
          title: 'Location Services',
          subtitle: 'Enable location for map features',
          value: locationServices,
          onToggle: setLocationServices,
          type: 'switch' as const
        },
      ]
    },
    {
      section: 'Account',
      items: [
        {
          title: 'Edit Profile',
          subtitle: 'Update your business information',
          type: 'button' as const,
          onPress: () => Alert.alert('Edit Profile', 'Profile editing coming soon!')
        },
        {
          title: 'Privacy Settings',
          subtitle: 'Manage your data and privacy',
          type: 'button' as const,
          onPress: () => Alert.alert('Privacy', 'Privacy settings coming soon!')
        },
        {
          title: 'Backup & Sync',
          subtitle: 'Keep your data safe across devices',
          type: 'button' as const,
          onPress: () => Alert.alert('Backup', 'Backup features coming soon!')
        },
      ]
    },
    {
      section: 'Support',
      items: [
        {
          title: 'Help Center',
          subtitle: 'Get answers to common questions',
          type: 'button' as const,
          onPress: () => Alert.alert('Help', 'Help center coming soon!')
        },
        {
          title: 'Contact Support',
          subtitle: 'Reach out to our support team',
          type: 'button' as const,
          onPress: () => Alert.alert('Contact', 'Support contact coming soon!')
        },
        {
          title: 'Rate App',
          subtitle: 'Help us improve BusinessGo',
          type: 'button' as const,
          onPress: () => Alert.alert('Rate App', 'Thank you for your support!')
        },
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#34495E', '#2C3E50']}
        style={styles.header}
      >
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your experience</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {settingsItems.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>
                {item.type === 'switch' ? (
                  <Switch
                    value={item.value as boolean}
                    onValueChange={item.onToggle}
                    trackColor={{ false: '#BDC3C7', true: '#3498DB' }}
                    thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.settingButton}
                    onPress={item.onPress}
                  >
                    <Text style={styles.settingButtonText}>→</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        ))}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutTitle}>BusinessGo</Text>
            <Text style={styles.aboutVersion}>Version 1.0.0</Text>
            <Text style={styles.aboutDescription}>
              Empowering entrepreneurs with gamified business productivity tools.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 18,
  },
  settingButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ECF0F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingButtonText: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: 'bold',
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  aboutVersion: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 15,
  },
  aboutDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SettingsScreen;
