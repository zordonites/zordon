import { AsyncStorage } from "react-native";

const ACCESS_TOKEN = "accessToken";
const VIN = "vin";

export async function setAccessToken(accessToken: string) {
  await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
}

export function getAccessToken() {
  return AsyncStorage.getItem(ACCESS_TOKEN);
}

export function getVIN() {
  return AsyncStorage.getItem(VIN);
}

export async function clearStorage() {
  await AsyncStorage.removeItem(ACCESS_TOKEN);
  await AsyncStorage.removeItem(VIN);
}
