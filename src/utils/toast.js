import { toast } from 'react-toastify';

const defaultOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showSuccess = (message) => {
  toast.success(message, defaultOptions);
};

export const showError = (message) => {
  toast.error(message, defaultOptions);
};

export const showInfo = (message) => {
  toast.info(message, defaultOptions);
};