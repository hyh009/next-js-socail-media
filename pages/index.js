import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import Head from "next/head";
import { Card, CreatedPost } from "../components/Post";
import { Nodata, PlaceHolderPosts, EndMessage } from "../components/Layout";
import { PostToastr } from "../components/Layout/Toastr";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import classes from "../components/Layout/MainLayout/MainLayout.module.css";

const Home = (props) => {
  const [showNoPost, setShowNoPost] = useState(false);
  const [toastrType, setToastrType] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { errorLoading } = props;
  const router = useRouter();
  // to get data after create / delete / update data
  const refreshRouter = useCallback(
    () => router.replace(router.asPath),
    [router.asPath]
  );
  // handle toast
  useEffect(() => {
    let timer;
    // delete post
    if (toastrType === "delete") {
      toast.info("Post Deleted Successfully", {
        toastId: "delete",
      });
      timer = setTimeout(() => setToastrType(""), 1500);
      // create post
    } else if (toastrType === "create") {
      toast.info("Post Created Successfully", {
        toastId: "create",
      });
      timer = setTimeout(() => setToastrType(""), 1500);
    }
    return () => clearTimeout(timer);
  }, [toastrType]);

  // handle data fetching error
  useEffect(() => {
    if (errorLoading) {
      setShowNoPost(true);
    }
  }, [errorLoading]);

  useEffect(() => {
    if (props.postPage.currentPage === props.postPage.maxPage) {
      setHasMore(false);
    }

    if (props.posts.length === 0) {
      setShowNoPost(true);
    }
  }, [props]);

  // handle infinite scroll
  const fetchDataOnScroll = () => {
    console.log("here");
    const query = router.query;
    query.page = parseInt(props.postPage.currentPage) + 1;
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
        user={props.user}
        refreshRouter={refreshRouter}
        setToastrType={setToastrType}
      />
      {showNoPost && <Nodata />}
      <InfiniteScroll
        className={classes[`content-wrapper`]}
        hasMore={hasMore}
        next={fetchDataOnScroll}
        dataLength={props.posts.length}
        loader={<PlaceHolderPosts />}
        endMessage={<EndMessage />}
        scrollableTarget="scrollableDiv"
      >
        {props.posts.map((post) => (
          <Card
            key={post._id}
            post={post}
            user={props.user}
            setToastrType={setToastrType}
            refreshRouter={refreshRouter}
          />
        ))}
      </InfiniteScroll>
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
        withCredentials: true,
        headers: {
          Cookie: context.req.headers.cookie,
        },
      }),
      axios(`${baseUrl}/post`, {
        withCredentials: true,
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
