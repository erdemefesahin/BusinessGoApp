import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface AnalyticsScreenProps {
  onBack?: () => void;
}

const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ onBack }) => {
  const analyticsData = [
    { label: 'Tasks Completed', value: '24', trend: '+12%' },
    { label: 'XP Earned', value: '2,750', trend: '+8%' },
    { label: 'Streak Days', value: '7', trend: '+2 days' },
    { label: 'Level Progress', value: '75%', trend: '+15%' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#3498DB', '#5DADE2']}
        style={styles.header}
      >
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSubtitle}>Track your progress</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.analyticsGrid}>
          {analyticsData.map((item, index) => (
            <View key={index} style={styles.analyticsCard}>
              <Text style={styles.analyticsValue}>{item.value}</Text>
              <Text style={styles.analyticsLabel}>{item.label}</Text>
              <Text style={styles.analyticsTrend}>{item.trend}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.comingSoonCard}>
          <Text style={styles.comingSoonTitle}>📊 Detailed Analytics Coming Soon!</Text>
          <Text style={styles.comingSoonText}>
            We're working on comprehensive charts and insights to help you track your business growth.
          </Text>
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
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 30,
  },
  analyticsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  analyticsLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 5,
  },
  analyticsTrend: {
    fontSize: 12,
    color: '#27AE60',
    fontWeight: '600',
  },
  comingSoonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AnalyticsScreen;
