import React from "react"
import { ToastContainer } from "react-toastify";

export const PostToastr:React.FC = () => {
  return (
    <ToastContainer
      theme="dark"
      position="bottom-left"
      autoClose={1500}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover={false}
    />
  );
};


