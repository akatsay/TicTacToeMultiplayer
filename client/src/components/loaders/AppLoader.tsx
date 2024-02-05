import React from 'react';

import '../../styles/scss/appLoader.scss';

export const AppLoader = () => {

  return (
    <>
      <div className="loader-container">
        <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        <p className="loading">Loading...</p>
      </div>
    </>
  );
};