import { createContext } from 'react';

function noop() {return;}

export const AuthContext = createContext({
  token: null,
  userId: null,
  userName: null,
  userEmail: null,
  login: noop,
  logout: noop,
  isAuthenticated: false
});