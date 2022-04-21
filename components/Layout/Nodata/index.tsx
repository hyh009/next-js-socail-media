import React from "react";
import Image from "next/image";
import Link from "next/link";
import classes from "./nodata.module.css";

export const NoNotification:React.FC = () => {
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
          priority={true}
        />
      </div>
    </div>
  );
};

export const NoPosts:React.FC = () => {
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
          priority={true}
        />
      </div>
    </div>
  );
};

export const NoPost:React.FC = () => {
  return (
    <div className={classes.container}>
      <div className={classes[`info-container`]}>
        <span className={classes.text}>Post Not Found</span>
        <Link href="/">
          <a className={classes[`link-text`]}>Back to Home</a>
        </Link>
      </div>
      <div className={classes[`image-container`]}>
        <Image
          src={
            "https://res.cloudinary.com/dh2splieo/image/upload/v1649256930/social_media/undraw_notify_re_65on_1_xf460r.svg"
          }
          alt="no post"
          width="100%"
          height="100%"
          layout="responsive"
          objectFit="cover"
          priority={true}
        />
      </div>
    </div>
  );
};
interface Props {username:string}
export const NoUser:React.FC<Props> = ({ username }) => {
  return (
    <div className={classes.container}>
      <div className={classes[`info-container`]}>
        <span className={classes.text}>User Not Found</span>
        <Link href={`/${encodeURIComponent(username)}`}>
          <a className={classes[`link-text`]}>Back to My Profile</a>
        </Link>
      </div>
      <div className={classes[`image-container`]}>
        <Image
          src={
            "https://res.cloudinary.com/dh2splieo/image/upload/v1649256930/social_media/undraw_walk_dreaming_u-58-a_igfa3v.svg"
          }
          alt="no post"
          width="100%"
          height="100%"
          layout="responsive"
          objectFit="cover"
          priority={true}
        />
      </div>
    </div>
  );
};

export const NoComment:React.FC = () => {
  return <span>no comment found</span>;
};
