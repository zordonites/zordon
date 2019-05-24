import axios from "axios";
import { getAccessToken, getUserId, getVIN } from "./services/StorageService";
const baseUrl = "https://tmc-zordon-brain.herokuapp.com";
const vehicleDataEndpoint = `${baseUrl}/vehicle-data`;
const oilLifeEndpoint = `${baseUrl}/oil-life`;
const registerEndpoint = `${baseUrl}/login`;
const userEndpoint = `${baseUrl}/user`;

axios.interceptors.request.use(
  async function(config) {
    try {
      const value = await getAccessToken();
      if (value !== null) {
        config.headers.Authorization = `Bearer ${value}`;
        config.headers["Content-Type"] = "application/json";
      }
      const vin = await getVIN();
      if (vin !== null) {
        config.headers["vin"] = vin;
      }
    } catch (error) {
      console.log("Could not retrieve access token when applying interceptor.");
    }

    return config;
  },
  function(err) {
    return Promise.reject(err);
  }
);

export async function getVehicleData() {
  const response = await axios.get(vehicleDataEndpoint);
  return response.data;
}

export async function getRemainingOilLife() {
  const response = await axios.get(oilLifeEndpoint);
  return response.data;
}

export async function login() {
  const response = await axios.get(registerEndpoint);
  return response.data.user;
}

export async function registerVin(vin: string) {
  const userId = await getUserId();
  const response = await axios.patch(`${userEndpoint}/${userId}`, {
    vin
  });
  return response.data;
}

export async function registerDeviceToken(device_token: string) {
  const userId = await getUserId();
  const response = await axios.patch(`${userEndpoint}/${userId}`, {
    device_token
  });
  return response.data;
}
