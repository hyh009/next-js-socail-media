import React from "react";
import classes from "./checkbox.module.css";
interface Props {
  desc:string
  name:string
  checked:boolean
  changeHandler:(e:React.ChangeEvent<HTMLInputElement>) =>void
}

const Checkbox:React.FC<Props> = ({ desc, name, checked, changeHandler }) => {
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
