import React, { useEffect, useRef, useState } from 'react';
import { toast, Slide } from 'react-toastify';
import { useHttp } from '../hooks/http.hook';
import { useNavigate } from 'react-router-dom';

import '../styles/scss/login&register.scss';

export const RegisterPage = () => {

  const firstNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const {loading, request, error, clearError} = useHttp();
  const [authErrorMessageDetails, setAuthErrorMessageDetails] = useState({});
  const [form, setForm] = useState({
    firstName: '',
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
        if (error.cause.origin === 'firstName') {
          firstNameRef.current.focus();
          firstNameRef.current.style.borderBottomColor = '#FF7276';
          emailRef.current.style.borderBottomColor = '';
          passwordRef.current.style.borderBottomColor = '';
          passwordRef.current.value = '';
        }
        else if (error.cause.origin === 'email') {
          emailRef.current.focus();
          firstNameRef.current.style.borderBottomColor = '';
          emailRef.current.style.borderBottomColor = '#FF7276';
          passwordRef.current.style.borderBottomColor = '';
          passwordRef.current.value = '';
        } else if (error.cause.origin === 'password') {
          passwordRef.current.focus();
          firstNameRef.current.style.borderBottomColor = '';
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

  const registerHandler = async (e) => {
    e.preventDefault();
    try {
      const data = await request('/api/auth/register', 'post', {...form});
      navigate('/login');
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
          <h2 className="action-title">Registration</h2>
          <div className="auth-inputs-container">
            <div className="input-field first-name-field">
              <label className="input-label" htmlFor="firstName">First name</label>
              <input
                ref = {firstNameRef}
                className="input input-first-name"
                placeholder="Input first name"
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="off"
                value={form.firstName}
                onChange={changeHandler}
              />
            </div>
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
            <label>Already registered? </label>
            <button 
              className="auth-link" 
              onClick={() => {navigate('/login');}
              }>
                        Login
            </button>
          </div>
          <div className="auth-action">
            <button
              className="auth-action-btn grow register"
              onClick={registerHandler}
              disabled={loading ? true : false}
            >
                        Register
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