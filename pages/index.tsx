import { requireAuthentication } from "../utils/HOC/redirectDependonAuth";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {type GetServerSidePropsContext, NextPage } from 'next'
import axios, {type AxiosResponse } from "axios";
import baseUrl from "../utils/baseUrl";
import {type IPost, IUser,IUserFollowStats } from "../utils/types";
import withSocket from "../utils/HOC/withSocket";
import { useRouter } from "next/router";
import Head from "next/head";
import { NoPosts, PostToastr } from "../components/Layout";
import { InfiniteScrollPost, CreatedPost } from "../components/Post";


interface Props {
  user:IUser
  posts:IPost[]
  postPage:{
    maxPage:number 
    currentPage:number
  }
  setToastrType:Dispatch<SetStateAction<string>>
  pageTitle:string
}

const Home:NextPage<Props> = ({ user, posts, postPage, setToastrType, pageTitle }) => {
  const [hasMore, setHasMore] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    if (postPage.currentPage === postPage.maxPage) {
      setHasMore(false);
    }
  }, [posts, postPage]);

  // handle infinite scroll
  const fetchDataOnScroll = ():void => {
    const query = router.query;
    if (postPage.maxPage > postPage.currentPage) {
      query.page = (postPage.currentPage + 1).toString(); 
    } else {
      query.page = (postPage.currentPage).toString();
    }
    router.replace({
      pathname: router.pathname,
      query: query,
    });
  };

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
  async (context:GetServerSidePropsContext, 
         userRes:AxiosResponse<{user:IUser[], userFollowStats:IUserFollowStats}>) => {
    const page = context.query.page as string || "1";
    try {
      const postsRes:AxiosResponse<{posts:IPost[],currentPage:number,maxPage:number}> = await axios(`${baseUrl}/api/post/user/following`, {
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
