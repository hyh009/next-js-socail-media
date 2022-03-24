import ReactDOM from "react-dom";
import classes from "./backDrop.module.css";

const BackDrop = () => {
  return ReactDOM.createPortal(
    <div className={classes.filter}></div>,
    document.getElementById("backdrop-root")
  );
};

export default BackDrop;
