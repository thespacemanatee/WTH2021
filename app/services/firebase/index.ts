import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import database from "@react-native-firebase/database"
import { Table } from "../../models/features/settings/settingsSlice"

export const createUserWithEmailAndPassword = async (
  email: string,
  password: string,
): Promise<FirebaseAuthTypes.UserCredential> => {
  const userCredentials = await auth().createUserWithEmailAndPassword(email, password)
  return userCredentials
}

export const signInWithEmailAndPassword = async (
  email: string,
  password: string,
): Promise<FirebaseAuthTypes.UserCredential> => {
  const userCredentials = await auth().signInWithEmailAndPassword(email, password)
  return userCredentials
}

export const getTables = async (uid: string) => {
  const tableRes = (await database().ref(`/users/${uid}/tables`).once("value")).val()
  const tables = await Promise.all(
    Object.values(tableRes).map(async (e) => {
      const tableRes = (await database().ref(`/tables/${e.macId}`).once("value")).val()

      const table: Table = {
        macId: tableRes.macId,
        usedBy: tableRes.usedBy,
        users: Object.values(tableRes.users),
      }
      return table
    }),
  )
  return tables
}
