import React, {ChangeEvent, FormEvent, MutableRefObject, useEffect, useRef, useState} from 'react';
import { useFetch } from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';

import '../styles/scss/login&register.scss';
import {toastError, toastSuccess} from '../utils/toaster';

export const RegisterPage = () => {

  const nicknameRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
  const passwordRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
  const navigate = useNavigate();
  const {loading, request, error, clearError} = useFetch();
  const [authErrorMessageDetails, setAuthErrorMessageDetails] = useState<string | undefined>('');
  const [form, setForm] = useState({
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
    setForm({...form, [event.target.name]: event.target.value});
  };

  const registerHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await request('/auth/signup', {method: 'post', body: { ...form }});
      navigate('/login');
      toastSuccess('Successfully signed up');
    } catch (e) {
      return;
    }
  };

  return (
    <>
      <div className="auth-container">
        <form className="auth-card">
          <h2 className="action-title">Registration</h2>
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
              <label className="input-label" htmlFor="password">Password</label>
              <input
                ref = {passwordRef}
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
            <label>Already registered? </label>
            <button
              type="button"
              className="auth-link" 
              onClick={() => {navigate('/login');}
              }>
                Login
            </button>
          </div>
          <div className="auth-action">
            <button
              type='submit'
              className="auth-action-btn grow register"
              onClick={registerHandler}
              disabled={loading || !form.nickname || !form.password}
            >
              Register
            </button>
          </div>
          { authErrorMessageDetails &&
            <div className="error-details">
              {`* ${authErrorMessageDetails}`}
            </div>
          }
        </form>
      </div>
    </>
  );
};