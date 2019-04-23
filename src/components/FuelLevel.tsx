import React from "react";
import { VehicleDataContext } from "../../App";
import { oilLife } from "../Shortcuts";
import { Text } from "react-native";
const FuelLevel = () => {
  return (
    <VehicleDataContext.Consumer>
      {context =>
        context && <Text>Fuel Level: {Math.round(context.fuelLevel)}%</Text>
      }
    </VehicleDataContext.Consumer>
  );
};

export default FuelLevel;
