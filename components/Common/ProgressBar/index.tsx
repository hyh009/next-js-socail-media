import React from "react";
import { BsCheck } from "react-icons/bs";
import classes from "./progressBar.module.css";

interface Props  {
  currentStep:number
  stepText:string[]
}

const ProgressBar:React.FC<Props> = ({ currentStep, stepText }) => {
  const isActive = (step:number):boolean => currentStep >= step;
  return (
    <div className={classes.container}>
      {stepText.map((text, index) => (
        <div key={index} className={classes.step}>
          <div
            className={`${classes.line} ${
              isActive(index + 1) && classes[`line-filled`]
            } ${index === stepText.length - 1 && classes["hide"]}`}
          />
          <div
            className={`${classes.box}  ${
              isActive(index) && classes[`box-active`]
            }`}
          >
            {currentStep > index ? <BsCheck /> : `${index + 1}`}
          </div>
          <span className={`${classes.text}`}>{text}</span>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
