import React from "react";
import classes from "./nodata.module.css";
import Image from "next/image";

export const NoNotification = () => {
  return (
    <div className={classes.container}>
      <span className={classes.text}>No Notification Found</span>
      <div className={classes[`image-container`]}>
        <Image
          src={
            "https://res.cloudinary.com/dh2splieo/image/upload/v1649157714/social_media/undraw_my_notifications_re_ehmk_wwr9rb.svg"
          }
          alt="no notification"
          width="100%"
          height="100%"
          layout="responsive"
          objectFit="cover"
        />
      </div>
    </div>
  );
};

export const NoPosts = () => {
  return (
    <div className={classes.container}>
      <span className={classes.text}>No Post Found</span>
      <div className={classes[`image-container`]}>
        <Image
          src={
            "https://res.cloudinary.com/dh2splieo/image/upload/v1649158354/social_media/undraw_new_entries_re_cffr_fge4ij.svg"
          }
          alt="no post"
          width="100%"
          height="100%"
          layout="responsive"
          objectFit="cover"
        />
      </div>
    </div>
  );
};

export const NoPost = () => {
  return (
    <div className={classes.container}>
      <span className={classes.text}>Post Not Found</span>
      <div className={classes[`image-container`]}>
        <Image
          src={
            "https://res.cloudinary.com/dh2splieo/image/upload/v1649160002/social_media/undraw_page_not_found_re_e9o6_2_yetae5.svg"
          }
          alt="no post"
          width="100%"
          height="100%"
          layout="responsive"
          objectFit="cover"
        />
      </div>
    </div>
  );
};
