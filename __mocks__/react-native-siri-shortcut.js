const rn = require("react-native");
jest.mock("react-native-tts", () => {
  return {};
});
module.exports = rn;
