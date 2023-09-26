import React, { useContext, useState, useEffect, useRef } from 'react';
import { toast, Slide } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/useFetch';

import '../styles/scss/modal.scss';

export const Modal = ({ open, onClose }) => {

  const auth = useContext(AuthContext);

  const passwordRef = useRef(null);
    
  const [disabledDelete, setDisabledDelete] = useState(true);
    
  const [deletionForm, setDeletionForm] = useState({
    password: '',
    userId: auth.userId
  });

  const {loading, request, error, clearError} = useHttp();

  const handleEnableDelete = () => {
    setDisabledDelete(!disabledDelete);
  };

  const passwordHandler = (event) => {
    setDeletionForm({...deletionForm, [event.target.name]: event.target.value});
  };

  const deleteAccountHandler = async () => {
    try {
      const data = await request('/api/account', 'delete', {...deletionForm}, {
        Authorization: `Bearer ${auth.token}`
      });
      passwordRef.current.style.borderBottomColor = '';
      auth.logout();
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
        if (error.cause.origin === 'password') {
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
              disabled={ loading || disabledDelete ? true : false}
              onClick={deleteAccountHandler}
            >
                        Delete it!
            </button>
            <button onClick={ () => {
              onClose();
            }
            }
            >
                            Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};