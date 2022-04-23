import { GetServerSidePropsContext } from 'next'
import axios, { AxiosResponse } from "axios";
import baseUrl from "../baseUrl";
import { IUser,IUserFollowStats } from '../types';

export function requireAuthentication(getServerSidePropsFunction:any) {
  return async (context:GetServerSidePropsContext) => {
    const token = context.req.headers.cookie;

    if (!token) {
      // Redirect to login page
      return {
        redirect: {
          destination: "/login",
          statusCode: 302,
        },
      };
    }

    try {
      const userRes:AxiosResponse<{user:IUser[], userFollowStats:IUserFollowStats}> = await axios(`${baseUrl}/api/auth`, {
        headers: {
          Cookie: context.req.headers.cookie,
        },
      });
      return await getServerSidePropsFunction(context, userRes);
    } catch (error) {
      if (error.response?.status === 401 || error.message === "Unauthorized") {
        return {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        };
      }
    }
  };
}
