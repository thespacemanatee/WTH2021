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
import { logoutUser, Workspace } from "../models/features/settings/settingsSlice"
import TableScreen from "../screens/table/table-screen"
import WorkspaceScreen from "../screens/workspace-screen/workspace-screen"

export type AuthNavigatorParamList = {
  Login: undefined
}

export type DashboardNavigatorParamList = {
  Dashboard: undefined
  Table: { macId: string }
  Workspace: { workspace: Workspace }
  AddTable: { device: Device }
}

export type AppNavigatorParamList = {
  DashboardStack: undefined
}

const AuthStack = createNativeStackNavigator<AuthNavigatorParamList>()
const DashboardStack = createNativeStackNavigator<DashboardNavigatorParamList>()
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
      initialRouteName="DashboardStack"
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="DashboardStack" component={DashboardStackNavigator} />
    </Drawer.Navigator>
  )
}

const DashboardStackNavigator = () => {
  return (
    <DashboardStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Dashboard"
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Table" component={TableScreen} />
      <Drawer.Screen name="Workspace" component={WorkspaceScreen} />
      <Drawer.Screen name="AddTable" component={AddTableScreen} />
    </DashboardStack.Navigator>
  )
}

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Login"
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  )
}

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = (props: NavigationProps) => {
  const currentUser = useAppSelector((state) => state.settings.currentUser)
  const colorScheme = useColorScheme()

  return (
    <NavigationContainer theme={colorScheme === "dark" ? DarkTheme : DefaultTheme} {...props}>
      {currentUser ? <AppStack /> : <AuthStackNavigator />}
    </NavigationContainer>
  )
}

AppNavigator.displayName = "AppNavigator"

const exitRoutes = ["login", "dashboard"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
