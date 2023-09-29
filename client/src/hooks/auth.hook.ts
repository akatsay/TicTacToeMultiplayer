import {useState, useCallback, useEffect} from 'react';

const storageName = 'userData';

interface ISessionsStorageObject {
  token: string,
  nickname: string,
}

export const useAuth = () => {

  const [token, setToken] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);

  const [ready, setReady] = useState(false);

  const login = useCallback((jwtToken: string, nickname: string) => {
    setToken(jwtToken);
    setNickname(nickname);

    sessionStorage.setItem(storageName, JSON.stringify({
      token: jwtToken, nickname: nickname,
    }));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setNickname(null);
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

  return {login, logout, token, nickname, ready};
};