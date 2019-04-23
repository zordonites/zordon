import React, { useContext } from "react";
import { VehicleDataContext } from "../../App";
import { Text, View } from "react-native";

const FuelLevel = () => {
  const [vehicleData] = useContext(VehicleDataContext);
  return (
    <View>
      <Text>Fuel Level: {Math.round(vehicleData.fuelLevel)}%</Text>
    </View>
  );
};

export default FuelLevel;
