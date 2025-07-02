import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

interface LeaderboardScreenProps {
  onBack?: () => void;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const leaderboardData = [
    { rank: 1, name: 'Sarah M.', xp: 12450, level: 15, badge: '👑' },
    { rank: 2, name: 'Mike R.', xp: 11230, level: 14, badge: '🥈' },
    { rank: 3, name: 'Alex K.', xp: 10890, level: 13, badge: '🥉' },
    { rank: 4, name: 'You', xp: 2750, level: 3, badge: '', isCurrentUser: true },
    { rank: 5, name: 'Jenny L.', xp: 2650, level: 3, badge: '' },
    { rank: 6, name: 'Tom H.', xp: 2480, level: 3, badge: '' },
    { rank: 7, name: 'Lisa W.', xp: 2340, level: 2, badge: '' },
    { rank: 8, name: 'David P.', xp: 2180, level: 2, badge: '' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFD700', '#FFED4A']}
        style={styles.header}
      >
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Leaderboard</Text>
          <Text style={styles.headerSubtitle}>See how you rank against others</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.leaderboardContainer}>
          {leaderboardData.map((player) => (
            <View 
              key={player.rank} 
              style={[
                styles.playerCard,
                player.isCurrentUser && styles.currentUserCard
              ]}
            >
              <View style={styles.rankContainer}>
                {player.badge ? (
                  <Text style={styles.badge}>{player.badge}</Text>
                ) : (
                  <Text style={styles.rank}>#{player.rank}</Text>
                )}
              </View>
              
              <View style={styles.playerInfo}>
                <Text style={[
                  styles.playerName,
                  player.isCurrentUser && styles.currentUserText
                ]}>
                  {player.name}
                </Text>
                <Text style={styles.playerLevel}>Level {player.level}</Text>
              </View>
              
              <View style={styles.xpContainer}>
                <Text style={[
                  styles.xpValue,
                  player.isCurrentUser && styles.currentUserXP
                ]}>
                  {player.xp.toLocaleString()}
                </Text>
                <Text style={styles.xpLabel}>XP</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.motivationSection}>
          <Text style={styles.motivationTitle}>Keep Going! 🚀</Text>
          <Text style={styles.motivationText}>
            Complete more tasks to climb the leaderboard and unlock achievements!
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
  leaderboardContainer: {
    gap: 10,
  },
  playerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  currentUserCard: {
    backgroundColor: '#E8F4FD',
    borderWidth: 2,
    borderColor: '#3498DB',
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  badge: {
    fontSize: 24,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7F8C8D',
  },
  playerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  currentUserText: {
    color: '#3498DB',
    fontWeight: 'bold',
  },
  playerLevel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 2,
  },
  xpContainer: {
    alignItems: 'flex-end',
  },
  xpValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  currentUserXP: {
    color: '#3498DB',
  },
  xpLabel: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  motivationSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginTop: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  motivationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  motivationText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default LeaderboardScreen;
