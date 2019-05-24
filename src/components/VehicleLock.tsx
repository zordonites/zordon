import { getDistance } from "geolib";
import React, { useContext, useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Alert } from "react-native";
import { VehicleDataContext } from "../../App";
import styles from "../styles";
import { sendLockNotification } from "../Network";

function VehicleLock(props: any) {
  const [distance, setDistance] = useState(0);
  const [vehicleData] = useContext(VehicleDataContext);
  function updateDistance() {
    let distance = 0;
    navigator.geolocation.getCurrentPosition(
      async phoneLocation => {
        distance = getDistance(
          {
            latitude: phoneLocation.coords.latitude,
            longitude: phoneLocation.coords.longitude
          },
          {
            latitude: vehicleData.region.latitude,
            longitude: vehicleData.region.longitude
          }
        );
        setDistance(distance);
        try {
          await sendLockNotification(distance);
        } catch (error) {
          console.log("failed to send lock notification", error);
        }
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
