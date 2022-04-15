import ReactDOM from "react-dom";
import Link from "next/link";
import { Avator } from "../../Common";
import { AiOutlineClose } from "react-icons/ai";
import classes from "./notificationPopup.module.css";

const NotificationPopup = ({ newNotification, closeNotificationPopup }) => {
  return ReactDOM.createPortal(
    <div className={classes.container}>
      <AiOutlineClose
        className={classes[`close-icon`]}
        onClick={closeNotificationPopup}
      />
      <div className={classes.content}>
        <Avator
          src={newNotification.profilePicUrl}
          alt={newNotification.name}
          size="small"
        />
        <Link href={`/${newNotification.username}`}>
          <a className={classes[`link-text`]}>{`${newNotification.name}`}</a>
        </Link>
        <p>{`like your `}</p>
        <Link href={`/post/${newNotification.postId}`}>
          <a className={classes[`link-text`]}>post</a>
        </Link>
        {newNotification?.postPic && (
          <Avator
            src={newNotification.postPic}
            alt="post picture"
            size="small"
          />
        )}
      </div>
    </div>,
    document.getElementById("backdrop-root")
  );
};

export default NotificationPopup;
