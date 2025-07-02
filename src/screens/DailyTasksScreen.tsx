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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

interface DailyTasksScreenProps {
  onBack?: () => void;
}

interface DailyTask {
  id: number;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  icon: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const DailyTasksScreen: React.FC<DailyTasksScreenProps> = ({ onBack }) => {
  const [tasks, setTasks] = useState<DailyTask[]>([
    {
      id: 1,
      title: 'Share Your Business Story',
      description: 'Post about your business journey on social media',
      xp: 150,
      completed: false,
      icon: '📱',
      category: 'Marketing',
      difficulty: 'Easy',
    },
    {
      id: 2,
      title: 'Update Business Profile',
      description: 'Review and update your business information across platforms',
      xp: 100,
      completed: false,
      icon: '📝',
      category: 'Management',
      difficulty: 'Easy',
    },
    {
      id: 3,
      title: 'Network with 3 People',
      description: 'Connect with new business contacts or potential customers',
      xp: 250,
      completed: false,
      icon: '🤝',
      category: 'Networking',
      difficulty: 'Medium',
    },
    {
      id: 4,
      title: 'Analyze Weekly Performance',
      description: 'Review your business metrics and identify improvement areas',
      xp: 300,
      completed: false,
      icon: '📊',
      category: 'Analytics',
      difficulty: 'Hard',
    },
    {
      id: 5,
      title: 'Learn Something New',
      description: 'Complete a business course or read an industry article',
      xp: 200,
      completed: false,
      icon: '📚',
      category: 'Education',
      difficulty: 'Medium',
    },
  ]);

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

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

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const updatedTask = { ...task, completed: !task.completed };
          
          // Show completion feedback
          if (!task.completed && updatedTask.completed) {
            Alert.alert(
              'Task Completed! 🎉',
              `Great job! You earned +${task.xp} XP for completing "${task.title}"`,
              [{ text: 'Awesome!', style: 'default' }]
            );
          }
          
          return updatedTask;
        }
        return task;
      })
    );
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalXP = tasks.filter(task => task.completed).reduce((sum, task) => sum + task.xp, 0);
  const progressPercentage = (completedTasks / tasks.length) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#27AE60';
      case 'Medium': return '#F39C12';
      case 'Hard': return '#E74C3C';
      default: return '#95A5A6';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4A90E2', '#7BB3F0']}
        style={styles.header}
      >
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Daily Missions</Text>
          <Text style={styles.headerSubtitle}>Complete tasks to earn XP and grow your business</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Summary */}
        <Animated.View 
          style={[
            styles.progressCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['#FFFFFF', '#F8F9FA']}
            style={styles.progressCardGradient}
          >
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Today's Progress</Text>
              <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
            </View>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progressPercentage}%` }
                ]} 
              />
            </View>
            
            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{completedTasks}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{tasks.length - completedTasks}</Text>
                <Text style={styles.statLabel}>Remaining</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, styles.xpNumber]}>+{totalXP}</Text>
                <Text style={styles.statLabel}>XP Earned</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Task List */}
        <View style={styles.tasksContainer}>
          <Text style={styles.sectionTitle}>Daily Tasks</Text>
          
          {tasks.map((task, index) => (
            <Animated.View
              key={task.id}
              style={[
                styles.taskCardWrapper,
                {
                  opacity: fadeAnim,
                  transform: [{
                    translateY: Animated.add(slideAnim, new Animated.Value(index * 10))
                  }]
                }
              ]}
            >
              <TouchableOpacity
                style={[styles.taskCard, task.completed && styles.completedTask]}
                onPress={() => toggleTaskCompletion(task.id)}
                activeOpacity={0.8}
              >
                {/* Task Checkbox */}
                <View style={styles.taskLeft}>
                  <View style={[styles.checkbox, task.completed && styles.checkedBox]}>
                    {task.completed && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  
                  <View style={styles.taskIcon}>
                    <Text style={styles.taskIconText}>{task.icon}</Text>
                  </View>
                  
                  <View style={styles.taskInfo}>
                    <Text style={[styles.taskTitle, task.completed && styles.completedText]}>
                      {task.title}
                    </Text>
                    <Text style={[styles.taskDescription, task.completed && styles.completedDescription]}>
                      {task.description}
                    </Text>
                    <View style={styles.taskMeta}>
                      <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(task.difficulty) }]}>
                        <Text style={styles.difficultyText}>{task.difficulty}</Text>
                      </View>
                      <Text style={styles.categoryText}>{task.category}</Text>
                    </View>
                  </View>
                </View>
                
                {/* XP Reward */}
                <View style={styles.taskRight}>
                  <View style={[styles.xpBadge, task.completed && styles.completedXpBadge]}>
                    <Text style={[styles.xpText, task.completed && styles.completedXpText]}>
                      +{task.xp} XP
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Completion Message */}
        {completedTasks === tasks.length && (
          <Animated.View style={[styles.completionCard, { opacity: fadeAnim }]}>
            <LinearGradient
              colors={['#27AE60', '#2ECC71']}
              style={styles.completionGradient}
            >
              <Text style={styles.completionIcon}>🎉</Text>
              <Text style={styles.completionTitle}>All Tasks Completed!</Text>
              <Text style={styles.completionText}>
                Amazing work! You've completed all daily missions and earned {totalXP} XP.
                Come back tomorrow for new challenges!
              </Text>
            </LinearGradient>
          </Animated.View>
        )}
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
  // Progress Card Styles
  progressCard: {
    marginBottom: 25,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  progressCardGradient: {
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  xpNumber: {
    color: '#FF6B35',
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Task List Styles
  tasksContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    marginLeft: 5,
  },
  taskCardWrapper: {
    marginBottom: 15,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  completedTask: {
    backgroundColor: '#F8FDF8',
    borderColor: '#27AE60',
    opacity: 0.8,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#BDC3C7',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkedBox: {
    backgroundColor: '#27AE60',
    borderColor: '#27AE60',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  taskIconText: {
    fontSize: 24,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 6,
    lineHeight: 20,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#7F8C8D',
  },
  taskDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 10,
    lineHeight: 18,
  },
  completedDescription: {
    color: '#95A5A6',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  difficultyText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryText: {
    fontSize: 12,
    color: '#95A5A6',
    fontWeight: '500',
  },
  taskRight: {
    alignItems: 'center',
    marginLeft: 15,
  },
  xpBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  completedXpBadge: {
    backgroundColor: '#27AE60',
    shadowColor: '#27AE60',
  },
  xpText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  completedXpText: {
    color: '#FFFFFF',
  },
  // Completion Message Styles
  completionCard: {
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#27AE60',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  completionGradient: {
    padding: 25,
    alignItems: 'center',
  },
  completionIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  completionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  completionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default DailyTasksScreen;
