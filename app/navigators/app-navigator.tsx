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
import { Device } from "react-native-ble-plx"
import { AddTableScreen } from "../screens/add-table/add-table-screen"
import { useAppSelector } from "../models/hooks"
import { useDispatch } from "react-redux"
import { logoutUser } from "../models/features/settings/settingsSlice"

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

  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logoutUser())
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

export const AppNavigator = (props: NavigationProps) => {
  const currentUser = useAppSelector((state) => state.settings.currentUser)
  const colorScheme = useColorScheme()

  return (
    <NavigationContainer theme={colorScheme === "dark" ? DarkTheme : DefaultTheme} {...props}>
      {currentUser ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

AppNavigator.displayName = "AppNavigator"

const exitRoutes = ["login", "dashboard"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
