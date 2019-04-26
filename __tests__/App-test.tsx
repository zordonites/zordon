/**
 * @format
 */

import "react-native";
import React from "react";
import App from "../App";
import { render } from "react-native-testing-library";
import * as StorageService from "../src/services/StorageService";

it("renders correctly", async () => {
  jest.spyOn(StorageService, "getAccessToken").mockResolvedValue("true");
  const { debug } = render(<App />);
  debug();
});
