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
    const response = (await axios.get(
      "https://tmc-zordon-brain.herokuapp.com/vehicle-data"
    )) as any;

    this.setState({
      latitude: response.data.fields.location.lat.value,
      longitude: response.data.fields.location.lon.value
    });
  }

  render() {
    return (
      <View style={styles.container}>
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
