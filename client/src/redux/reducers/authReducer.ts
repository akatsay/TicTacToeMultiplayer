import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type RootState = {
  auth: IReducerState
}
interface IReducerState {
  jwtToken: string | null,
  nickname: string | null,
  isAuthenticated: boolean
}

const initialState: IReducerState = {
  jwtToken: null,
  nickname: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    appLogin: (state: IReducerState, action: PayloadAction<{ jwtToken: string; nickname: string }>) => {
      state.nickname = action.payload.nickname;
      state.jwtToken = action.payload.jwtToken;
      state.isAuthenticated = true;
    },
    appLogout: (state: IReducerState) => {
      state.nickname = null;
      state.jwtToken = null;
      state.isAuthenticated = false;
    },
    updateNickname: (state: IReducerState, action: PayloadAction<{ nickname: string }>) => {
      state.nickname = action.payload.nickname;
    }
  },
});

export const { appLogin, appLogout, updateNickname } = authSlice.actions;
export const selectToken = (state: RootState) => state.auth?.jwtToken;
export const selectNickname = (state: RootState) => state.auth?.nickname;
export const selectAuthStatus = (state: RootState) => state.auth?.isAuthenticated;
export default authSlice.reducer;