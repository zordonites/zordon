import axios from "axios";
import { getAccessToken } from "./services/StorageService";

const vehicleDataEndpoint =
  "https://tmc-zordon-brain.herokuapp.com/vehicle-data";
const oilLifeEndpoint = "https://tmc-zordon-brain.herokuapp.com/oil-life";

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
