export function VehicleReducer(state: any, action: any) {
  switch (action.type) {
    case "SET_FUEL_LEVEL":
      return {
        ...state,
        fuelLevel: action.payload
      };
    case "SET_OIL_LIFE":
      return {
        ...state,
        oilLifeRemaining: action.payload
      };
    case "SET_VEHICLE_LOCATION":
      return {
        ...state,
        region: action.payload
      };
    default:
      return state;
  }
}
