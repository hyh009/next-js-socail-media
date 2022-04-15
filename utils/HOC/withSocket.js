import React from "react";
import {
  useSocket,
  useSocketReceiveMsg,
  useSocketNotifyPostLiked,
} from "../hooks/useSocket";
import { useRouter } from "next/router";
import { PAGE_TITLE } from "../headContnet";
import { NotificationPopup } from "../../components/Notification";
import { MsgModal } from "../../components/Message";

function withSocket(OriginalComponent) {
  return (props) => {
    const { user, setNotificationUnread, notificationUnread, profile, post } =
      props;
    const router = useRouter();
    let pageName = router.asPath.split("/")[1].substring(1);
    if (router.pathname === "/[username]") {
      pageName = "ACCOUNT";
    } else if (router.pathname === "/") {
      pageName = "HOME";
    }

    const defaultTitle =
      pageName === "ACCOUNT"
        ? PAGE_TITLE.ACCOUNT(profile.user.name)
        : pageName === "POST"
        ? PAGE_TITLE.POST(post.user.name)
        : PAGE_TITLE[pageName.toUpperCase()];
    // join chat room
    useSocket(user);
    // receive message popup
    const [
      pageTitle,
      newRecievedMessage,
      showNewMessageModal,
      setShowNewMessageModal,
    ] = useSocketReceiveMsg(user, defaultTitle);
    // receive notification popup
    const [newNotification, showNotificationPopup, closeNotificationPopup] =
      useSocketNotifyPostLiked(setNotificationUnread);

    return (
      <>
        {showNewMessageModal && (
          <MsgModal
            newRecievedMessage={newRecievedMessage}
            setShowNewMessageModal={setShowNewMessageModal}
          />
        )}
        {showNotificationPopup && (
          <NotificationPopup
            newNotification={newNotification}
            closeNotificationPopup={closeNotificationPopup}
          />
        )}
        <OriginalComponent {...props} pageTitle={pageTitle} />
      </>
    );
  };
}
export default withSocket;
