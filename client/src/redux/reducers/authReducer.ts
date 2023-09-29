import { createSlice } from '@reduxjs/toolkit';

interface IReducerState {
  token: string | null,
  nickname: string | null,
  isAuthenticated: boolean
}

function noop() {return;}

const initialState: IReducerState = {
  token: null,
  nickname: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {value: initialState},
  reducers: {

  },
});

export const { } = authSlice.actions;
export default authSlice.reducer;