import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
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
      } catch (err) {
        console.log(err);
      }
    };
    return () => {
      notificationRead();
    };
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

export const getServerSideProps = async (context) => {
  try {
    if (!context.req.headers.cookie) {
      throw Error("Unauthorized");
    }
    const [userRes, notificationRes] = await Promise.all([
      axios(`${baseUrl}/auth`, {
        headers: {
          Cookie: context.req.headers.cookie,
        },
      }),
      axios(`${baseUrl}/notification`, {
        headers: {
          Cookie: context.req.headers.cookie,
        },
      }),
    ]);
    return {
      props: {
        user: userRes.data.user,
        userFollowStats: userRes.data.userFollowStats,
        notifications: notificationRes.data.notifications,
      },
    };
  } catch (error) {
    if (
      error.response?.status === 401 ||
      error.response.name === "Unauthorized"
    ) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
    return { props: { errorLoading: true } };
  }
};

export default Notification;
