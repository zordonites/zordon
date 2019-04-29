### TODOS

- Display a button for registering/editing vin
- Move vehicle data / map to other pages
  - Display vehicle data (Model, year) near VIN
- Make shortcut screen

#### Code cleanup

- Better error handling for network calls

  - VIN scan via QR code
  - List of VINs, claim which one is yours
  - Attach VIN to necessary network calls
  - Display VIN at top of screen

- Error handling in app (investigate native Alert class, https://facebook.github.io/react-native/docs/alert)
- Generify StorageService class?
- Properly logout of Auth0 (investigate why auth0.webAuth.clearSession() is acting odd)
- Move voice listener stuff into React Context
  - useEffects for listener events
  - pull it out of App.tsx, or make App.tsx provide the global/domain context for child components
  - Remove reducer

#### Other cleanup

- Testflight
- Reconcile all this stuff with what's in pivotal tracker
