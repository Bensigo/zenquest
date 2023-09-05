/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { type AppState } from ".";
import { type Session } from "next-auth";

export type User = {
  email: string;
  id: string;
  image?: string;
  name: string;
};
export interface AuthState {
  session: Session | undefined
}

const initialState: AuthState = {
  session: undefined,
};


export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSessionState: (state, action: PayloadAction<Session | undefined>) => {
        state.session = action.payload;
      },
  },
  extraReducers:  {
    [HYDRATE]: (state, action) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return {
          ...state,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          ...(action?.payload.auth || {}),
        }
      },
 }
});

export const { setSessionState } = authSlice.actions

export const selectUser  = (state: AppState) => state.auth.session?.user

export default authSlice.reducer;