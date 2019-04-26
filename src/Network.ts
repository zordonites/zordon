import axios from "axios";
import { getAccessToken, getUserId } from "./services/StorageService";
const baseUrl = "http://localhost:8080";
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
