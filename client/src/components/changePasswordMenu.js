import React, { useContext, useState, useEffect, useRef } from 'react';
import { toast, Slide } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';

export const ChangePasswordMenu = ({ showHideFlag, showChangePasswordMenu , setShowChangePasswordMenu}) => {

  const auth = useContext(AuthContext);
  const {loading, request, error, clearError} = useHttp();

  const oldPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);   

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    userId: auth.userId
  });

  const [changePasswordErrorMessageDetails, setChangePasswordErrorMessageDetails] = useState({});
    
  const passwordChangeHandler = (event) => {
    setPasswordForm({...passwordForm, [event.target.name]: event.target.value});
  };

  const passwordChangeSubmitHandler = async () => {
    try {
      const data = await request('/api/account/password', 'post', {...passwordForm}, {
        Authorization: `Bearer ${auth.token}`
      });
      setChangePasswordErrorMessageDetails({});
      oldPasswordRef.current.style.borderBottomColor = '';
      newPasswordRef.current.style.borderBottomColor = '';
      setShowChangePasswordMenu(false);
      setPasswordForm({...passwordForm, oldPassword: '', newPassword: ''});
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

  useEffect(() => {
    if (error) {
      if (error.message === 'No auth') {
        auth.logout();
        toast.error('Session expired', {
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
            
      } else {

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
      }
                
      if (error.cause) {
        if (error.cause.origin === 'oldPassword') {
          setChangePasswordErrorMessageDetails(error.cause);
          oldPasswordRef.current.focus();
          oldPasswordRef.current.style.borderBottomColor = '#FF7276';
          newPasswordRef.current.style.borderBottomColor = '';
        } else if (error.cause.origin === 'newPassword') {
          setChangePasswordErrorMessageDetails(error.cause);
          newPasswordRef.current.focus();
          newPasswordRef.current.style.borderBottomColor = '#FF7276';
          oldPasswordRef.current.style.borderBottomColor = '';
        }
      }
      clearError();
    }
  }, [error, clearError, auth]);

  useEffect(() => {
    setPasswordForm({...passwordForm, oldPassword: '', newPassword: '', });
    oldPasswordRef.current.style.borderBottomColor = '';
    newPasswordRef.current.style.borderBottomColor = '';
    setChangePasswordErrorMessageDetails({});
  }, [showChangePasswordMenu]);

  return (
    <>
      <div className={`change-menu password ${showHideFlag}`}>
        <label className="input-label" htmlFor="oldPassword">Old password</label>
        <input 
          ref={oldPasswordRef}
          className="input input-old-password"
          id="oldPassword"
          name="oldPassword"
          type="password"
          autoComplete="off"
          value={passwordForm.oldPassword}
          onChange={passwordChangeHandler}
          placeholder="Input old password"
        />
        <label className="input-label" htmlFor="newPassword">New password</label>
        <input 
          ref={newPasswordRef}
          className="input input-new-password"
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="off"
          value={passwordForm.newPassword}
          onChange={passwordChangeHandler}
          placeholder="Input new password"
        />
        <button 
          className="submit-button grow"
          onClick={() => {console.log(loading); passwordChangeSubmitHandler();}}
          disabled={loading ? true : false}
        >
                Change it!
        </button>
        { JSON.stringify(changePasswordErrorMessageDetails) === '{}'
          ? 
          null
          :
          <div className="error-details">
                            * {changePasswordErrorMessageDetails.details}
          </div>
        }
      </div>
    </>
  );
};