import React, { Component } from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
  Text
} from "react-native";
import { NavigationScreenProps } from "react-navigation";
// import { NavigationScreenProps } from "react-navigation";

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
    setTimeout(() => {
      this.props.navigation.navigate(false ? "App" : "Auth");
    }, 2000);
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
