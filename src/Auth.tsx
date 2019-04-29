import React, { Component } from "react";
import {
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { NavigationScreenProps } from "react-navigation";
import {
  getAccessToken,
  setAccessToken,
  setUserId,
  setVIN
} from "./services/StorageService";
import { auth0 } from "./services/Auth0Service";
import { login } from "./Network";
export class AuthLoadingScreen extends Component<NavigationScreenProps> {
  constructor(props: NavigationScreenProps) {
    super(props);
    this.checkForAccessToken();
  }

  // TODO: User token and vin
  checkForAccessToken = async () => {
    const userToken = await getAccessToken();
    this.props.navigation.navigate(userToken ? "App" : "Auth");
  };

  render() {
    return (
      <View>
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export function AuthScreen(props: NavigationScreenProps) {
  async function doAuth() {
    try {
      const credentials = await auth0.webAuth.authorize({
        scope: "openid profile email",
        audience: "https://tmc-zordon-brain.herokuapp.com/"
      });
      //register with zordonbrain
      console.log(credentials);
      await setAccessToken(credentials.accessToken);
      try {
        const user = await login();
        await setUserId(user.id.toString());
        if (user.vin === null) {
          props.navigation.navigate("RegisterVin");
        } else {
          // re-persist the VIN in async storage
          props.navigation.navigate("App");
          await setVIN(user.vin);
        }
      } catch (error) {
        console.log("authentication error: ", error);
        Alert.alert(
          "Error while authenticating, make sure you're on Public WiFi."
        );
      }
    } catch (error) {
      console.log("Error", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Welcome to Ford VIP</Text>
      <TouchableOpacity style={styles.button} onPress={doAuth}>
        <Text>Authenticate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#1351d8"
  },
  button: {
    backgroundColor: "white",
    borderRadius: 4,
    padding: 10,
    color: "blue"
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});
