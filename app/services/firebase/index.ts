import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import database from "@react-native-firebase/database"
import { Table, Workspace } from "../../models/features/settings/settingsSlice"

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

export const getTableByUid = async (uid: string) => {
  const tableRes = (await database().ref(`/users/${uid}/tables`).once("value")).val()
  const tables =
    tableRes &&
    (await Promise.all(
      Object.values(tableRes).map(async (e) => {
        const tableRes = (await database().ref(`/tables/${e.macId}`).once("value")).val()

        const table: Table = tableRes && {
          macId: tableRes.macId,
          usedBy: tableRes.usedBy,
          users: tableRes.users && Object.values(tableRes.users),
        }
        return table
      }),
    ))
  return tables?.filter((e) => e !== null)
}

export const getTableByMacId = async (uid: string) => {
  const tableRes = (await database().ref(`/users/${uid}/tables`).once("value")).val()
  const tables =
    tableRes &&
    (await Promise.all(
      Object.values(tableRes).map(async (e) => {
        const tableRes = (await database().ref(`/tables/${e.macId}`).once("value")).val()

        const table: Table = tableRes && {
          macId: tableRes.macId,
          usedBy: tableRes.usedBy,
          users: tableRes.users && Object.values(tableRes.users),
        }
        return table
      }),
    ))
  return tables?.filter((e) => e !== null)
}

export const getWorkspaces = async (uid: string) => {
  const workspaceRes = (await database().ref(`/users/${uid}/workspaces`).once("value")).val()
  const workspaces =
    workspaceRes &&
    (await Promise.all(
      Object.values(workspaceRes).map(async (e) => {
        const workspaceRes = (await database().ref(`/workspaces/${e.name}`).once("value")).val()

        const workspace: Workspace = workspaceRes && {
          name: e.name,
          tables: workspaceRes.tables && Object.values(workspaceRes.tables).map((e) => e.macId),
        }
        return workspace
      }),
    ))
  return workspaces?.filter((e) => e !== null)
}

export const checkIfTableRegistered = async (macId: string) => {
  const tableRes = (await database().ref(`/tables/${macId}`).once("value")).val()
}
