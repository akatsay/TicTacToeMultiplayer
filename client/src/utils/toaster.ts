import {Slide, toast} from 'react-toastify';

export const toastError = (errorMessage: string | undefined) => {
  toast.error(errorMessage, {
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
};

export const toastSuccess = (message: string | undefined) => {
  toast.success(message, {
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
};