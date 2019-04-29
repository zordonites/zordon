import React, { useContext } from "react";
import { VehicleDataContext } from "../../App";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import styles from "../styles";

const OilLife = (props: any) => {
  const [vehicleData] = useContext(VehicleDataContext);
  return (
    <View style={styles.centered}>
      <Text style={{ alignSelf: "center", fontSize: 22 }}>
        Days Until Next Oil Change: {vehicleData.oilLifeRemaining}
      </Text>
      <TouchableOpacity style={styles.lightButton} onPress={props.navigate}>
        <Text style={{ alignSelf: "center", fontSize: 22 }}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OilLife;
