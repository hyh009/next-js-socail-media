import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import Head from "next/head";
import UtilContext from "../utils/context/UtilContext";
import { InfiniteScrollPost, CreatedPost } from "../components/Post";
import { NoPosts, PostToastr } from "../components/Layout";

const Home = ({ user, posts, postPage, setToastrType, errorLoading }) => {
  const [showNoPost, setShowNoPost] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  // to get data after create / delete / update data
  const refreshRouter = useCallback(
    () => router.replace(router.asPath),
    [router]
  );

  // handle data fetching error
  useEffect(() => {
    if (errorLoading) {
      setShowNoPost(true);
    }
  }, [errorLoading]);

  useEffect(() => {
    if (postPage.currentPage === postPage.maxPage) {
      setHasMore(false);
    }

    if (posts.length === 0) {
      setShowNoPost(true);
    }
  }, [posts, postPage]);

  // handle infinite scroll
  const fetchDataOnScroll = () => {
    const query = router.query;
    if (postPage.maxPage > postPage.currentPage) {
      query.page = postPage.currentPage + 1;
    } else {
      query.page = postPage.currentPage;
    }
    router.replace({
      pathname: router.pathname,
      query: query,
    });
  };
  return (
    <>
      <Head>
        <title>Home | Mini Social Media</title>
      </Head>
      <PostToastr />
      <CreatedPost
        user={user}
        refreshRouter={refreshRouter}
        setToastrType={setToastrType}
      />
      {showNoPost && <NoPosts />}
      <InfiniteScrollPost
        posts={posts}
        hasMore={hasMore}
        fetchDataOnScroll={fetchDataOnScroll}
        setToastrType={setToastrType}
        refreshRouter={refreshRouter}
        user={user}
      />
    </>
  );
};

export const getServerSideProps = async (context) => {
  const page = context.query.page || 1;
  try {
    if (!context.req.headers.cookie) {
      throw Error("Unauthorized");
    }

    const [userRes, postsRes] = await Promise.all([
      axios(`${baseUrl}/auth`, {
        headers: {
          Cookie: context.req.headers.cookie,
        },
      }),
      axios(`${baseUrl}/post/user/following`, {
        headers: {
          Cookie: context.req.headers.cookie,
        },
        params: {
          page,
        },
      }),
    ]);

    return {
      props: {
        user: userRes.data.user,
        userFollowStats: userRes.data.userFollowStats,
        posts: postsRes.data.posts,
        postPage: {
          currentPage: postsRes.data.currentPage,
          maxPage: postsRes.data.maxPage,
        },
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
export default Home;
