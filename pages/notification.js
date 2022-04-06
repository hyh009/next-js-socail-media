import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { requireAuthentication } from "../components/HOC/redirectDependonAuth";
import {
  CommentNotification,
  LikeNotification,
  FollowNotification,
} from "../components/Notification";
import { NoNotification } from "../components/Layout";
import axios from "axios";
import baseUrl from "../utils/baseUrl";

const Notification = ({
  user,
  userFollowStats,
  notifications,
  errorLoading,
}) => {
  const router = useRouter();
  // to get data after create / delete / update data
  const refreshRouter = useCallback(
    () => router.replace(router.asPath),
    [router]
  );
  useEffect(() => {
    const notificationRead = async () => {
      try {
        await axios.post(`${baseUrl}/notification`);
        refreshRouter();
      } catch (err) {
        console.log(err);
      }
    };
    notificationRead();
  }, []);
  return (
    <div style={{ width: "100%" }}>
      {notifications.length > 0 &&
        notifications.map((notification) => {
          if (notification.type === "newFollower") {
            return (
              <FollowNotification
                key={notification._id}
                notification={notification}
                userFollowStats={userFollowStats}
                refreshRouter={refreshRouter}
              />
            );
          } else if (notification.type === "newLike") {
            return (
              <LikeNotification
                key={notification._id}
                notification={notification}
              />
            );
          } else if (notification.type === "newComment") {
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
  );
};

export const getServerSideProps = requireAuthentication(
  async (context, userRes) => {
    try {
      const notificationRes = await axios(`${baseUrl}/notification`, {
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
      return { props: { errorLoading: true } };
    }
  }
);

export default Notification;
