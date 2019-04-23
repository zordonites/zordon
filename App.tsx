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
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import axios from "axios";
import {
  SiriShortcutsEvent,
  suggestShortcuts
} from "react-native-siri-shortcut";
import MapView, { Marker } from "react-native-maps";
import Tts from "react-native-tts";
import { vehicleLocation, fuelLevel, oilLife } from "./src/Shortcuts";
import FuelLevel from "./src/components/FuelLevel";
import OilLife from "./src/components/OilLife";

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

export const VehicleDataContext = React.createContext({
  oilLifeRemaining: 0,
  fuelLevel: 0
});
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
      Tts.setDucking("false");
      Tts.addEventListener("tts-finish", () => Tts.stop());
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
      await this.handleOilLife();
    }
  };

  private async handleOilLife() {
    const response = await axios.get(oilLifeEndpoint);
    const minOilLife = response.data["min:oil_life_remaining"];
    const maxOilLife = response.data["max:oil_life_remaining"];

    let perDayOilLifeBurnRate = (maxOilLife - minOilLife) / 7;
    let fivePercentOffSet = 0.05 / (perDayOilLifeBurnRate / 100);
    let oilLifeRemaining = Math.floor(
      minOilLife / perDayOilLifeBurnRate - fivePercentOffSet
    );
    Tts.speak(`Your oil life is ${oilLifeRemaining} days`);
    this.setState({
      oilLifeRemaining
    });
  }

  private async handleFuelLevel() {
    const response = (await axios.get(vehicleDataEndpoint)) as any;
    const fuelLevelPercentage =
      response.data.fields.fuel_level_percentage.value;
    Tts.speak(`Your fuel level is ${Math.round(fuelLevelPercentage)} percent`);
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
            <VehicleDataContext.Provider value={this.state}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.handleFuelLevel()}
                >
                  <Text>Get Fuel Level</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.handleOilLife()}
                >
                  <Text>Get Oil Life Remaining</Text>
                </TouchableOpacity>
              </View>
              <FuelLevel />
              <OilLife />
            </VehicleDataContext.Provider>
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
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row"
  },
  button: {
    flex: 1,
    backgroundColor: "#00aeef",
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 15,
    alignItems: "center"
  }
});
