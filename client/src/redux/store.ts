import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from './reducers/authReducer';
import gameSessionReducer from './reducers/gameSessionReducer';

const reducers = combineReducers({
  auth: authReducer,
  gameSession: gameSessionReducer
});


// Create the Redux store
const store = configureStore({
  reducer: reducers,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;