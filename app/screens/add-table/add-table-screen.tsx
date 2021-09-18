import React, { useCallback, useEffect } from "react"
import { Alert, StyleSheet, View } from "react-native"
import { Formik } from "formik"
import * as Yup from "yup"
import axios from "axios"

import { Button, Screen, Text, TextField } from "../../components"
import { color } from "../../theme"
import { Subscription } from "react-native-ble-plx"
import { useNavigation } from "@react-navigation/core"
import { useAppSelector } from "../../models/hooks"

const styles = StyleSheet.create({
  root: {
    backgroundColor: color.palette.black,
    flex: 1,
  },
  button: {
    margin: 16,
  },
  buttonText: {
    fontSize: 16,
  },
})

export const AddTableScreen = ({ route }) => {
  const currentUser = useAppSelector((state) => state.settings.currentUser)
  const { device } = route.params
  const navigation = useNavigation()

  console.log(device.id)

  const disconnectDevice = useCallback(async () => {
    const isDeviceConnected = await device.isConnected()
    if (isDeviceConnected) {
      await device.cancelConnection()
    }
  }, [device])

  const handleSubmit = async (values: { email: string }) => {
    try {
      console.log({
        email: values.email,
        macId: device.id,
        uid: currentUser.uid,
      })
      const res = await axios({
        method: "put",
        url: "",
        data: {
          email: values.email,
          macId: device.id,
          uid: currentUser.uid,
        },
      })

      console.log(res)

      navigation.reset({
        index: 0,
        routes: [{ name: "Dashboard" }],
      })
    } catch (err) {
      Alert.alert("Error", err.message)
    }
  }

  useEffect(() => {
    let subscription: Subscription | null
    const getDeviceInformation = async () => {
      let connectedDevice = device
      try {
        if (!(await device.isConnected())) {
          connectedDevice = await device.connect()
        }
        console.log(connectedDevice)

        subscription = device.onDisconnected(() => {
          Alert.alert("Disconnected", "Device was disconnected")
        })
      } catch (err) {
        console.error(err)
        Alert.alert("Error", "Could not connect to selected device")
      }
    }

    getDeviceInformation()
    return () => {
      subscription?.remove()
      disconnectDevice()
    }
  }, [device])

  return (
    <Screen style={styles.root} preset="scroll">
      <Text preset="header" text="Invite Table Partner" style={{ fontSize: 36, margin: 16 }} />
      <Text preset="default" text="Add a friend" style={{ fontSize: 18, marginHorizontal: 16 }} />
      <Formik
        initialValues={{ email: "" }}
        validationSchema={Yup.object({
          email: Yup.string().email("Invalid email address").required("Required"),
        })}
        onSubmit={(values) => {
          console.log(values)
          handleSubmit(values)
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, errors, values }) => (
          <View>
            {/* <Text text={errors.email} preset="secondary" style={{ color: color.error }} /> */}
            <TextField
              label={errors.email}
              labelColor="red"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              style={{ margin: 16 }}
            />
            <Button
              text="Register"
              style={styles.button}
              textStyle={styles.buttonText}
              onPress={handleSubmit}
            />
          </View>
        )}
      </Formik>
    </Screen>
  )
}
