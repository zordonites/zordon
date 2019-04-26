import { AsyncStorage } from "react-native";

const ACCESS_TOKEN = "accessToken";
const VIN = "vin";
const USER_ID = "id";

export async function setAccessToken(accessToken: string) {
  await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
}

export function getAccessToken() {
  return AsyncStorage.getItem(ACCESS_TOKEN);
}

export function getVIN() {
  return AsyncStorage.getItem(VIN);
}

export async function setUserId(userId: string) {
  await AsyncStorage.setItem(USER_ID, userId);
}

export function getUserId() {
  return AsyncStorage.getItem(USER_ID);
}

export async function clearStorage() {
  await AsyncStorage.removeItem(ACCESS_TOKEN);
  await AsyncStorage.removeItem(VIN);
  await AsyncStorage.removeItem(USER_ID);
}
