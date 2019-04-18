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
import MapView, { Marker } from "react-native-maps";
// @ts-ignore
import Tts from "react-native-tts";

const vehicleLocation = {
  activityType: "com.ford.Zordon.sayHello", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Vehicle Location",
  userInfo: {},
  keywords: ["location"],
  persistentIdentifier: "sayHello",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Where is my vehicle?",
  needsSave: true
};

const fuelLevel = {
  activityType: "com.ford.Zordon.fuelLevel",
  title: "Current Fuel Level",
  userInfo: {},
  keywords: ["fuel"],
  persistentIdentifier: "fuelLevel",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How much fuel is in my car?",
  needsSave: true
};

interface Props {}
interface State {
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  oilLifeRemaining: number;
  fuelLevel: number;
}
export default class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      oilLifeRemaining: 0,
      fuelLevel: 0
    };
  }
  async componentDidMount() {
    SiriShortcutsEvent.addListener("SiriShortcutListener", this.handleShortcut);

    suggestShortcuts([vehicleLocation, fuelLevel]);
  }

  handleShortcut = async ({
    userInfo,
    activityType
  }: {
    userInfo: any;
    activityType: string;
  }) => {
    if (activityType === "com.ford.Zordon.sayHello") {
      await this.handleVehicleLocation();
    }
    if (activityType === "com.ford.Zordon.fuelLevel") {
      const response = (await axios.get(
        // "https://tmc-zordon-brain.herokuapp.com/vehicle-data",
        "http://localhost:8080/vehicle-data"
      )) as any;
      const fuelLevelPercentage =
        response.data.fields.fuel_level_percentage.value;
      Tts.speak(
        `Your fuel level is ${Math.round(fuelLevelPercentage)} percent`
      );
      this.setState({
        fuelLevel: fuelLevelPercentage
      });
    }
  };

  private async handleVehicleLocation() {
    const response = (await axios.get(
      // "https://tmc-zordon-brain.herokuapp.com/vehicle-data",
      "http://localhost:8080/vehicle-data"
    )) as any;
    this.setState({
      region: {
        latitude: response.data.fields.location.lat.value,
        longitude: response.data.fields.location.lon.value,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    });
  }

  render() {
    return (
      <>
        <View style={styles.container}>
          <View style={styles.header}>
            {this.state.fuelLevel > 0 && (
              <Text>Fuel Level: {Math.round(this.state.fuelLevel)}%</Text>
            )}
            <Text>Oil Life Remaining: {this.state.oilLifeRemaining}</Text>
          </View>
          <View style={styles.mapContainer}>
            <MapView style={styles.map} region={this.state.region}>
              <Marker
                coordinate={{
                  latitude: this.state.region.latitude,
                  longitude: this.state.region.longitude
                }}
                title="ITS BEN"
                description="There he at"
              />
            </MapView>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch"
  },
  header: {
    height: "20%",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  mapContainer: {
    justifyContent: "flex-end"
  },
  map: {
    height: "90%"
  }
});
