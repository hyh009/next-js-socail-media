import React,{RefObject} from "react";
import { Button } from "../index";
import { BiTrash } from "react-icons/bi";
import classes from "./popup.module.css";
interface Props  {
  popRef:RefObject<HTMLDivElement>
  clickHandler?: (e: React.MouseEvent<HTMLButtonElement>, arg?:string) => void
  arg?:string
}
export const Popup:React.FC<Props> = ({ popRef, clickHandler, arg }) => {
  return (
    <div className={classes.container} ref={popRef}>
      <span className={classes.strong}>Are you sure?</span>
      <span>This action is irreversible!</span>
      <Button
        type="button"
        content="Delete"
        icon={BiTrash}
        look="small-button"
        clickHandler={clickHandler}
        arg={arg}
      />
    </div>
  );
};

export const SmallPopup:React.FC<Props> = ({ popRef, clickHandler, arg }) => {
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
