import React, { Component } from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
  Text,
  Button
} from "react-native";
import { NavigationScreenProps } from "react-navigation";
import Auth0 from "react-native-auth0";
export class AuthLoadingScreen extends Component<NavigationScreenProps> {
  constructor(props: NavigationScreenProps) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem("userToken");

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(false ? "App" : "Auth");
  };

  // Render any loading content that you like here
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

export function AuthScreen() {
  const auth0 = new Auth0({
    domain: "zordon.auth0.com",
    clientId: "eAIg25s5501ZKgmHJ4vVcgAG6f4KjyhO"
  });
  function doAuth() {
    console.log("sup");
    auth0.webAuth
      .authorize({
        scope: "openid profile email",
        audience: "https://zordon.auth0.com/userinfo"
      })
      .then(
        credentials => console.log(credentials)
        // Successfully authenticated
        // Store the accessToken
      )
      .catch(error => console.log(error));
  }

  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Text>WHERE AM I</Text>
      <Button title="Sign Up" onPress={doAuth} />
    </View>
  );
}
