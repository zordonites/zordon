import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableHighlight,
  StyleSheet,
  TextInput
} from "react-native";
import { registerVin } from "../Network";
import { NavigationScreenProps } from "react-navigation";
import { setVIN, getVIN } from "../services/StorageService";

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
    <View style={styles.container}>
      <View>
        <Text>Enter your VIN below</Text>
        <TextInput
          value={vin}
          style={styles.input}
          onChangeText={text => setVin(text)}
        />
        <TouchableHighlight style={styles.button} onPress={updateVin}>
          <Text>Save VIN</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default VIN;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DCDCDC"
  },
  input: {
    backgroundColor: "white"
  },
  button: {
    backgroundColor: "#00aeef",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 15,
    alignItems: "center"
  }
});
