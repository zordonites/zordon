/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 *
 * @format
 */

import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import axios from "axios";
import {
  SiriShortcutsEvent,
  suggestShortcuts
  // @ts-ignore
} from "react-native-siri-shortcut";
import MapView from "react-native-maps";

const opts = {
  activityType: "com.ford.Zordon.sayHello", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Vehicle Location",
  userInfo: {
    foo: 1,
    bar: "baz",
    baz: 34.5
  },
  keywords: ["kek", "foo", "bar"],
  persistentIdentifier: "sayHello",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Where is my vehicle?",
  needsSave: true
};

interface Props {}
interface State {
  latitude: number;
  longitude: number;
}
export default class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0
    };
  }
  async componentDidMount() {
    SiriShortcutsEvent.addListener("SiriShortcutListener", this.handleShortcut);

    suggestShortcuts([opts]);
  }

  handleShortcut = async (options: any) => {
    const response = (await axios.get(
      "https://tmc-zordon-brain.herokuapp.com/vehicle-data"
    )) as any;

    this.setState({
      latitude: response.data.fields.location.lat.value,
      longitude: response.data.fields.location.lon.value
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
        <Text style={styles.welcome}>Ben's Info</Text>
        <Text style={styles.instructions}>Latitude: {this.state.latitude}</Text>
        <Text style={styles.instructions}>
          Longitude: {this.state.longitude}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
