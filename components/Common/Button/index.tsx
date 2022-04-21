import React from "react";
import classes from "./button.module.css";
import { Spinner } from "../../Layout";
import { IconType } from "react-icons";

interface Props  {
  content?:string // display text
  icon?:IconType
  look?:string
  type?:"button" | "submit" | "reset"
  isDisable?:boolean
  clickHandler?: (e: React.MouseEvent<HTMLButtonElement>, arg?:string) => void
  arg?:string
  loading?:boolean
}
export const Button:React.FC<Props> = ({
  content,
  icon,
  look,
  type,
  isDisable,
  clickHandler,
  arg,
  loading,
}) => {
  const Icon = icon;
  return (
    <button
      type={type}
      className={`${classes[`basic-button`]} ${classes[look]} ${
        isDisable ? classes.disable : ""
      }`}
      disabled={isDisable ? isDisable : false}
      onClick={
        arg
          ? (e) => {
              clickHandler(e, arg);
            }
          : clickHandler
          ? clickHandler
          : undefined
      }
    >
      {icon && !loading && <Icon />}
      {icon && loading && <Spinner />}
      {content}
    </button>
  );
};
