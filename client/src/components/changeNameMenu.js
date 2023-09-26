import React, { useContext, useState, useEffect, useRef } from 'react';
import { toast, Slide } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/useFetch';

export const ChangeNameMenu = ({ showHideFlag, showChangeNameMenu, setShowChangeNameMenu }) => {

  const nameRef = useRef(null);
  const auth = useContext(AuthContext);
  const [changeNameErrorMessageDetails, setChangeNameErrorMessageDetails] = useState({});
  const {loading, request, error, clearError} = useHttp();

  const [nameForm, setNameForm] = useState({
    name: '',
    userId: auth.userId
  });

  const NameChangeHandler = (event) => {
    setNameForm({...nameForm, [event.target.name]: event.target.value});
  };

  const nameChangeSubmitHandler = async () => {
    try {
      const data = await request('/api/account/name', 'put', {...nameForm}, {
        Authorization: `Bearer ${auth.token}`
      });
      auth.userName = nameForm.name;
      setChangeNameErrorMessageDetails({});
      nameRef.current.style.borderBottomColor = '';
      setShowChangeNameMenu(false);
      setNameForm({...nameForm, name: '' });
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
        if (error.cause.origin === 'name') {
          setChangeNameErrorMessageDetails(error.cause);
          nameRef.current.focus();
          nameRef.current.style.borderBottomColor = '#FF7276';
        } 
      }
      clearError();
    }
  }, [error, clearError, auth]);

  useEffect(() => {
    setNameForm({...nameForm, name: '' });
    nameRef.current.style.borderBottomColor = '';
    setChangeNameErrorMessageDetails({});
  }, [showChangeNameMenu]);

  return (
    <>
      <div className={`change-menu name ${showHideFlag}`}>
        <input 
          ref={nameRef}
          className="input input-name"
          id="name"
          name="name"
          type="text"
          autoComplete="off"
          value={nameForm.name}
          onChange={NameChangeHandler}
          placeholder={auth.userName}
        />
        <button 
          className="submit-button grow"
          onClick={nameChangeSubmitHandler}
          disabled={loading ? true : false}
        >
                Change name
        </button>
        { 
          JSON.stringify(changeNameErrorMessageDetails) === '{}'
            ? 
            null
            :
            <div className="error-details">
                        * {changeNameErrorMessageDetails.details}
            </div>
        }
      </div>
    </>
  );
};