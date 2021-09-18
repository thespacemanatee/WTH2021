import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"

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