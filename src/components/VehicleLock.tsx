import { getDistance } from "geolib";
import React, { useContext, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { VehicleDataContext } from "../../App";
import styles from "../styles";

function VehicleLock(props: any) {
  const [distance, setDistance] = useState(0);
  const [vehicleData] = useContext(VehicleDataContext);
  function updateDistance() {
    navigator.geolocation.getCurrentPosition(
      phoneLocation => {
        setDistance(
          getDistance(
            {
              latitude: phoneLocation.coords.latitude,
              longitude: phoneLocation.coords.longitude
            },
            {
              latitude: vehicleData.region.latitude,
              longitude: vehicleData.region.longitude
            }
          )
        );
      },
      error => {
        console.log("error", error);
      },
      {
        timeout: 10000,
        maximumAge: 0,
        enableHighAccuracy: true
      }
    );
  }
  useEffect(() => {
    navigator.geolocation.setRNConfiguration({
      skipPermissionRequests: true
    });
    navigator.geolocation.requestAuthorization();
    updateDistance();
  }, []);
  return (
    <View style={styles.centered}>
      <Text>Distance from vehicle: {distance}</Text>
      <TouchableOpacity style={styles.lightButton} onPress={updateDistance}>
        <Text style={{ alignSelf: "center", fontSize: 22 }}>Update</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.lightButton} onPress={props.navigate}>
        <Text style={{ alignSelf: "center", fontSize: 22 }}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

export default VehicleLock;
