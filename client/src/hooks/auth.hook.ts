import {useState, useCallback, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {selectAuthStatus, selectNickname, selectToken} from '../redux/reducers/authReducer';
import {useAppDispatch} from '../redux/store';
import { appLogin, appLogout } from '../redux/reducers/authReducer';

const storageName = 'userData';

interface ISessionsStorageObject {
  token: string,
  nickname: string,
}

export const useAuth = () => {

  const token = useSelector(selectToken);
  const nickname = useSelector(selectNickname);
  const isAuthenticated = useSelector(selectAuthStatus);
  const appDispatch = useAppDispatch();

  const [ready, setReady] = useState(false);

  const login = useCallback((jwtToken: string, nickname: string) => {
    appDispatch(appLogin({jwtToken, nickname}));
    sessionStorage.setItem(storageName, JSON.stringify({
      token: jwtToken, nickname: nickname,
    }));

  }, []);

  const logout = useCallback(() => {
    appDispatch(appLogout());
    sessionStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const storedData: string | null = sessionStorage.getItem(storageName);
    const data: ISessionsStorageObject = JSON.parse(storedData ?? '{}');

    if (data && data.token) {
      login(data.token, data.nickname);
    }

    setReady(true);

  }, [login]);

  return {login, logout, token, nickname, isAuthenticated, ready};
};