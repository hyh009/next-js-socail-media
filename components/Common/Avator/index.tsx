import React from "react";
import classes from "./avator.module.css";
import Image from "next/image";


interface Props  {
  src: string // img source url
  alt: string // alt text
  size?: "auto" | "small"   //  auto(w & h 100%), small(20px) default(35px)
  shape?: "circle" //  circle, default(square)
  border?: string // border => className
  propClass?: string // className
  title?:string // title for Avator
}

const Avator: React.FC<Props> = ({ src, alt, size, shape, border, propClass, title }) => {
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
