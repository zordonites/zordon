const rn = require("react-native");
jest.mock("react-native-tts", () => {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  };
});
module.exports = rn;
