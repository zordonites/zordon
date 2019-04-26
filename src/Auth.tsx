import React, { Component } from "react";
import {
  ActivityIndicator,
  StatusBar,
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { NavigationScreenProps } from "react-navigation";
import { getAccessToken, setAccessToken } from "./services/StorageService";
import { auth0 } from "./services/Auth0Service";
export class AuthLoadingScreen extends Component<NavigationScreenProps> {
  constructor(props: NavigationScreenProps) {
    super(props);
    this.checkForAccessToken();
  }

  checkForAccessToken = async () => {
    const userToken = await getAccessToken();

    this.props.navigation.navigate(userToken ? "App" : "Auth");
  };

  render() {
    return (
      <View>
        <ActivityIndicator />
        <Text>Hi!</Text>
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
      props.navigation.navigate("App");
      //check if vin exists in async storage
      // if not, check backend and populate async
      // if not in backend, route to vin entry
      //check if vin exists in backend
      //if exists then route to app view
      //else route to vin reg
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
