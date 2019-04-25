import React, { useReducer } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  SiriShortcutsEvent,
  suggestShortcuts
} from "react-native-siri-shortcut";
import Tts from "react-native-tts";
import { vehicleLocation, fuelLevel, oilLife } from "./src/Shortcuts";
import FuelLevel from "./src/components/FuelLevel";
import OilLife from "./src/components/OilLife";
import { getVehicleData, getRemainingOilLife } from "./src/Network";
import { VehicleReducer } from "./src/reducers/VehicleDataReducer";
import VehicleMap from "./src/components/VehicleMap";
import {
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator
} from "react-navigation";
import { AuthLoadingScreen, AuthScreen } from "./src/Auth";

// TODO: Add a type for the particulare context
// @ts-ignore
export const VehicleDataContext = React.createContext();

const navigation = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App,
    Auth: AuthScreen
  },
  {
    initialRouteName: "AuthLoading"
  }
);

function App() {
  // TODO: Move this initial state or creation of this reducer somewhere else?
  const [vehicleData, vehicleDispatch] = useReducer(VehicleReducer, {
    fuelLevel: 0,
    oilLifeRemaining: 0,
    region: {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    }
  });

  // TODO: Move this text-to-speech and listener stuff elsewhere?
  // UseEffect hook?
  (function setup() {
    Tts.getInitStatus().then(() => {
      Tts.setDucking("false");
      Tts.addEventListener("tts-finish", () => Tts.stop());
    });
    SiriShortcutsEvent.addListener("SiriShortcutListener", handleShortcut);

    suggestShortcuts([vehicleLocation, fuelLevel, oilLife]);
  })();

  async function handleShortcut({
    userInfo,
    activityType
  }: {
    userInfo: any;
    activityType: string;
  }) {
    if (activityType === "com.ford.Zordon.sayHello") {
      await handleVehicleLocation();
    }
    if (activityType === "com.ford.Zordon.fuelLevel") {
      await handleFuelLevel();
    }

    if (activityType === "com.ford.Zordon.oilLife") {
      await handleOilLife();
    }
  }

  // TODO: Move handlers elsewhere? Or is this a good spot
  async function handleOilLife() {
    const data = await getRemainingOilLife();
    const minOilLife = data["min:oil_life_remaining"];
    const maxOilLife = data["max:oil_life_remaining"];

    let perDayOilLifeBurnRate = (maxOilLife - minOilLife) / 7;
    let fivePercentOffSet = 0.05 / (perDayOilLifeBurnRate / 100);
    let oilLifeRemaining = Math.floor(
      minOilLife / perDayOilLifeBurnRate - fivePercentOffSet
    );
    Tts.speak(`Your oil life is ${oilLifeRemaining} days`);
    vehicleDispatch({ type: "SET_OIL_LIFE", payload: oilLifeRemaining });
  }

  async function handleFuelLevel() {
    const data = await getVehicleData();
    const fuelLevelPercentage = data.fields.fuel_level_percentage.value;
    Tts.speak(`Your fuel level is ${Math.round(fuelLevelPercentage)} percent`);
    vehicleDispatch({ type: "SET_FUEL_LEVEL", payload: fuelLevelPercentage });
  }

  async function handleVehicleLocation() {
    const data = await getVehicleData();
    vehicleDispatch({
      type: "SET_VEHICLE_LOCATION",
      payload: {
        latitude: data.fields.location.lat.value,
        longitude: data.fields.location.lon.value,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    });
  }

  return (
    <VehicleDataContext.Provider value={[vehicleData, vehicleDispatch]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleFuelLevel()}
            >
              <Text>Get Fuel Level</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleOilLife()}
            >
              <Text>Get Oil Life Remaining</Text>
            </TouchableOpacity>
          </View>
          <FuelLevel />
          <OilLife />
        </View>
        <VehicleMap />
      </View>
    </VehicleDataContext.Provider>
  );
}

export default createAppContainer(navigation);

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
