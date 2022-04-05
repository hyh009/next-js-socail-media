import { useCallback } from "react";
import { useRouter } from "next/router";
import { Card } from "../../components/Post";
import { PostToastr, NoPost } from "../../components/Layout";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";

const Post = ({ post, user, setToastrType, errorLoading }) => {
  const router = useRouter();
  // to get data after create / delete / update data
  const refreshRouter = useCallback(
    () => router.replace(router.asPath),
    [router]
  );
  return (
    <>
      {!errorLoading && post && (
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
      {errorLoading || (!post && <NoPost />)}
    </>
  );
};

export const getServerSideProps = async (context) => {
  const postId = context.query.postId;
  try {
    if (!context.req.headers.cookie) {
      throw Error("Unauthorized");
    }

    const [userRes, postRes] = await Promise.all([
      axios(`${baseUrl}/auth`, {
        headers: {
          Cookie: context.req.headers.cookie,
        },
      }),
      axios(`${baseUrl}/post/${postId}`, {
        headers: {
          Cookie: context.req.headers.cookie,
        },
      }),
    ]);

    return {
      props: {
        user: userRes.data.user,
        userFollowStats: userRes.data.userFollowStats,
        post: postRes.data,
      },
    };
  } catch (error) {
    // if token not verify, redirect to login page
    if (error.response?.status === 401 || error.message === "Unauthorized") {
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
export default Post;
