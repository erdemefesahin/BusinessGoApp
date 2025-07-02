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
}

const ProgressScreen: React.FC<ProgressScreenProps> = ({ onBack }) => {
  // Mock data for demonstration
  const [stats] = useState<DailyStats>({
    tasksCompleted: 3,
    totalTasks: 5,
    successRate: 85,
    dailyStreak: 7,
    weeklyGoal: 25,
    weeklyCompleted: 18,
    totalXP: 2850,
    level: 4,
  });

  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1500,
        delay: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const completionPercentage = (stats.tasksCompleted / stats.totalTasks) * 100;
  const weeklyPercentage = (stats.weeklyCompleted / stats.weeklyGoal) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#9B59B6', '#8E44AD']}
        style={styles.header}
      >
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Progress</Text>
          <Text style={styles.headerSubtitle}>Track your business journey</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today's Progress - Circular Chart */}
        <Animated.View 
          style={[
            styles.todayProgressCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['#FFFFFF', '#F8F9FA']}
            style={styles.progressCardGradient}
          >
            <Text style={styles.cardTitle}>Today's Tasks</Text>
            
            <View style={styles.circularChartContainer}>
              <View style={styles.circularChart}>
                <View style={styles.circularProgressContainer}>
                  {/* Background circle */}
                  <View style={[styles.circularBackground, {
                    borderColor: '#E9ECEF',
                  }]} />
                  
                  {/* Progress arc */}
                  <Animated.View 
                    style={[
                      styles.circularForeground,
                      {
                        borderTopColor: '#4A90E2',
                        transform: [
                          { rotate: '-90deg' },
                          { 
                            rotateZ: progressAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0deg', `${(completionPercentage / 100) * 360}deg`]
                            })
                          }
                        ]
                      }
                    ]}
                  />
                  
                  {/* Center content */}
                  <View style={styles.circularCenter}>
                    <Text style={styles.circularPercentage}>
                      {Math.round(completionPercentage)}%
                    </Text>
                    <Text style={styles.circularLabel}>Complete</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.taskSummary}>
                <Text style={styles.completedTasks}>
                  {stats.tasksCompleted}/{stats.totalTasks}
                </Text>
                <Text style={styles.taskLabel}>Tasks Completed</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Key Statistics */}
        <Animated.View 
          style={[
            styles.statsSection,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.sectionTitle}>Key Statistics</Text>
          
          <View style={styles.statsGrid}>
            {/* Tasks Completed */}
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#27AE60', '#2ECC71']}
                style={styles.statGradient}
              >
                <View style={styles.statIcon}>
                  <Text style={styles.statIconText}>✅</Text>
                </View>
                <Text style={styles.statNumber}>{stats.tasksCompleted}</Text>
                <Text style={styles.statLabel}>Tasks Completed</Text>
                <Text style={styles.statSubtext}>Today</Text>
              </LinearGradient>
            </View>

            {/* Success Rate */}
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#3498DB', '#5DADE2']}
                style={styles.statGradient}
              >
                <View style={styles.statIcon}>
                  <Text style={styles.statIconText}>📈</Text>
                </View>
                <Text style={styles.statNumber}>{stats.successRate}%</Text>
                <Text style={styles.statLabel}>Success Rate</Text>
                <Text style={styles.statSubtext}>This Month</Text>
              </LinearGradient>
            </View>

            {/* Daily Streak */}
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#E74C3C', '#EC7063']}
                style={styles.statGradient}
              >
                <View style={styles.statIcon}>
                  <Text style={styles.statIconText}>🔥</Text>
                </View>
                <Text style={styles.statNumber}>{stats.dailyStreak}</Text>
                <Text style={styles.statLabel}>Daily Streak</Text>
                <Text style={styles.statSubtext}>Days</Text>
              </LinearGradient>
            </View>

            {/* Level */}
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#F39C12', '#F7DC6F']}
                style={styles.statGradient}
              >
                <View style={styles.statIcon}>
                  <Text style={styles.statIconText}>⭐</Text>
                </View>
                <Text style={styles.statNumber}>{stats.level}</Text>
                <Text style={styles.statLabel}>Current Level</Text>
                <Text style={styles.statSubtext}>{stats.totalXP} XP</Text>
              </LinearGradient>
            </View>
          </View>
        </Animated.View>

        {/* Weekly Progress */}
        <Animated.View 
          style={[
            styles.weeklySection,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          
          <View style={styles.weeklyCard}>
            <LinearGradient
              colors={['#FFFFFF', '#F8F9FA']}
              style={styles.weeklyCardGradient}
            >
              <View style={styles.weeklyHeader}>
                <View>
                  <Text style={styles.weeklyTitle}>Weekly Goal</Text>
                  <Text style={styles.weeklySubtitle}>
                    {stats.weeklyCompleted} of {stats.weeklyGoal} tasks
                  </Text>
                </View>
                <Text style={styles.weeklyPercentage}>
                  {Math.round(weeklyPercentage)}%
                </Text>
              </View>
              
              <View style={styles.weeklyProgressBar}>
                <View style={styles.weeklyProgressTrack}>
                  <Animated.View 
                    style={[
                      styles.weeklyProgressFill,
                      {
                        width: progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', `${weeklyPercentage}%`]
                        })
                      }
                    ]}
                  />
                </View>
              </View>
              
              <View style={styles.weeklyStats}>
                <View style={styles.weeklyStatItem}>
                  <Text style={styles.weeklyStatNumber}>{stats.weeklyCompleted}</Text>
                  <Text style={styles.weeklyStatLabel}>Completed</Text>
                </View>
                <View style={styles.weeklyStatItem}>
                  <Text style={styles.weeklyStatNumber}>{stats.weeklyGoal - stats.weeklyCompleted}</Text>
                  <Text style={styles.weeklyStatLabel}>Remaining</Text>
                </View>
                <View style={styles.weeklyStatItem}>
                  <Text style={styles.weeklyStatNumber}>{Math.ceil((stats.weeklyGoal - stats.weeklyCompleted) / 7)}</Text>
                  <Text style={styles.weeklyStatLabel}>Per Day</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Motivational Message */}
        <Animated.View 
          style={[
            styles.motivationSection,
            { opacity: fadeAnim }
          ]}
        >
          <LinearGradient
            colors={['#8E44AD', '#9B59B6']}
            style={styles.motivationCard}
          >
            <Text style={styles.motivationIcon}>🚀</Text>
            <Text style={styles.motivationTitle}>Keep Going!</Text>
            <Text style={styles.motivationText}>
              {completionPercentage === 100 
                ? "Amazing! You've completed all today's tasks. You're on fire!"
                : `You're ${Math.round(completionPercentage)}% done with today's tasks. ${stats.totalTasks - stats.tasksCompleted} more to go!`
              }
            </Text>
          </LinearGradient>
        </Animated.View>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
    marginLeft: 5,
  },
  // Today's Progress Card
  todayProgressCard: {
    marginBottom: 25,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  progressCardGradient: {
    padding: 25,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 25,
  },
  circularChartContainer: {
    alignItems: 'center',
  },
  circularChart: {
    marginBottom: 20,
  },
  circularProgressContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circularBackground: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 12,
    borderColor: '#E9ECEF',
  },
  circularForeground: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 12,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  circularCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularPercentage: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  circularLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  taskSummary: {
    alignItems: 'center',
  },
  completedTasks: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  taskLabel: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  // Stats Section
  statsSection: {
    marginBottom: 25,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  statCard: {
    width: (width - 55) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  statIconText: {
    fontSize: 24,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  // Weekly Section
  weeklySection: {
    marginBottom: 25,
  },
  weeklyCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  weeklyCardGradient: {
    padding: 25,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  weeklyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  weeklySubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  weeklyPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9B59B6',
  },
  weeklyProgressBar: {
    marginBottom: 20,
  },
  weeklyProgressTrack: {
    height: 12,
    backgroundColor: '#E9ECEF',
    borderRadius: 6,
    overflow: 'hidden',
  },
  weeklyProgressFill: {
    height: '100%',
    backgroundColor: '#9B59B6',
    borderRadius: 6,
  },
  weeklyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weeklyStatItem: {
    alignItems: 'center',
  },
  weeklyStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  weeklyStatLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Motivation Section
  motivationSection: {
    marginBottom: 20,
  },
  motivationCard: {
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#9B59B6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  motivationIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  motivationTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  motivationText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ProgressScreen;
