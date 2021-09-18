import "./i18n"
import "./utils/ignore-warnings"
import "react-native-gesture-handler"
import React, { useEffect } from "react"
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context"
import { Provider } from "react-redux"
import { BleManager } from "react-native-ble-plx"

import { store } from "./models/store"
import { initFonts } from "./theme/fonts" // expo
import { ToggleStorybook } from "../storybook/toggle-storybook"
import { bleManagerRef } from "./utils/bluetooth/BleHelper"
import { requestLocationPermissions } from "./utils/permissions"
import { AppNavigator } from "./navigators"

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

/**
 * This is the root component of our app.
 */
function App() {
  useEffect(() => {
    ;(async () => {
      await initFonts() // expo
      await requestLocationPermissions()
      bleManagerRef.current = new BleManager()
    })()
  }, [])

  return (
    <ToggleStorybook>
      <Provider store={store}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <AppNavigator />
        </SafeAreaProvider>
      </Provider>
    </ToggleStorybook>
  )
}

export default App
