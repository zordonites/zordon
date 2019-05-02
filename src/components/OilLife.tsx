import React, { useContext } from "react";
import { VehicleDataContext } from "../../App";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import styles from "../styles";
import { oilLife } from "../Shortcuts";
import { presentShortcut } from "react-native-siri-shortcut";
import AddToSiriButton, {
  SiriButtonStyles
  // @ts-ignore
} from "react-native-siri-shortcut/AddToSiriButton";

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
      <AddToSiriButton
        buttonStyle={SiriButtonStyles.blackOutline}
        onPress={() => {
          presentShortcut(oilLife, ({ status }: { status: any }) => {
            console.log(status);
          });
        }}
        shortcut={oilLife}
      />
    </View>
  );
};

export default OilLife;
