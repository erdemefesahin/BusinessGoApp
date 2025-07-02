import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

interface HomeScreenProps {
  onLogout: () => void;
  onNavigateToMap?: () => void;
  onNavigateToDailyTasks?: () => void;
  onNavigateToMyBusiness?: () => void;
  onNavigateToLeaderboard?: () => void;
  onNavigateToAnalytics?: () => void;
  onNavigateToProgress?: () => void;
  onNavigateToSettings?: () => void;
}

interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  completedTasks: number;
  businessRank: number;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onLogout, 
  onNavigateToMap, 
  onNavigateToDailyTasks, 
  onNavigateToMyBusiness, 
  onNavigateToLeaderboard, 
  onNavigateToAnalytics,
  onNavigateToProgress,
  onNavigateToSettings
}) => {
  const [userStats, setUserStats] = useState<UserStats>({
    level: 3,
    xp: 750,
    xpToNextLevel: 1000,
    totalXp: 2750,
    completedTasks: 24,
    businessRank: 152,
  });

  const [userName] = useState("Alex");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const showFeatureComingSoon = (feature: string) => {
    Alert.alert(
      `${feature}`,
      `This feature is coming soon! Your business journey is about to get even more exciting.`,
      [{ text: 'Got it!', style: 'default' }]
    );
  };

  const dashboardCards = [
    {
      id: 1,
      title: 'Business Map',
      icon: '🗺️',
      color: ['#50C878', '#7FD99F'],
      description: 'Explore opportunities',
      onPress: () => {
        if (onNavigateToMap) {
          onNavigateToMap();
        } else {
          showFeatureComingSoon('Business Map');
        }
      }
    },
    {
      id: 2,
      title: 'Daily Missions',
      icon: '🎯',
      color: ['#4A90E2', '#7BB3F0'],
      description: 'Complete challenges',
      onPress: () => {
        if (onNavigateToDailyTasks) {
          onNavigateToDailyTasks();
        } else {
          showFeatureComingSoon('Daily Missions');
        }
      }
    },
    {
      id: 3,
      title: 'Progress',
      icon: '�',
      color: ['#9B59B6', '#8E44AD'],
      description: 'Track your journey',
      onPress: () => {
        if (onNavigateToProgress) {
          onNavigateToProgress();
        } else {
          showFeatureComingSoon('Progress');
        }
      }
    },
    {
      id: 4,
      title: 'Settings',
      icon: '⚙️',
      color: ['#34495E', '#2C3E50'],
      description: 'Customize your app',
      onPress: () => {
        if (onNavigateToSettings) {
          onNavigateToSettings();
        } else {
          showFeatureComingSoon('Settings');
        }
      }
    },
  ];

  const achievements = [
    { icon: '🎉', title: 'First Sale', unlocked: true },
    { icon: '📈', title: 'Growth Master', unlocked: true },
    { icon: '🔥', title: 'Streak Hero', unlocked: false },
    { icon: '💎', title: 'Elite Business', unlocked: false },
  ];

  const xpPercentage = (userStats.xp / userStats.xpToNextLevel) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        
        <Animated.View 
          style={[
            styles.header,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
          
          {/* User Greeting */}
          <View style={styles.greetingSection}>
            <Text style={styles.greetingText}>Welcome back,</Text>
            <Text style={styles.userName}>{userName}! 👋</Text>
          </View>

          {/* Level Progress */}
          <View style={styles.levelSection}>
            <View style={styles.levelInfo}>
              <Text style={styles.levelText}>Level {userStats.level}</Text>
              <Text style={styles.xpText}>{userStats.xp}/{userStats.xpToNextLevel} XP</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <Animated.View 
                  style={[
                    styles.progressBarFill,
                    { width: `${xpPercentage}%` }
                  ]} 
                />
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.completedTasks}</Text>
              <Text style={styles.statLabel}>Tasks Done</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>#{userStats.businessRank}</Text>
              <Text style={styles.statLabel}>Rank</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.totalXp}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Dashboard Grid */}
        <Animated.View 
          style={[
            styles.dashboardSection,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
          <Text style={styles.sectionTitle}>Your Business Hub</Text>
          
          <View style={styles.cardGrid}>
            {dashboardCards.map((card, index) => (
              <Animated.View
                key={card.id}
                style={[
                  styles.cardWrapper,
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateY: Animated.add(slideAnim, new Animated.Value(index * 10))
                    }]
                  }
                ]}>
                <TouchableOpacity 
                  style={styles.dashboardCard}
                  onPress={card.onPress}
                  activeOpacity={0.8}>
                  <LinearGradient
                    colors={card.color}
                    style={styles.cardGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}>
                    
                    <Text style={styles.cardIcon}>{card.icon}</Text>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                    <Text style={styles.cardDescription}>{card.description}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Recent Achievements */}
        <Animated.View 
          style={[
            styles.achievementsSection,
            { opacity: fadeAnim }
          ]}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {achievements.map((achievement, index) => (
              <View 
                key={index}
                style={[
                  styles.achievementCard,
                  !achievement.unlocked && styles.achievementCardLocked
                ]}>
                <Text style={[
                  styles.achievementIcon,
                  !achievement.unlocked && styles.achievementIconLocked
                ]}>
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </Text>
                <Text style={[
                  styles.achievementTitle,
                  !achievement.unlocked && styles.achievementTitleLocked
                ]}>
                  {achievement.title}
                </Text>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => {
                Alert.alert(
                  'Add Task',
                  'Create a new business task to track your progress!',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Coming Soon', style: 'default' }
                  ]
                );
              }}>
              <Text style={styles.quickActionIcon}>➕</Text>
              <Text style={styles.quickActionText}>Add Task</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => {
                if (onNavigateToAnalytics) {
                  onNavigateToAnalytics();
                } else {
                  showFeatureComingSoon('View Analytics');
                }
              }}>
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={styles.quickActionText}>Analytics</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => {
                Alert.alert(
                  'Share Progress',
                  'Share your business achievements with friends and fellow entrepreneurs!',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Share via...', style: 'default' }
                  ]
                );
              }}>
              <Text style={styles.quickActionIcon}>📤</Text>
              <Text style={styles.quickActionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={onLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerGradient: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  greetingSection: {
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 5,
  },
  levelSection: {
    marginBottom: 20,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  xpText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  progressBarContainer: {
    marginBottom: 10,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    paddingVertical: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dashboardSection: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: (width - 60) / 2,
    marginBottom: 20,
  },
  dashboardCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  achievementsSection: {
    marginTop: 30,
    marginBottom: 30,
  },
  achievementCard: {
    width: 100,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  achievementCardLocked: {
    backgroundColor: '#F0F0F0',
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementIconLocked: {
    opacity: 0.5,
  },
  achievementTitle: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '600',
    color: '#2C3E50',
  },
  achievementTitleLocked: {
    color: '#A0A0A0',
  },
  quickActionsSection: {
    marginBottom: 30,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickActionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    minWidth: 80,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
  logoutSection: {
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default HomeScreen;
