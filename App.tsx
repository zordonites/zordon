import React, { useReducer, useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  PushNotificationIOS
} from "react-native";
import {
  SiriShortcutsEvent,
  suggestShortcuts,
  AddToSiriButton,
  SiriButtonStyles
} from "react-native-siri-shortcut";
import Tts from "react-native-tts";
import { vehicleLocation, fuelLevel, oilLife } from "./src/Shortcuts";
import FuelLevel from "./src/components/FuelLevel";
import OilLife from "./src/components/OilLife";
import { getVehicleData, getRemainingOilLife } from "./src/Network";
import { VehicleReducer } from "./src/reducers/VehicleDataReducer";
import VehicleMap from "./src/components/VehicleMap";
import {
  createAppContainer,
  createSwitchNavigator,
  NavigationScreenProps
} from "react-navigation";
import { AuthLoadingScreen, AuthScreen } from "./src/Auth";
import { clearStorage, getVIN } from "./src/services/StorageService";
import VIN from "./src/components/RegisterVin";
import styles from "./src/styles";
// TODO: Add a type for the particulare context
// @ts-ignore
export const VehicleDataContext = React.createContext();

const navigation = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App,
    Auth: AuthScreen,
    RegisterVin: VIN
  },
  {
    initialRouteName: "AuthLoading"
  }
);

function App(props: NavigationScreenProps) {
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

  const [currentScreen, setCurrentScreen] = useState("nav");

  const [vin, setVin] = useState<string | null>("");
  const [model, setModel] = useState<string | null>("");
  const [token, setToken] = useState("123123123123");

  useEffect(() => {
    Tts.getInitStatus().then(() => {
      Tts.setDucking(false);
      Tts.addEventListener("tts-finish", () => Tts.stop());
    });
    getVehicleData().then(data => {
      setModel(data.fields.model.value);
    });
    SiriShortcutsEvent.addListener("SiriShortcutListener", handleShortcut);
    suggestShortcuts([vehicleLocation, fuelLevel, oilLife]);
    getVIN().then(vin => setVin(vin));
  }, []);

  PushNotificationIOS.addEventListener("registrationError", (thing: any) =>
    console.log("registration error", thing)
  );
  PushNotificationIOS.addEventListener("register", (thing: any) => {
    Alert.alert(thing);
    console.log("token", thing);
  });
  PushNotificationIOS.addEventListener("notification", (thing: any) =>
    console.log("notification", thing)
  );
  PushNotificationIOS.addEventListener("localNotification", (thing: any) =>
    console.log("local notification", thing)
  );

  PushNotificationIOS.checkPermissions((permission: any) =>
    console.log(permission)
  );

  PushNotificationIOS.requestPermissions({
    alert: true,
    badge: true,
    sound: false
  });

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
    try {
      setCurrentScreen("oil");
      const data = await getRemainingOilLife();
      const minOilLife = data["min:oil_life_remaining"];
      const maxOilLife = data["max:oil_life_remaining"];

      let perDayOilLifeBurnRate = (maxOilLife - minOilLife) / 7;
      let fivePercentOffSet = 0.05 / (perDayOilLifeBurnRate / 100);
      let oilLifeRemaining = Math.floor(
        minOilLife / perDayOilLifeBurnRate - fivePercentOffSet
      );
      Tts.speak(
        `Based on your last week of driving, your oil requires changing in ${oilLifeRemaining} days`
      );
      vehicleDispatch({ type: "SET_OIL_LIFE", payload: oilLifeRemaining });
    } catch (error) {
      // TODO: handle failed condition for oil life
      console.log("we got an error :(", error);
    }
  }

  async function handleFuelLevel() {
    try {
      setCurrentScreen("fuel");
      const data = await getVehicleData();
      const fuelLevelPercentage = data.fields.fuel_level_percentage.value;
      Tts.speak(
        `Your fuel level is ${Math.round(fuelLevelPercentage)} percent`
      );
      vehicleDispatch({ type: "SET_FUEL_LEVEL", payload: fuelLevelPercentage });
    } catch (error) {
      // TODO: handle failed condition for fuel level
      console.log("we got an error :(", error);
    }
  }

  async function handleVehicleLocation() {
    try {
      setCurrentScreen("map");
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
    } catch (error) {
      // TODO: handle failed condition for vehicle location
      console.log("we got an error :(", error);
    }
  }

  async function logOut() {
    await clearStorage();
    // The below isn't working, looks to be a duplicate of
    // https://community.auth0.com/t/clearsession-not-returning-promise-unless-cancelled/22868
    // await auth0.webAuth.clearSession();
    props.navigation.navigate("Auth");
  }

  function route(): any {
    const screens = {
      nav: renderNav,
      fuel: renderFuel,
      oil: renderOil,
      map: renderMap
    };
    //@ts-ignore
    return screens[currentScreen]();
  }

  function renderMap() {
    return <VehicleMap navigate={() => setCurrentScreen("nav")} />;
  }

  function renderOil() {
    return <OilLife navigate={() => setCurrentScreen("nav")} />;
  }

  function renderFuel() {
    return <FuelLevel navigate={() => setCurrentScreen("nav")} />;
  }

  function renderNav() {
    return (
      <Nav
        vin={vin}
        model={model}
        navigate={props.navigation.navigate}
        handleFuelLevel={handleFuelLevel}
        handleOilLife={handleOilLife}
        handleVehicleLocation={handleVehicleLocation}
        logOut={logOut}
        token={token}
      />
    );
  }

  return (
    <VehicleDataContext.Provider value={[vehicleData, vehicleDispatch]}>
      <View style={styles.container}>{route()}</View>
    </VehicleDataContext.Provider>
  );
}

function Nav(props: any) {
  return (
    <View style={styles.nav}>
      <Text style={{ fontSize: 22, color: "black" }}>{props.token}</Text>

      <Text style={{ alignSelf: "center", fontSize: 22 }}>{props.vin}</Text>
      <Text style={{ alignSelf: "center", fontSize: 22 }}>{props.model}</Text>
      <TouchableOpacity
        style={styles.lightButton}
        onPress={props.handleFuelLevel}
      >
        <Text style={styles.text}>Fuel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.lightButton}
        onPress={props.handleOilLife}
      >
        <Text style={styles.text}>Oil</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.lightButton}
        onPress={props.handleVehicleLocation}
      >
        <Text style={styles.text}>Location</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.lightButton}
        onPress={() => props.navigate("RegisterVin")}
      >
        <Text style={styles.text}>Edit VIN</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.lightButton} onPress={props.logOut}>
        <Text style={styles.text}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

export default createAppContainer(navigation);
