/**
 * Storage utility for persisting data
 */

import { Platform } from 'react-native';

// Simple storage implementation - in a real app, use AsyncStorage or another storage solution
const storage = new Map();

export const setItem = (key: string, value: any): void => {
  try {
    const serializedValue = JSON.stringify(value);
    storage.set(key, serializedValue);
  } catch (error) {
    console.error('Error saving data', error);
  }
};

export const getItem = (key: string, defaultValue: any = null): any => {
  try {
    const serializedValue = storage.get(key);
    if (serializedValue === undefined) {
      return defaultValue;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error('Error retrieving data', error);
    return defaultValue;
  }
};

export const removeItem = (key: string): void => {
  try {
    storage.delete(key);
  } catch (error) {
    console.error('Error removing data', error);
  }
};

export const clear = (): void => {
  try {
    storage.clear();
  } catch (error) {
    console.error('Error clearing data', error);
  }
};

/**
 * Device utility functions
 */

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

/**
 * Format utility functions
 */

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Game mechanics utilities
 */

export const calculateLevel = (xp: number): number => {
  // Simple level calculation: every 1000 XP is a new level
  return Math.floor(xp / 1000) + 1;
};

export const calculateXpForNextLevel = (currentLevel: number): number => {
  return currentLevel * 1000;
};
