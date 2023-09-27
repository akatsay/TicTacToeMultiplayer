import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

import '../styles/scss/homePage.scss';

export const HomePage = () => {

  const auth = useContext(AuthContext);

  return (
    <>
      <div className="homepage-container">
        <h1 className="page-title">HomePage</h1>
        <h2>Hello, {auth.userName} !</h2>
      </div>
    </>
  );
};