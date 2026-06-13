import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';
const REMEMBER_KEY = 'remember_me';

// SecureStore does not work on web — use AsyncStorage there
const canUseSecureStore = Platform.OS !== 'web';

async function setItem(key: string, value: string) {
  if (canUseSecureStore) {
    await SecureStore.setItemAsync(key, value);
  } else {
    await AsyncStorage.setItem(key, value);
  }
}

async function getItem(key: string) {
  if (canUseSecureStore) {
    return SecureStore.getItemAsync(key);
  }
  return AsyncStorage.getItem(key);
}

async function deleteItem(key: string) {
  if (canUseSecureStore) {
    await SecureStore.deleteItemAsync(key);
  } else {
    await AsyncStorage.removeItem(key);
  }
}

export const secureStorage = {
  async setTokens(access: string, refresh: string) {
    await setItem(TOKEN_KEY, access);
    await setItem(REFRESH_KEY, refresh);
  },

  async getAccessToken() {
    return getItem(TOKEN_KEY);
  },

  async getRefreshToken() {
    return getItem(REFRESH_KEY);
  },

  async clearTokens() {
    await deleteItem(TOKEN_KEY);
    await deleteItem(REFRESH_KEY);
  },

  async setRememberMe(value: boolean) {
    await AsyncStorage.setItem(REMEMBER_KEY, JSON.stringify(value));
  },

  async getRememberMe() {
    const value = await AsyncStorage.getItem(REMEMBER_KEY);
    return value ? JSON.parse(value) : false;
  },
};
