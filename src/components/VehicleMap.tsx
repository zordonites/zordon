import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import React, { useContext } from "react";
import { VehicleDataContext } from "../../App";

const VehicleMap = () => {
  const [vehicleData] = useContext(VehicleDataContext);
  return (
    <View style={styles.mapContainer}>
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
const styles = StyleSheet.create({
  mapContainer: {
    justifyContent: "flex-end"
  },
  map: {
    height: "90%"
  }
});
