/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type User = {
  uid: string
  name: string
  email: string
}

export type Request = {
  macId: string
  requestedBy: string
  accepted: boolean
}

export type Workspace = {
  name: string
  tables: string[]
}

export type Table = {
  macId: string
  usedBy: string
  users: {
    name: string
    uid: string
  }[]
}

export type LoginUser = {
  user: User
  requests: Request[]
  workSpaces: Workspace[]
}

interface SettingsState {
  currentUser: User
  dashboardTables: Table[]
  dashboardWorkspaces: Workspace[]
  requests: Request[]
  workSpaces: Workspace[]
}

const initialState: SettingsState = {
  currentUser: null,
  dashboardTables: null,
  dashboardWorkspaces: null,
  requests: null,
  workSpaces: null,
}
export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<LoginUser>) => {
      const { user, requests, workSpaces } = action.payload
      state.currentUser = user
      state.requests = requests
      state.workSpaces = workSpaces
    },
    logoutUser: (state) => {
      state.currentUser = null
    },
    updateDashboardTables: (state, action: PayloadAction<Table[]>) => {
      state.dashboardTables = action.payload
    },
    updateDashboardWorkspaces: (state, action: PayloadAction<Workspace[]>) => {
      state.dashboardWorkspaces = action.payload
    },
  },
})

export const { loginUser, logoutUser, updateDashboardTables, updateDashboardWorkspaces } =
  settingsSlice.actions

export default settingsSlice.reducer
