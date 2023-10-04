import React, {useState, useEffect, useRef, ChangeEvent, MutableRefObject} from 'react';
import { useFetch } from '../../hooks/useFetch';
import {toastError, toastSuccess} from '../../utils/toaster';
import {useAuth} from '../../hooks/auth.hook';

interface IProps {
  showHideFlag: 'show' | 'hide'
  showChangePasswordMenu: boolean
  setShowChangePasswordMenu: (flag: boolean) => void
}

export const ChangePasswordMenu = ({ showHideFlag, showChangePasswordMenu , setShowChangePasswordMenu}: IProps) => {

  const {loading, request, error, clearError} = useFetch();
  const { token, logout } = useAuth();
  const oldPasswordRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
  const newPasswordRef: MutableRefObject<HTMLInputElement | null> = useRef(null);

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const [changePasswordErrorMessageDetails, setChangePasswordErrorMessageDetails] = useState<string | undefined>('');
    
  const passwordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({...passwordForm, [event.target.name]: event.target.value});
  };

  const passwordChangeSubmitHandler = async () => {
    try {
      const data: any = await request(
        '/users/password',
        {method: 'put', body: { ...passwordForm }, headers: {Authorization: `Bearer ${token}`}}
      );
      setChangePasswordErrorMessageDetails('');
      if (oldPasswordRef.current && newPasswordRef.current) {
        oldPasswordRef.current.style.borderBottomColor = '';
        newPasswordRef.current.style.borderBottomColor = '';
      }
      setShowChangePasswordMenu(false);
      setPasswordForm({...passwordForm, oldPassword: '', newPassword: ''});
      toastSuccess(data.message);
    } catch (e) {
      return;
    }
  };

  useEffect(() => {
    if (error) {
      if (error.message === 'Forbidden resource') {
        logout();
        toastError('Session expired');
      } else {
        toastError(error.message);
      }
                
      if (error.cause) {
        if (error.cause === 'oldPassword' && oldPasswordRef.current && newPasswordRef.current) {
          setChangePasswordErrorMessageDetails(error.message);
          oldPasswordRef.current.focus();
          oldPasswordRef.current.style.borderBottomColor = '#FF7276';
          newPasswordRef.current.style.borderBottomColor = '';
        } else if (error.cause === 'newPassword' && oldPasswordRef.current && newPasswordRef.current) {
          setChangePasswordErrorMessageDetails(error.message);
          newPasswordRef.current.focus();
          newPasswordRef.current.style.borderBottomColor = '#FF7276';
          oldPasswordRef.current.style.borderBottomColor = '';
        }
      }
      clearError();
    }
  }, [error, clearError, token]);

  useEffect(() => {
    if (oldPasswordRef.current && newPasswordRef.current) {
      oldPasswordRef.current.style.borderBottomColor = '';
      newPasswordRef.current.style.borderBottomColor = '';
    }
    setPasswordForm({...passwordForm, oldPassword: '', newPassword: '', });
    setChangePasswordErrorMessageDetails('');
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
          disabled={loading || !passwordForm.newPassword || !passwordForm.oldPassword}
        >
                Change it!
        </button>
        { changePasswordErrorMessageDetails &&
          <div className="error-details">
            * {changePasswordErrorMessageDetails}
          </div>
        }
      </div>
    </>
  );
};