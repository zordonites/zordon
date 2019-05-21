import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: "center"
    // alignItems: "stretch"
  },
  nav: {
    display: "flex",
    height: "100%",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  button: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#103556",
    borderColor: "#4c555c",
    borderWidth: 2,
    borderRadius: 15,
    height: "10%",
    alignItems: "center"
  },
  lightButton: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 2,
    marginTop: 15,
    height: "8%",
    width: "90%",
    alignItems: "center"
  },
  centered: {
    display: "flex",
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  mapContainer: {
    justifyContent: "flex-end"
  },
  map: {
    height: "85%"
  },
  text: { alignSelf: "center", fontSize: 22, marginBottom: 10 },
  input: {
    height: "4%",
    marginBottom: 20,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 2,
    textAlign: "center",
    width: "90%"
  }
});

export default styles;
