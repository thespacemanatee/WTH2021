/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import React from "react"
import { useColorScheme } from "react-native"
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import {
  createDrawerNavigator,
  DrawerItemList,
  DrawerItem,
  DrawerContentScrollView,
} from "@react-navigation/drawer"

import { DashboardScreen, LoginScreen } from "../screens"
import { navigationRef } from "./navigation-utilities"
import { useStores } from "../models"
import { observer } from "mobx-react-lite"
import { Device } from "react-native-ble-plx"
import { AddTableScreen } from "../screens/add-table/add-table-screen"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type AuthNavigatorParamList = {
  Login: undefined
}

export type AppNavigatorParamList = {
  Dashboard: undefined
  AddTable: { device: Device }
}

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AuthNavigatorParamList>()
const Drawer = createDrawerNavigator<AppNavigatorParamList>()

const CustomDrawerContent = (props) => {
  const { settingsStore } = useStores()

  const handleLogout = () => {
    settingsStore.logout()
  }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Logout" onPress={handleLogout} />
    </DrawerContentScrollView>
  )
}

const AppStack = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="AddTable" component={AddTableScreen} />
    </Drawer.Navigator>
  )
}

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  )
}

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer((props: NavigationProps) => {
  const colorScheme = useColorScheme()
  const { settingsStore } = useStores()

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      {settingsStore.currentlyLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
})

AppNavigator.displayName = "AppNavigator"

const exitRoutes = ["login", "dashboard"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
