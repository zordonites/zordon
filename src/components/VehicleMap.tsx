import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import React, { useContext } from "react";
import { VehicleDataContext } from "../../App";
import styles from "../styles";

const VehicleMap = (props: any) => {
  const [vehicleData] = useContext(VehicleDataContext);
  return (
    <View style={styles.mapContainer}>
      <TouchableOpacity style={styles.lightButton} onPress={props.navigate}>
        <Text style={{ alignSelf: "center", fontSize: 22 }}>Back</Text>
      </TouchableOpacity>
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
