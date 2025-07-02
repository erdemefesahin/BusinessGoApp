import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface BusinessMapScreenProps {
  onBack?: () => void;
}

interface BusinessTask {
  id: string;
  title: string;
  description: string;
  location: string;
  icon: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  reward: number;
  estimatedTime: string;
  category: string;
}

interface ModalState {
  visible: boolean;
  task: BusinessTask | null;
}

const BusinessMapScreen: React.FC<BusinessMapScreenProps> = ({ onBack }) => {
  const [modalState, setModalState] = useState<ModalState>({
    visible: false,
    task: null,
  });
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const businessTasks: BusinessTask[] = [
    {
      id: '1',
      title: 'Network at Coffee Shop',
      description: 'Meet 3 potential business partners at the local coffee shop. Practice your elevator pitch and exchange contact information.',
      location: 'Downtown Coffee House',
      icon: '☕',
      difficulty: 'Easy',
      reward: 50,
      estimatedTime: '30 mins',
      category: 'Networking'
    },
    {
      id: '2',
      title: 'Market Research Survey',
      description: 'Conduct customer interviews at the shopping mall. Gather feedback about your business idea from 10 potential customers.',
      location: 'City Shopping Mall',
      icon: '📊',
      difficulty: 'Medium',
      reward: 100,
      estimatedTime: '1 hour',
      category: 'Research'
    },
    {
      id: '3',
      title: 'Business Pitch Competition',
      description: 'Present your business idea at the local entrepreneur meetup. Compete for feedback and potential investment.',
      location: 'Business Innovation Center',
      icon: '🎤',
      difficulty: 'Hard',
      reward: 200,
      estimatedTime: '2 hours',
      category: 'Pitching'
    }
  ];

  const openTaskModal = (task: BusinessTask) => {
    setModalState({
      visible: true,
      task: task,
    });
  };

  const closeModal = () => {
    setModalState({
      visible: false,
      task: null,
    });
  };

  const startTask = () => {
    if (modalState.task) {
      Alert.alert(
        'Task Started!',
        `You've started "${modalState.task.title}". Good luck!`,
        [
          {
            text: 'Continue',
            onPress: () => {
              closeModal();
              setSelectedTaskId(modalState.task?.id || null);
            }
          }
        ]
      );
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#27AE60';
      case 'Medium': return '#F39C12';
      case 'Hard': return '#E74C3C';
      default: return '#7F8C8D';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Business Map</Text>
          <Text style={styles.headerSubtitle}>Discover opportunities nearby</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Map Placeholder */}
        <View style={styles.mapPlaceholder}>
          <View style={styles.mapGradient}>
            <Text style={styles.mapPlaceholderTitle}>🗺️ Business Opportunities</Text>
            <Text style={styles.mapPlaceholderSubtitle}>
              Explore local business tasks and networking opportunities
            </Text>
          </View>
        </View>

        {/* Location Info */}
        <View style={styles.locationInfo}>
          <Text style={styles.locationTitle}>📍 Current Area: Downtown Business District</Text>
          <Text style={styles.locationSubtitle}>3 business opportunities available</Text>
        </View>

        {/* Business Tasks List */}
        <View style={styles.tasksSection}>
          <Text style={styles.sectionTitle}>Available Opportunities</Text>
          
          {businessTasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={[
                styles.taskCard,
                selectedTaskId === task.id && styles.selectedTaskCard
              ]}
              onPress={() => openTaskModal(task)}
            >
              <View style={styles.taskHeader}>
                <Text style={styles.taskIcon}>{task.icon}</Text>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskLocation}>📍 {task.location}</Text>
                </View>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(task.difficulty) }]}>
                  <Text style={styles.difficultyText}>{task.difficulty}</Text>
                </View>
              </View>
              
              <View style={styles.taskDetails}>
                <View style={styles.taskMeta}>
                  <Text style={styles.taskCategory}>🏷️ {task.category}</Text>
                  <Text style={styles.taskTime}>⏱️ {task.estimatedTime}</Text>
                  <Text style={styles.taskReward}>⭐ {task.reward} XP</Text>
                </View>
              </View>
              
              {selectedTaskId === task.id && (
                <View style={styles.activeTaskIndicator}>
                  <Text style={styles.activeTaskText}>✅ Task In Progress</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>How to Use Business Map</Text>
          <Text style={styles.instructionsText}>
            • Tap on any business opportunity to view details{'\n'}
            • Start tasks to gain XP and improve your business skills{'\n'}
            • Complete tasks to unlock new opportunities{'\n'}
            • Build your network and grow your business knowledge
          </Text>
        </View>
      </ScrollView>

      {/* Task Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalState.visible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {modalState.task && (
              <>
                <View style={styles.modalHeader}>
                  <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                  <View style={styles.modalTaskIcon}>
                    <Text style={styles.modalTaskIconText}>{modalState.task.icon}</Text>
                  </View>
                </View>

                <ScrollView style={styles.modalBody}>
                  <Text style={styles.modalTitle}>{modalState.task.title}</Text>
                  
                  <View style={styles.modalMeta}>
                    <View style={styles.modalMetaItem}>
                      <Text style={styles.modalMetaLabel}>Category</Text>
                      <Text style={styles.modalMetaValue}>{modalState.task.category}</Text>
                    </View>
                    <View style={styles.modalMetaItem}>
                      <Text style={styles.modalMetaLabel}>Time</Text>
                      <Text style={styles.modalMetaValue}>{modalState.task.estimatedTime}</Text>
                    </View>
                    <View style={styles.modalMetaItem}>
                      <Text style={styles.modalMetaLabel}>Reward</Text>
                      <Text style={styles.modalMetaValue}>{modalState.task.reward} XP</Text>
                    </View>
                  </View>

                  <View style={styles.locationCard}>
                    <Text style={styles.locationCardTitle}>📍 Location</Text>
                    <Text style={styles.locationCardText}>{modalState.task.location}</Text>
                  </View>

                  <View style={styles.descriptionCard}>
                    <Text style={styles.descriptionTitle}>Task Description</Text>
                    <Text style={styles.descriptionText}>{modalState.task.description}</Text>
                  </View>

                  <View style={[styles.difficultyCard, { backgroundColor: getDifficultyColor(modalState.task.difficulty) }]}>
                    <Text style={styles.difficultyCardText}>
                      Difficulty: {modalState.task.difficulty}
                    </Text>
                  </View>
                </ScrollView>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={startTask}
                  >
                    <View style={styles.startButtonGradient}>
                      <Text style={styles.startButtonText}>Start Task</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#3498DB',
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
  mapPlaceholder: {
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  mapGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#E8F4FD',
  },
  mapPlaceholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  mapPlaceholderSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 22,
  },
  locationInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  locationSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  tasksSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  selectedTaskCard: {
    borderColor: '#27AE60',
    borderWidth: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  taskLocation: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  taskDetails: {
    marginTop: 10,
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskCategory: {
    fontSize: 14,
    color: '#3498DB',
    fontWeight: '600',
  },
  taskTime: {
    fontSize: 14,
    color: '#F39C12',
    fontWeight: '600',
  },
  taskReward: {
    fontSize: 14,
    color: '#E74C3C',
    fontWeight: '600',
  },
  activeTaskIndicator: {
    marginTop: 15,
    backgroundColor: '#D5F4E6',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  activeTaskText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  instructionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: height * 0.8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ECF0F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#7F8C8D',
    fontWeight: 'bold',
  },
  modalTaskIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EBF3FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTaskIconText: {
    fontSize: 30,
  },
  modalBody: {
    maxHeight: height * 0.5,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  modalMetaItem: {
    alignItems: 'center',
  },
  modalMetaLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  modalMetaValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  locationCard: {
    backgroundColor: '#FEF9E7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  locationCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D68910',
    marginBottom: 5,
  },
  locationCardText: {
    fontSize: 14,
    color: '#7D6608',
  },
  descriptionCard: {
    backgroundColor: '#EBF3FD',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2471A3',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#1B4F72',
    lineHeight: 20,
  },
  difficultyCard: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  difficultyCardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
  },
  startButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  startButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#27AE60',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default BusinessMapScreen;
