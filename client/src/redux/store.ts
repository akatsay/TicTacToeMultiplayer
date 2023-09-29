import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from './reducers/authReducer';

const reducers = combineReducers({
  authReducer
});


// Create the Redux store
const store = configureStore({
  reducer: reducers,
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;