import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import database from "@react-native-firebase/database"

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

export const getTables = async () => {
  const tables = (await database().ref(`/tables`).once("value")).val()
  return tables
}
