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
} from "react-native-siri-shortcut";
import MapView, { Marker } from "react-native-maps";
import Tts from "react-native-tts";
import { vehicleLocation, fuelLevel, oilLife } from "./src/Shortcuts";

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
const vehicleDataEndpoint =
  "https://tmc-zordon-brain.herokuapp.com/vehicle-data";
const oilLifeEndpoint = "https://tmc-zordon-brain.herokuapp.com/oil-life";

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
    Tts.getInitStatus().then(() => {
      Tts.setDucking("true");
    });
    SiriShortcutsEvent.addListener("SiriShortcutListener", this.handleShortcut);

    suggestShortcuts([vehicleLocation, fuelLevel, oilLife]);
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
      await this.handleFuelLevel();
    }

    if (activityType === "com.ford.Zordon.oilLife") {
      const response = await axios.get(oilLifeEndpoint);
      const minOilLife = response.data["min:oil_life_remaining"];
      const maxOilLife = response.data["max:oil_life_remaining"];

      // @ts-ignore
      let x = (maxOilLife - minOilLife) / 7;

      // @ts-ignore
      let daysUntilOilChange = minOilLife / x;
      console.log(daysUntilOilChange);
    }
  };

  private async handleFuelLevel() {
    const response = (await axios.get(vehicleDataEndpoint)) as any;
    const fuelLevelPercentage =
      response.data.fields.fuel_level_percentage.value;
    Tts.getInitStatus().then(() => {
      Tts.speak(
        `Your fuel level is ${Math.round(fuelLevelPercentage)} percent`
      );
    });
    Tts.stop();
    this.setState({
      fuelLevel: fuelLevelPercentage
    });
  }

  private async handleVehicleLocation() {
    const response = (await axios.get(vehicleDataEndpoint)) as any;
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
                title="My Vehicle"
                description="F150"
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
