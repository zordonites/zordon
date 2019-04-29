import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableHighlight,
  TextInput,
  TouchableOpacity
} from "react-native";
import { registerVin } from "../Network";
import { NavigationScreenProps } from "react-navigation";
import { setVIN, getVIN } from "../services/StorageService";
import styles from "../styles";

const VIN = (props: NavigationScreenProps) => {
  const [vin, setVin] = useState("");
  useEffect(() => {
    getVIN().then(vin => {
      if (vin) setVin(vin);
    });
  }, []);

  async function updateVin() {
    try {
      await registerVin(vin);
      await setVIN(vin);
      props.navigation.navigate("App");
    } catch (error) {
      console.log("Error updating vin : ", error);
    }
  }

  return (
    <View style={styles.centered}>
      <Text style={{ alignSelf: "center", fontSize: 22, marginBottom: 10 }}>
        Enter your VIN below
      </Text>
      <TextInput
        value={vin}
        style={styles.input}
        onChangeText={text => setVin(text)}
      />
      <TouchableOpacity style={styles.lightButton} onPress={updateVin}>
        <Text style={{ alignSelf: "center", fontSize: 22 }}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.lightButton}
        onPress={() => props.navigation.navigate("App")}
      >
        <Text style={{ alignSelf: "center", fontSize: 22 }}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VIN;
