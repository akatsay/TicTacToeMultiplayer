import React, {useContext, useState, useEffect, useRef, ChangeEvent, MutableRefObject} from 'react';
import { toast, Slide } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { useFetch } from '../hooks/useFetch';
import {toastError, toastSuccess} from '../utils/toaster';

interface IProps {
  showHideFlag: 'show' | 'hide'
  showChangeNameMenu: boolean
  setShowChangeNameMenu: (flag: boolean) => void
}
export const ChangeNameMenu = ({ showHideFlag, showChangeNameMenu, setShowChangeNameMenu }: IProps) => {

  const nameRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
  const auth = useContext(AuthContext);
  const [changeNameErrorMessageDetails, setChangeNameErrorMessageDetails] = useState<string | undefined>('');
  const {loading, request, error, clearError} = useFetch();

  const [nameForm, setNameForm] = useState({
    name: '',
    userId: auth.userId
  });

  const NameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setNameForm({...nameForm, [event.target.name]: event.target.value});
  };

  const nameChangeSubmitHandler = async () => {
    try {
      const data: any = await request(
        'http://localhost:5000/users/nickname',
        {method: 'patch', body: { ...nameForm }, headers: {Authorization: `Bearer ${auth.token}`}}
      );
      auth.userName = nameForm.name;
      setChangeNameErrorMessageDetails('');
      if(nameRef.current) {
        nameRef.current.style.borderBottomColor = '';
      }
      setShowChangeNameMenu(false);
      setNameForm({...nameForm, name: '' });
      toastSuccess(data.message);
    } catch (e) {
      return;
    }
  };

  useEffect(() => {
    if (error) {
      if (error.message === 'Forbidden resource') {
        auth.logout();
        toastError('Session expired');
      } else {
        toastError(error.message);
      }}
                
    if (error?.cause) {
      if (error.cause === 'name' && nameRef.current) {
        setChangeNameErrorMessageDetails(error.message);
        nameRef.current.focus();
        nameRef.current.style.borderBottomColor = '#FF7276';
      } 
    }
    clearError();
  }, [error, clearError, auth]);

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.style.borderBottomColor = '';
    }
    setNameForm({...nameForm, name: '' });
    setChangeNameErrorMessageDetails('');
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
          changeNameErrorMessageDetails &&
            <div className="error-details">
              * {changeNameErrorMessageDetails}
            </div>
        }
      </div>
    </>
  );
};