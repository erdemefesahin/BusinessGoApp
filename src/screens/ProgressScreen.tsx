import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Alert,
  Modal,
} from 'react-native';

const { width } = Dimensions.get('window');

interface ProgressScreenProps {
  onBack?: () => void;
}

interface DailyStats {
  tasksCompleted: number;
  totalTasks: number;
  successRate: number;
  dailyStreak: number;
  weeklyGoal: number;
  weeklyCompleted: number;
  totalXP: number;
  level: number;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  icon: string;
  deadline: string;
}

const ProgressScreen: React.FC<ProgressScreenProps> = ({ onBack }) => {
  const [stats, setStats] = useState<DailyStats>({
    tasksCompleted: 3,
    totalTasks: 5,
    successRate: 85,
    dailyStreak: 7,
    weeklyGoal: 25,
    weeklyCompleted: 18,
    totalXP: 2850,
    level: 4,
    achievements: [
      {
        id: '1',
        title: 'First Steps',
        description: 'Complete your first business task',
        icon: '🎯',
        unlocked: true,
        progress: 1,
        maxProgress: 1
      },
      {
        id: '2',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        unlocked: true,
        progress: 7,
        maxProgress: 7
      },
      {
        id: '3',
        title: 'Network Master',
        description: 'Complete 10 networking tasks',
        icon: '🤝',
        unlocked: false,
        progress: 6,
        maxProgress: 10
      },
      {
        id: '4',
        title: 'Business Guru',
        description: 'Reach level 5',
        icon: '👑',
        unlocked: false,
        progress: 4,
        maxProgress: 5
      }
    ]
  });

  const [challenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Weekly Hustle',
      description: 'Complete 25 tasks this week',
      target: 25,
      current: 18,
      reward: 500,
      icon: '⚡',
      deadline: '3 days left'
    },
    {
      id: '2',
      title: 'Networking Ninja',
      description: 'Attend 5 networking events',
      target: 5,
      current: 2,
      reward: 300,
      icon: '🥷',
      deadline: '1 week left'
    }
  ]);

  const [selectedTab, setSelectedTab] = useState<'overview' | 'achievements' | 'challenges'>('overview');
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: stats.tasksCompleted / stats.totalTasks,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();
  }, [stats]);

  const getProgressPercentage = () => {
    return Math.round((stats.tasksCompleted / stats.totalTasks) * 100);
  };

  const getXPToNextLevel = () => {
    const baseXP = 1000;
    const nextLevelXP = baseXP * stats.level;
    const currentLevelXP = baseXP * (stats.level - 1);
    const progress = stats.totalXP - currentLevelXP;
    const needed = nextLevelXP - currentLevelXP;
    return { progress, needed, percentage: (progress / needed) * 100 };
  };

  const updateWeeklyGoal = () => {
    Alert.prompt(
      'Set Weekly Goal',
      `Current goal: ${stats.weeklyGoal} tasks`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: (text) => {
            const newGoal = parseInt(text || '0');
            if (newGoal > 0 && newGoal <= 50) {
              setStats(prev => ({ ...prev, weeklyGoal: newGoal }));
              Alert.alert('Success', `Weekly goal updated to ${newGoal} tasks!`);
            } else {
              Alert.alert('Error', 'Please enter a valid goal (1-50 tasks)');
            }
          }
        }
      ],
      'plain-text',
      stats.weeklyGoal.toString()
    );
  };

  const renderOverview = () => (
    <ScrollView style={styles.tabContent}>
      {/* Progress Circle */}
      <Animated.View style={[styles.progressSection, { opacity: fadeAnim }]}>
        <View style={styles.progressCard}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <View style={styles.progressCircle}>
            <View style={styles.progressInner}>
              <Text style={styles.progressPercentage}>{getProgressPercentage()}%</Text>
              <Text style={styles.progressLabel}>Complete</Text>
            </View>
          </View>
          <Text style={styles.progressText}>
            {stats.tasksCompleted} of {stats.totalTasks} tasks completed
          </Text>
        </View>
      </Animated.View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#27AE60' }]}>
            <Text style={styles.statIconText}>✅</Text>
          </View>
          <Text style={styles.statNumber}>{stats.tasksCompleted}</Text>
          <Text style={styles.statLabel}>Tasks Completed</Text>
          <Text style={styles.statSubtext}>Today</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#3498DB' }]}>
            <Text style={styles.statIconText}>📈</Text>
          </View>
          <Text style={styles.statNumber}>{stats.successRate}%</Text>
          <Text style={styles.statLabel}>Success Rate</Text>
          <Text style={styles.statSubtext}>This Month</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#E74C3C' }]}>
            <Text style={styles.statIconText}>🔥</Text>
          </View>
          <Text style={styles.statNumber}>{stats.dailyStreak}</Text>
          <Text style={styles.statLabel}>Daily Streak</Text>
          <Text style={styles.statSubtext}>Days</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#F39C12' }]}>
            <Text style={styles.statIconText}>⭐</Text>
          </View>
          <Text style={styles.statNumber}>{stats.totalXP}</Text>
          <Text style={styles.statLabel}>Total XP</Text>
          <Text style={styles.statSubtext}>Level {stats.level}</Text>
        </View>
      </View>

      {/* Weekly Goal */}
      <View style={styles.weeklySection}>
        <View style={styles.weeklyHeader}>
          <Text style={styles.sectionTitle}>Weekly Goal</Text>
          <TouchableOpacity onPress={updateWeeklyGoal} style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.weeklyCard}>
          <View style={styles.weeklyProgress}>
            <View style={styles.weeklyProgressBar}>
              <View 
                style={[
                  styles.weeklyProgressFill,
                  { width: `${(stats.weeklyCompleted / stats.weeklyGoal) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.weeklyProgressText}>
              {stats.weeklyCompleted} / {stats.weeklyGoal} tasks
            </Text>
          </View>
        </View>
      </View>

      {/* Level Progress */}
      <View style={styles.levelSection}>
        <Text style={styles.sectionTitle}>Level Progress</Text>
        <View style={styles.levelCard}>
          <View style={styles.levelInfo}>
            <Text style={styles.currentLevel}>Level {stats.level}</Text>
            <Text style={styles.nextLevel}>Level {stats.level + 1}</Text>
          </View>
          <View style={styles.levelProgressBar}>
            <View 
              style={[
                styles.levelProgressFill,
                { width: `${getXPToNextLevel().percentage}%` }
              ]}
            />
          </View>
          <Text style={styles.levelProgressText}>
            {getXPToNextLevel().progress} / {getXPToNextLevel().needed} XP
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderAchievements = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Achievements</Text>
      {stats.achievements.map((achievement) => (
        <View key={achievement.id} style={styles.achievementCard}>
          <View style={[
            styles.achievementIcon,
            { backgroundColor: achievement.unlocked ? '#27AE60' : '#BDC3C7' }
          ]}>
            <Text style={styles.achievementIconText}>{achievement.icon}</Text>
          </View>
          <View style={styles.achievementInfo}>
            <Text style={[
              styles.achievementTitle,
              { color: achievement.unlocked ? '#2C3E50' : '#7F8C8D' }
            ]}>
              {achievement.title}
            </Text>
            <Text style={styles.achievementDescription}>{achievement.description}</Text>
            <View style={styles.achievementProgress}>
              <View style={styles.achievementProgressBar}>
                <View 
                  style={[
                    styles.achievementProgressFill,
                    { 
                      width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                      backgroundColor: achievement.unlocked ? '#27AE60' : '#3498DB'
                    }
                  ]}
                />
              </View>
              <Text style={styles.achievementProgressText}>
                {achievement.progress} / {achievement.maxProgress}
              </Text>
            </View>
          </View>
          {achievement.unlocked && (
            <View style={styles.unlockedBadge}>
              <Text style={styles.unlockedBadgeText}>✓</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );

  const renderChallenges = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Active Challenges</Text>
      {challenges.map((challenge) => (
        <View key={challenge.id} style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <View style={[styles.challengeIcon, { backgroundColor: '#9B59B6' }]}>
              <Text style={styles.challengeIconText}>{challenge.icon}</Text>
            </View>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengeDescription}>{challenge.description}</Text>
            </View>
            <View style={styles.challengeReward}>
              <Text style={styles.challengeRewardText}>+{challenge.reward} XP</Text>
            </View>
          </View>
          <View style={styles.challengeProgress}>
            <View style={styles.challengeProgressBar}>
              <View 
                style={[
                  styles.challengeProgressFill,
                  { width: `${(challenge.current / challenge.target) * 100}%` }
                ]}
              />
            </View>
            <View style={styles.challengeProgressInfo}>
              <Text style={styles.challengeProgressText}>
                {challenge.current} / {challenge.target}
              </Text>
              <Text style={styles.challengeDeadline}>{challenge.deadline}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Track Your Journey</Text>
          <Text style={styles.headerSubtitle}>Monitor your business progress</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'overview' && styles.activeTab]}
          onPress={() => setSelectedTab('overview')}
        >
          <Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'achievements' && styles.activeTab]}
          onPress={() => setSelectedTab('achievements')}
        >
          <Text style={[styles.tabText, selectedTab === 'achievements' && styles.activeTabText]}>
            Achievements
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'challenges' && styles.activeTab]}
          onPress={() => setSelectedTab('challenges')}
        >
          <Text style={[styles.tabText, selectedTab === 'challenges' && styles.activeTabText]}>
            Challenges
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'achievements' && renderAchievements()}
        {selectedTab === 'challenges' && renderChallenges()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#9B59B6',
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
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#9B59B6',
  },
  tabText: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#9B59B6',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  progressSection: {
    marginBottom: 25,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  progressCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ECF0F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  progressInner: {
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#9B59B6',
  },
  progressLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 5,
  },
  progressText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: width * 0.42,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statIconText: {
    fontSize: 24,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: 12,
    color: '#BDC3C7',
    textAlign: 'center',
  },
  weeklySection: {
    marginBottom: 25,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#3498DB',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  weeklyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  weeklyProgress: {
    alignItems: 'center',
  },
  weeklyProgressBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#ECF0F1',
    borderRadius: 5,
    marginBottom: 10,
  },
  weeklyProgressFill: {
    height: '100%',
    backgroundColor: '#27AE60',
    borderRadius: 5,
  },
  weeklyProgressText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '600',
  },
  levelSection: {
    marginBottom: 25,
  },
  levelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  currentLevel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  nextLevel: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  levelProgressBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#ECF0F1',
    borderRadius: 6,
    marginBottom: 10,
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: '#F39C12',
    borderRadius: 6,
  },
  levelProgressText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  // Achievements
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementIconText: {
    fontSize: 24,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 10,
  },
  achievementProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#ECF0F1',
    borderRadius: 3,
    marginRight: 10,
  },
  achievementProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  achievementProgressText: {
    fontSize: 12,
    color: '#7F8C8D',
    minWidth: 40,
  },
  unlockedBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#27AE60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockedBadgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // Challenges
  challengeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  challengeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  challengeIconText: {
    fontSize: 20,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  challengeReward: {
    backgroundColor: '#F39C12',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  challengeRewardText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  challengeProgress: {
    marginTop: 10,
  },
  challengeProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#ECF0F1',
    borderRadius: 4,
    marginBottom: 10,
  },
  challengeProgressFill: {
    height: '100%',
    backgroundColor: '#9B59B6',
    borderRadius: 4,
  },
  challengeProgressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  challengeProgressText: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
  },
  challengeDeadline: {
    fontSize: 12,
    color: '#E74C3C',
    fontWeight: '600',
  },
});

export default ProgressScreen;
