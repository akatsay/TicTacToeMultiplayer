import React, {useContext, useState, useEffect, useRef, MutableRefObject, ChangeEvent} from 'react';
import { AuthContext } from '../context/AuthContext';
import {useFetch} from '../hooks/useFetch';

import '../styles/scss/modal.scss';
import {toastError, toastSuccess} from '../utils/toaster';

interface IProps {
  open: boolean
  onClose: () => void
}

export const Modal = ({ open, onClose }: IProps) => {

  const auth = useContext(AuthContext);
  const passwordRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
  const [disabledDelete, setDisabledDelete] = useState(true);
  const [deletionForm, setDeletionForm] = useState({
    password: ''
  });
  const {loading, request, error, clearError} = useFetch();

  const handleEnableDelete = () => {
    setDisabledDelete(!disabledDelete);
  };

  const passwordHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setDeletionForm({...deletionForm, [event.target.name]: event.target.value});
  };

  const deleteAccountHandler = async () => {
    try {
      const data: any = await request(
        'http://localhost:5000/users',
        {method: 'delete', body: { ...deletionForm }, headers: {Authorization: `Bearer ${auth.token}`}}
      );
      if (passwordRef.current) {
        passwordRef.current.style.borderBottomColor = '';
      }
      auth.logout();
      toastSuccess(data.message);
    } catch (e) {
      return;
    }
  };

  useEffect(() => {
    if (error) {
      if (error.message === 'No auth') {
        auth.logout();
        toastError('Session expired');
      } else {
        toastError(error.message);
      }

                
      if (error.cause) {
        if (error.cause === 'password' && passwordRef.current) {
          passwordRef.current.focus();
          passwordRef.current.style.borderBottomColor = '#FF7276';
        }
        clearError();
      }
    }
  }, [error, clearError, auth]);

  if (!open) return null;

  return (
    <div 
      onClick={ () => {
        onClose();
      }
      } 
      className='overlay'
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modal-container'
      >
        <div className='form-container'>
          <p>Account deletion is irreversible. All your data will be lost.</p>
          <div className='inputs-container'>
            <label className='checkbox-label'>Are you sure?<span className="red-star">*</span></label>
            <div className="checkbox-input-wrapper">
              <input 
                className="modal-checkbox"
                type="checkbox"
                onClick={handleEnableDelete}
              />
              <label className='checkbox-label'> Yes</label>
            </div>
            <input
              ref={passwordRef}
              name="password"
              id="password"
              className='input'
              type="password"
              placeholder="input your password"
              disabled={disabledDelete}
              value={deletionForm.password}
              onChange={passwordHandler}
            />
          </div>
          <div className="modal-buttons-container">
            <button
              disabled={ loading || disabledDelete || !deletionForm.password}
              onClick={deleteAccountHandler}
            >
              Delete it!
            </button>
            <button onClick={ () => { onClose();}}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};