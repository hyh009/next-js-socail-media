import { type GetServerSidePropsContext, NextPage } from 'next'
import React, { type Dispatch, SetStateAction } from "react";
import {type IPost, IUser,IUserFollowStats } from "../../utils/types";
import { requireAuthentication } from "../../utils/HOC/redirectDependonAuth";
import axios,{ type AxiosResponse} from "axios";
import baseUrl from "../../utils/baseUrl";
import Head from "next/head";
import { Card } from "../../components/Post";
import { PostToastr, NoPost } from "../../components/Layout";
import withSocket from "../../utils/HOC/withSocket";


interface Props {
  post:IPost
  user:IUser
  setToastrType:Dispatch<SetStateAction<string>>
  pageTitle:string
  notFound?:boolean
}

const Post:NextPage<Props> = ({ post, user, setToastrType, notFound, pageTitle }) => {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      {!notFound && post && (
        <div style={{ padding: "20px 0" }}>
          <PostToastr />
          <Card post={post} user={user} setToastrType={setToastrType} />
        </div>
      )}
      {notFound && <NoPost  />}
    </>
  );
};

export const getServerSideProps = requireAuthentication(
  async (context:GetServerSidePropsContext, 
         userRes:AxiosResponse<{user:IUser[], userFollowStats:IUserFollowStats}>) => {
    const postId = context.query.postId;
    try {
      const postRes:AxiosResponse<IPost[]> = await axios(`${baseUrl}/api/post/${postId}`, {
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
      return { props: { errorCode: error.response?.status || 500 } };
    }
  }
);
export default withSocket(Post);
