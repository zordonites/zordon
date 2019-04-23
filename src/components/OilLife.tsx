import React, { useContext } from "react";
import { VehicleDataContext } from "../../App";
import { Text, View } from "react-native";

const OilLife = () => {
  const [vehicleData] = useContext(VehicleDataContext);
  return (
    <View>
      <Text>Days Until Next Oil Change: {vehicleData.oilLifeRemaining}</Text>
    </View>
  );
};

export default OilLife;
