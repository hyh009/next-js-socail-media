import classes from "./popup.module.css";
import { Button } from "../index";
import { BiTrash } from "react-icons/bi";

export const Popup = ({ popRef, clickHandler, arg }) => {
  return (
    <div className={classes.container} ref={popRef}>
      <span className={classes.strong}>Are you sure?</span>
      <span>This action is irreversible!</span>
      <Button
        content="Delete"
        icon={BiTrash}
        look="small-button"
        clickHandler={clickHandler}
        arg={arg}
      />
    </div>
  );
};

export const SmallPopup = ({ popRef, clickHandler, arg }) => {
  return (
    <div className={classes.smallContainer} ref={popRef}>
      <span className={classes.strong}>Are you sure?</span>
      <Button
        content="Delete"
        look="small-button"
        clickHandler={clickHandler}
        arg={arg}
      />
    </div>
  );
};
