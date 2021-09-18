import { Alert, Platform } from "react-native"
import { check, request, PERMISSIONS, RESULTS, Rationale } from "react-native-permissions"

const rationale: Rationale = {
  title: "Permissions",
  message: "Location permission is required for bluetooth functionality.",
  buttonPositive: "OK",
  buttonNegative: "Cancel",
}

export const requestLocationPermissions = async (): Promise<boolean> => {
  const LOCATION_PERMISSION =
    Platform.OS === "ios"
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION

  try {
    let status = await check(LOCATION_PERMISSION)
    switch (status) {
      case RESULTS.GRANTED: {
        return true
      }
      case RESULTS.DENIED: {
        status = await request(LOCATION_PERMISSION, rationale)
        switch (status) {
          case RESULTS.GRANTED: {
            return true
          }
          default: {
            Alert.alert("Error", "Location permission denied.")
            return false
          }
        }
      }
      case RESULTS.BLOCKED || RESULTS.LIMITED: {
        Alert.alert(
          "Error",
          "Location permission cannot be requested. Please manually enable permissions in settings.",
        )
        return false
      }
      case RESULTS.UNAVAILABLE: {
        Alert.alert("Error", "This feature is unavailable on your device.")
        return false
      }
    }
  } catch (err) {
    console.warn(err)
    return false
  }
  return true
}
