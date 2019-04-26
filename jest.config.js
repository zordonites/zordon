module.exports = {
  preset: "react-native",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|zordon|@react-navigation|react-native-maps|react-native-auth0)/)"
  ]
};
