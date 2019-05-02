import React, { useContext } from "react";
import { VehicleDataContext } from "../../App";
import { Text, View, TouchableOpacity } from "react-native";
import styles from "../styles";
import { fuelLevel } from "../Shortcuts";
import { presentShortcut } from "react-native-siri-shortcut";
import AddToSiriButton, {
  SiriButtonStyles
  // @ts-ignore
} from "react-native-siri-shortcut/AddToSiriButton";

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
      <AddToSiriButton
        buttonStyle={SiriButtonStyles.blackOutline}
        onPress={() => {
          presentShortcut(fuelLevel, ({ status }: { status: any }) => {
            console.log(status);
          });
        }}
      />
    </View>
  );
};

export default FuelLevel;
