import React from 'react';

import '../styles/scss/footer.scss';

export const Footer = () => {

  return (
    <>
      <div className="footer">
        <div className="author">Created by akatsay <p className="smile">🙃</p></div>
        <i 
          className="fa-brands fa-github grow" 
          onClick={() => {
            window.open('https://github.com/akatsay/Authentication-base', '_blank');
          }}
        >
        </i>
        <p className="pustishka">Created by akatsay🙃</p>
      </div>
    </>
  );
};