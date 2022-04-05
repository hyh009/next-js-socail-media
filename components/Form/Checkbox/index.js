import React from "react";
import classes from "./checkbox.module.css";

const Checkbox = ({ desc, name, checked, changeHandler }) => {
  return (
    <div className={classes.center}>
      {desc && <span>{desc}</span>}
      <input
        id={name}
        type="checkbox"
        name={name}
        checked={checked}
        onChange={changeHandler}
        className={classes.input}
      />
      <label className={classes.label} htmlFor={name} />
    </div>
  );
};

export default Checkbox;
