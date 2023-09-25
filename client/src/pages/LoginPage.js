import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast, Slide } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useNavigate } from 'react-router-dom';

import '../styles/scss/login&register.scss';


export const LoginPage = () => {

  const auth = useContext(AuthContext);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const {loading, request, error, clearError} = useHttp();
  const [authErrorMessageDetails, setAuthErrorMessageDetails] = useState({});
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message, {
        style: {backgroundColor: '#555', color: 'white'},
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Slide,
      });
      if (error.cause !== undefined) {
        if (error.cause.origin === 'email') {
          emailRef.current.focus();
          emailRef.current.style.borderBottomColor = '#FF7276';
          passwordRef.current.style.borderBottomColor = '';
          passwordRef.current.value = '';
        } else if (error.cause.origin === 'password') {
          passwordRef.current.focus();
          emailRef.current.style.borderBottomColor = '';
          passwordRef.current.style.borderBottomColor = '#FF7276';
          passwordRef.current.value = '';
        }
        setAuthErrorMessageDetails(error.cause);
      }
      clearError();
    }
  }, [error, clearError]);

  const changeHandler = (event) => {
    setForm({...form, [event.target.name]: event.target.value});
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const data = await request('api/auth/login', 'post', {...form});
      auth.login(data.token, data.userId, data.name, data.email);
      toast.success(data.message, {
        style: {backgroundColor: '#555', color: 'white'},
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Slide,
      });

    } catch (e) {

    }
  };

  return (
    <>
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="action-title">Login</h2>
          <div className="auth-inputs-container">
            <div className="input-field email-field">
              <label className="input-label" htmlFor="email">Email</label>
              <input
                ref = {emailRef}
                className="input input-email"
                placeholder="Input email"
                id="email"
                name="email"
                type="email"
                value={form.email}
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
            <label>Not regisered yet? </label>
            <button 
              className="auth-link" 
              onClick={() => {navigate('/register');}
              }>
                        Register
            </button>
          </div>
          <div className="auth-action">
            <button
              className="auth-action-btn grow login"
              onClick={loginHandler}
              disabled={loading ? true : false}
            >
                        Login
            </button>
          </div>
          { JSON.stringify(authErrorMessageDetails) === '{}'
            ? 
            null
            :
            <div className="error-details">
                            * {authErrorMessageDetails.details}
            </div>
          }
        </div>
      </div>
    </>
  );
};