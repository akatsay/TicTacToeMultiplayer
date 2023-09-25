import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {LoginPage} from './pages/LoginPage';
import {RegisterPage} from './pages/RegisterPage';
import {HomePage} from './pages/HomePage';
import { AccountPage } from './pages/AccountPage';

export const useRoutes = isAuthenticated => {

  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/home" exact element={<HomePage />} />
        <Route path="/" exact element={<Navigate to="/home" />} />
        <Route path="/account" exact element={<AccountPage/>} />
        <Route path="*" element={<Navigate replace to="/" />}  />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route path ="/login" exact element={<LoginPage />} />
      <Route path ="/register" exact element={<RegisterPage />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate replace to="/" />}  />
    </Routes>
  );
};