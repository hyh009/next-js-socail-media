import React from "react";
import classes from "./placeHolderGroup.module.css";
import { BiArrowToTop } from "react-icons/bi";

export const PlaceHolderPosts:React.FC = () => {
  return <div>PlaceHolderPosts</div>;
};

export const EndMessage:React.FC = () => {
  const scrollToTop:React.MouseEventHandler<HTMLDivElement> = ():void => {
    document.getElementById("scrollableDiv").scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className={classes[`endMessage-container`]}>
      <span className={classes.text}>THE END</span>
      <div className={classes[`scrollBtn-container`]} onClick={scrollToTop}>
        <BiArrowToTop />
      </div>
    </div>
  );
};
