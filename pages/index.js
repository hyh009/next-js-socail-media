import { requireAuthentication } from "../utils/HOC/redirectDependonAuth";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { useEffect, useState } from "react";
import withSocket from "../utils/HOC/withSocket";
import { useRouter } from "next/router";
import Head from "next/head";
import Error from "next/error";
import { NoPosts, PostToastr } from "../components/Layout";
import { InfiniteScrollPost, CreatedPost } from "../components/Post";

const Home = ({
  user,
  posts,
  postPage,
  setToastrType,
  pageTitle,
  errorCode,
}) => {
  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (postPage.currentPage === postPage.maxPage) {
      setHasMore(false);
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

  // handle error loading on getServerSideProps
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <PostToastr />
      <CreatedPost user={user} setToastrType={setToastrType} />
      {posts.length === 0 ? (
        <NoPosts />
      ) : (
        <InfiniteScrollPost
          posts={posts}
          hasMore={hasMore}
          fetchDataOnScroll={fetchDataOnScroll}
          setToastrType={setToastrType}
          user={user}
          currentPage={postPage.currentPage}
        />
      )}
    </>
  );
};

export const getServerSideProps = requireAuthentication(
  async (context, userRes) => {
    const page = context.query.page || 1;
    try {
      const postsRes = await axios(`${baseUrl}/api/post/user/following`, {
        headers: {
          Cookie: context.req.headers.cookie,
        },
        params: {
          page,
        },
      });

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
      return { props: { errorCode: error.response?.status || 500 } };
    }
  }
);
export default withSocket(Home);
