import { useEffect } from "react";
import Head from "next/head";
import { requireAuthentication } from "../utils/HOC/redirectDependonAuth";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import withSocket from "../utils/HOC/withSocket";
import { NoNotification } from "../components/Layout";
import {
  CommentNotification,
  LikeNotification,
  FollowNotification,
} from "../components/Notification";

const Notification = ({ userFollowStats, notifications, pageTitle }) => {
  // turn unread notification off
  useEffect(() => {
    const notificationRead = async () => {
      try {
        await axios.post(`${baseUrl}/api/notification`);
      } catch (err) {
        console.log(err);
      }
    };
    notificationRead();
  }, []);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div style={{ width: "100%" }}>
        {notifications.length > 0 &&
          notifications.map((notification) => {
            if (notification.type === "newFollower") {
              return (
                <FollowNotification
                  key={notification._id}
                  notification={notification}
                  userFollowStats={userFollowStats}
                />
              );
            } else if (
              notification.type === "newLike" &&
              notification.post !== null
            ) {
              return (
                <LikeNotification
                  key={notification._id}
                  notification={notification}
                />
              );
            } else if (
              notification.type === "newComment" &&
              notification.post !== null
            ) {
              return (
                <CommentNotification
                  key={notification._id}
                  notification={notification}
                />
              );
            }
          })}
        {notifications.length === 0 && <NoNotification />}
      </div>
    </>
  );
};

export const getServerSideProps = requireAuthentication(
  async (context, userRes) => {
    try {
      const notificationRes = await axios(`${baseUrl}/api/notification`, {
        headers: {
          Cookie: context.req.headers.cookie,
        },
      });
      return {
        props: {
          user: userRes.data.user,
          userFollowStats: userRes.data.userFollowStats,
          notifications: notificationRes.data.notifications,
        },
      };
    } catch (error) {
      console.log(error);
      return { props: { errorCode: error.response?.status || 500 } };
    }
  }
);

export default withSocket(Notification);
