import React from 'react';

import '../styles/scss/homePage.scss';
import {useAuth} from '../hooks/auth.hook';

export const HomePage = () => {

  const { nickname } = useAuth();

  return (
    <>
      <div className="homepage-container">
        <h1 className="page-title">HomePage</h1>
        <h2>Hello, {nickname} !</h2>
      </div>
    </>
  );
};