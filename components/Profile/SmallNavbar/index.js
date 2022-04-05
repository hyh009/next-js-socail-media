import { useState } from "react";
import classes from "./smallNavbar.module.css";

const SmallNavbar = ({
  followingLength,
  followersLength,
  ownAccount,
  activeItem,
  setActiveItem,
}) => {
  return (
    <ul className={classes.container}>
      <li
        className={`${classes[`list-item`]} ${
          activeItem === "profile" && classes.active
        }`}
        onClick={() => setActiveItem("profile")}
      >
        Profile
      </li>
      <li
        className={`${classes[`list-item`]} ${
          activeItem === "followers" && classes.active
        }`}
        onClick={() => setActiveItem("followers")}
      >
        {`Followers(${followersLength})`}
      </li>
      <li
        className={`${classes[`list-item`]} ${
          activeItem === "following" && classes.active
        }`}
        onClick={() => setActiveItem("following")}
      >
        {`Following(${followingLength})`}
      </li>
      {ownAccount && (
        <>
          <li
            className={`${classes[`list-item`]} ${
              activeItem === "edit" && classes.active
            }`}
            onClick={() => setActiveItem("edit")}
          >
            Edit
          </li>
          <li
            className={`${classes[`list-item`]} ${
              activeItem === "setting" && classes.active
            }`}
            onClick={() => setActiveItem("setting")}
          >
            Setting
          </li>
        </>
      )}
    </ul>
  );
};

export default SmallNavbar;
