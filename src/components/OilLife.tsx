import React from "react";
import { VehicleDataContext } from "../../App";
import { Text } from "react-native";

const OilLife = () => {
  return (
    <VehicleDataContext.Consumer>
      {context =>
        context && (
          <Text>Days Until Next Oil Change: {context.oilLifeRemaining}</Text>
        )
      }
    </VehicleDataContext.Consumer>
  );
};

export default OilLife;
