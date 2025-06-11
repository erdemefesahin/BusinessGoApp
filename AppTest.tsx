import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  StyleSheet,
} from 'react-native';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.content}>
        <Text style={styles.title}>🍽️ RestaurantGO</Text>
        <Text style={styles.subtitle}>Test ekranı çalışıyor!</Text>
        <Text style={styles.info}>Uygulama başarıyla yüklendi.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  info: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default App;
