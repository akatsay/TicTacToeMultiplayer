import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type RootState = {
  gameSession: IReducerState
}
interface IReducerState {
  room: string
}

const initialState: IReducerState = {
  room: ''
};

const gameSessionSlice = createSlice({
  name: 'gameSession',
  initialState,
  reducers: {
    joinGameSession: (state: IReducerState, action: PayloadAction<{ room: string }>) => {
      state.room = action.payload.room;
    },
    leaveGameSession: (state: IReducerState) => {
      state.room = '';
    },
  },
});

export const { joinGameSession, leaveGameSession } = gameSessionSlice.actions;
export const selectRoom = (state: RootState) => state.gameSession?.room;
export default gameSessionSlice.reducer;