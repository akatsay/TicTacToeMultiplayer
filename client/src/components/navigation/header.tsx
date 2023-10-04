import React, { useRef } from 'react';
import { useDetectOutsideClick } from '../../hooks/useDetectOutsideClick';
import { useNavigate } from 'react-router-dom';

import '../../styles/scss/header.scss';
import {toastWarning} from '../../utils/toaster';
import {useAuth} from '../../hooks/auth.hook';

export const Header = () => {

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  const [open, setOpen] = useDetectOutsideClick(dropdownRef, false);

  const { logout, nickname, isAuthenticated } = useAuth();

  const handleOpen = () => setOpen(!open);

  const logoutHandler = () => {
    logout();
    toastWarning('Logged out');
  };



  return (
    <nav className="navbar">
      <div className="brand-title">Authentication</div>
      <div
        ref={dropdownRef} className={`dropdown ${isAuthenticated ? '' : 'hide'}`}
      >
        <button className="drop-trigger big" onClick={handleOpen}>
          <p>Logged in as:</p>
          <i>{nickname}</i>
        </button>
        <button className="drop-trigger small" onClick={handleOpen}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`dropdown-menu ${open ? 'show' : 'hide'}`}>
          <li className="menu-item">
            <button onClick={() => {navigate('/account'); handleOpen();}} className="account-nav-btn">Account-settings</button>
          </li>
          <li className="menu-item">
            <button onClick={logoutHandler} className="logout-btn">Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};