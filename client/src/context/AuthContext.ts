import { createContext } from 'react';

interface IAppContext {
  token: string | null,
  nickname: string | null,
  login: (jwtToken: string, nickname: string) => void
  logout: () => void
  isAuthenticated: boolean
}
function noop() {return;}

export const AuthContext = createContext<IAppContext>({
  token: null,
  nickname: null,
  login: noop,
  logout: noop,
  isAuthenticated: false
});