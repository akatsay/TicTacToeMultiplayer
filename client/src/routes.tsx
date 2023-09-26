import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {LoginPage} from './pages/LoginPage';
import {RegisterPage} from './pages/RegisterPage';
import {HomePage} from './pages/HomePage';
import { AccountPage } from './pages/AccountPage';

export const useRoutes = (isAuthenticated: boolean) => {

  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/account" element={<AccountPage/>} />
        <Route path="*" element={<Navigate replace to="/" />}  />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route path ="/login" element={<LoginPage />} />
      <Route path ="/register" element={<RegisterPage />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate replace to="/" />}  />
    </Routes>
  );
};