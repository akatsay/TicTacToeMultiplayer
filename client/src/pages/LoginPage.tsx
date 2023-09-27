import React, { MutableRefObject, useContext, useEffect, useRef, useState, ChangeEvent, FormEvent } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useFetch } from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';

import '../styles/scss/login&register.scss';
import { toastError, toastSuccess } from '../utils/toaster';

interface IFormState {
  nickname: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const nicknameRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
  const passwordRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
  const navigate = useNavigate();
  const { loading, request, error, clearError } = useFetch<any>();
  const [authErrorMessageDetails, setAuthErrorMessageDetails] = useState<string | undefined>('');
  const [form, setForm] = useState<IFormState>({
    nickname: '',
    password: ''
  });

  useEffect(() => {
    if (error) {
      toastError(error.message);
      if (error.cause !== undefined && nicknameRef.current && passwordRef.current) {
        if (error.cause === 'nickname') {
          nicknameRef.current.focus();
          nicknameRef.current.style.borderBottomColor = '#FF7276';
          passwordRef.current.style.borderBottomColor = '';
          passwordRef.current.value = '';
        } else if (error.cause === 'password') {
          passwordRef.current.focus();
          nicknameRef.current.style.borderBottomColor = '';
          passwordRef.current.style.borderBottomColor = '#FF7276';
          passwordRef.current.value = '';
        }
        setAuthErrorMessageDetails(error.message);
      }
      clearError();
    }
  }, [error, clearError]);

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const loginHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await request('http://localhost:5000/auth/signin', {method: 'post', body: { ...form }});
      auth.login(data.token, data.userId, data.name, data.email);
      toastSuccess(data.message);
    } catch (e) {
      return;
    }
  };

  return (
    <>
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="action-title">Login</h2>
          <div className="auth-inputs-container">
            <div className="input-field nickname-field">
              <label className="input-label" htmlFor="nickname">
                Nickname
              </label>
              <input
                ref={nicknameRef}
                className="input input-nickname"
                placeholder="Input nickname"
                id="nickname"
                name="nickname"
                type="nickname"
                value={form.nickname}
                onChange={changeHandler}
              />
            </div>
            <div className="input-field password-field">
              <label className="input-label" htmlFor="password">
                Password
              </label>
              <input
                ref={passwordRef}
                className="input input-password"
                placeholder="Input password"
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={changeHandler}
              />
            </div>
          </div>
          <div className="auth-action-choice">
            <label>Not registered yet? </label>
            <button className="auth-link" onClick={() => navigate('/register')}>
              Register
            </button>
          </div>
          <div className="auth-action">
            <button
              className="auth-action-btn grow login"
              onClick={loginHandler}
              disabled={loading || !form.nickname || !form.password}
            >
              Login
            </button>
          </div>
          {authErrorMessageDetails &&
            <div className="error-details">
              * {authErrorMessageDetails}
            </div>
          }
        </div>
      </div>
    </>
  );
};