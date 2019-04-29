import React, { useContext } from "react";
import { VehicleDataContext } from "../../App";
import { Text, View, TouchableOpacity } from "react-native";
import styles from "../styles";

const FuelLevel = (props: any) => {
  const [vehicleData] = useContext(VehicleDataContext);
  return (
    <View style={styles.centered}>
      <Text style={{ alignSelf: "center", fontSize: 22 }}>
        Fuel Level: {Math.round(vehicleData.fuelLevel)}%
      </Text>
      <TouchableOpacity style={styles.lightButton} onPress={props.navigate}>
        <Text style={{ alignSelf: "center", fontSize: 22 }}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FuelLevel;
