import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


import { ChangeNameMenu } from '../components/settings/changeNameMenu';
import { ChangePasswordMenu } from '../components/settings/changePasswordMenu';
import { Modal } from '../components/settings/modal';

import '../styles/scss/accountPage.scss';
import {useAuth} from '../hooks/auth.hook';

export const AccountPage = () => {

  const { nickname } = useAuth();
  const [showChangeNameMenu, setShowChangeNameMenu] = useState(false);
  const [showChangePasswordMenu, setShowChangePasswordMenu] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      <div className="account-page-container">
        <button className="link" onClick={() => {navigate('/home');}}>{'<-'}Back to Home Page</button>
        <h1 className="page-title">Account settings</h1>
        <div className="settings-container">
          <div className="setting-wrapper">
            <label className="setting-label">Your nickname: </label>
            <label className="parameter-label">{nickname}</label>
            <button 
              onClick={() => 
              {
                setShowChangeNameMenu(!showChangeNameMenu);
                showChangeNameMenu ? setShowChangePasswordMenu(false) : setShowChangePasswordMenu(false);
              }
              }  
              className="change-btn grow"
            >
              {!showChangeNameMenu ? 'Change' : 'Cancel'} <i className="fa fa-chevron-down rc-accordion-icon"></i>
            </button>
          </div>

          <ChangeNameMenu 
            showHideFlag = {showChangeNameMenu ? 'show' : 'hide'}
            showChangeNameMenu = {showChangeNameMenu}
            setShowChangeNameMenu = {(flag: boolean) => setShowChangeNameMenu(flag)}
          /> 

          <div className="setting-wrapper setting-wrapper-toggle-type">
            <button 
              onClick={() => 
              {
                setShowChangePasswordMenu(!showChangePasswordMenu);
                showChangePasswordMenu ? setShowChangeNameMenu(false) : setShowChangeNameMenu(false);
              }
              } 
              className="change-btn grow"
            >
              {!showChangePasswordMenu ? 'Change Password' : 'Cancel'} <i className="fa fa-chevron-down rc-accordion-icon"></i>
            </button>
          </div>
                        
          <ChangePasswordMenu 
            showHideFlag = {showChangePasswordMenu ? 'show' : 'hide'}
            showChangePasswordMenu = {showChangePasswordMenu}
            setShowChangePasswordMenu = {(flag: boolean) => setShowChangePasswordMenu(flag)}
          /> 

          <div className="setting-wrapper setting-wrapper-toggle-type">
            <button 
              onClick={() => setOpenModal(true)}   
              className="delete-account-btn grow"
            >
              Delete My account
            </button>
          </div>
        </div>
        {
          openModal &&
          <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
          />
        }
      </div>
    </>
  );
};