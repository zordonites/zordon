import axios from "axios";

const vehicleDataEndpoint =
  "https://tmc-zordon-brain.herokuapp.com/vehicle-data";
const oilLifeEndpoint = "https://tmc-zordon-brain.herokuapp.com/oil-life";

export async function getVehicleData() {
  const response = await axios.get(vehicleDataEndpoint);
  return response.data;
}

export async function getRemainingOilLife() {
  const response = await axios.get(oilLifeEndpoint);
  return response.data;
}
