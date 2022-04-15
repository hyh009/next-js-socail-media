import React from "react";
import classes from "./avator.module.css";
import Image from "next/image";

const Avator = ({ src, alt, size, shape, border, propClass, title }) => {
  // size => type: auto(w & h 100%), small(20px) default(35px)
  // shape => circle, default(square)
  // border => classname
  return (
    <div
      title={title ? title : alt}
      className={`${
        size === "small"
          ? classes[`small-container`]
          : size === "auto"
          ? classes[`auto-container`]
          : classes.container
      } ${shape === "circle" && classes[`circle`]} ${
        border ? classes[border] : ""
      } ${classes[propClass]}`}
    >
      <Image
        src={src}
        alt={alt}
        width="100%"
        height="100%"
        layout="responsive"
        objectFit="cover"
      />
    </div>
  );
};

export default Avator;
