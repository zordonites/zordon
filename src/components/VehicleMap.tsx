import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import React, { useContext } from "react";
import { VehicleDataContext } from "../../App";
import styles from "../styles";
import { presentShortcut } from "react-native-siri-shortcut";
import AddToSiriButton, {
  SiriButtonStyles
  // @ts-ignore
} from "react-native-siri-shortcut/AddToSiriButton";
import { vehicleLocation } from "../Shortcuts";

const VehicleMap = (props: any) => {
  const [vehicleData] = useContext(VehicleDataContext);
  return (
    <View style={styles.mapContainer}>
      <TouchableOpacity style={styles.lightButton} onPress={props.navigate}>
        <Text style={{ alignSelf: "center", fontSize: 22 }}>Back</Text>
      </TouchableOpacity>
      <AddToSiriButton
        buttonStyle={SiriButtonStyles.blackOutline}
        onPress={() => {
          presentShortcut(vehicleLocation, ({ status }: { status: any }) => {
            console.log(status);
          });
        }}
      />
      <MapView style={styles.map} region={vehicleData.region}>
        <Marker
          coordinate={{
            latitude: vehicleData.region.latitude,
            longitude: vehicleData.region.longitude
          }}
          title="My Vehicle"
          description="F150"
        />
      </MapView>
    </View>
  );
};

export default VehicleMap;
