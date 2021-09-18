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

export type WorkSpace = {
  name: string
  tables: Table[]
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
  workSpaces: WorkSpace[]
}

interface SettingsState {
  currentUser: User
  dashboardTables: Table[]
  requests: Request[]
  workSpaces: WorkSpace[]
}

const initialState: SettingsState = {
  currentUser: null,
  dashboardTables: null,
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
  },
})

export const { loginUser, logoutUser, updateDashboardTables } = settingsSlice.actions

export default settingsSlice.reducer
