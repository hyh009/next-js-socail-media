import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { requireAuthentication } from "../../components/HOC/redirectDependonAuth";
import { Card } from "../../components/Post";
import { PostToastr, NoPost } from "../../components/Layout";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";

const Post = ({ post, user, setToastrType, notFound }) => {
  const router = useRouter();
  // to get data after create / delete / update data
  const refreshRouter = useCallback(
    () => router.replace(router.asPath),
    [router]
  );

  return (
    <>
      {!notFound && post && (
        <div style={{ padding: "20px 0" }}>
          <PostToastr />
          <Card
            post={post}
            user={user}
            setToastrType={setToastrType}
            refreshRouter={refreshRouter}
          />
        </div>
      )}
      {notFound && <NoPost username={user.username} />}
    </>
  );
};

export const getServerSideProps = requireAuthentication(
  async (context, userRes) => {
    const postId = context.query.postId;
    try {
      const postRes = await axios(`${baseUrl}/post/${postId}`, {
        headers: {
          Cookie: context.req.headers.cookie,
        },
      });

      return {
        props: {
          user: userRes.data.user,
          userFollowStats: userRes.data.userFollowStats,
          post: postRes.data,
        },
      };
    } catch (error) {
      if (error.response.status === 404) {
        return {
          props: { notFound: true, user: userRes.data.user },
        };
      }
      return { props: { errorLoading: true } };
    }
  }
);
export default Post;
