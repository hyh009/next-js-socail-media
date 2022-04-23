import { SetStateAction, useEffect, useState, type Dispatch } from "react";
import { useRouter } from "next/router";
import {type  GetServerSidePropsContext, NextPage } from 'next'
import {IUser, IUserFollowStats, type IProfile} from "../utils/types"
import Head from "next/head";
import { requireAuthentication } from "../utils/HOC/redirectDependonAuth";
import axios,{type AxiosResponse} from "axios";
import baseUrl from "../utils/baseUrl";
import {
  SmallNavbar,
  Profile,
  Follow,
  UpdateProfile,
  Setting,
} from "../components/Profile";
import { PostToastr, NoUser } from "../components/Layout";
import withSocket from "../utils/HOC/withSocket";


interface Props {
  notFound:boolean
  profile:IProfile
  followersLength:number
  followingLength:number
  user:IUser
  userFollowStats:IUserFollowStats
  setToastrType:Dispatch<SetStateAction<string>>
  pageTitle:string
}

type activeItemState = "profile"|"following" |"followers" |"edit" | "setting";

const Account:NextPage<Props> = ({
  notFound,
  profile,
  followersLength,
  followingLength,
  user,
  userFollowStats,
  setToastrType,
  pageTitle,
}) => {
  const router = useRouter();
  const { username }  = router.query;
  // save current choosen navbar item (profile, followers, following, edit, setting)
  const [activeItem, setActiveItem] = useState<activeItemState>("profile");

  // only show edit profile & setting button to current user
  const ownAccount:boolean = profile?.user._id === user?._id;

  // set activeItem to profile when profile user changed
  // scroll to top when path changed
  useEffect(() => {
    setActiveItem("profile");
    const scrollToTop = ():void => {
      document.getElementById("scrollableDiv").scrollTo({
        top: 0,
      });
    };
    if (document.getElementById("scrollableDiv")) {
      scrollToTop();
    }
  }, [router.asPath]);

  return (
    <>
      {(notFound ) && <NoUser username={user.username} />}
      {!notFound && (
        <>
          <Head>
            <title>{pageTitle}</title>
          </Head>
          <PostToastr />
          <SmallNavbar
            followersLength={followersLength}
            followingLength={followingLength}
            ownAccount={ownAccount}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
          />
          {
            // active: profile
            activeItem === "profile" && (
              <Profile
                user={user}
                username={username as string}
                profile={profile}
                userFollowStats={userFollowStats}
                setToastrType={setToastrType}
              />
            )
          }
          {
            // active: followers
            activeItem === "followers" && (
              <Follow
                user={user}
                profileUserId={profile.user._id}
                userFollowStats={userFollowStats}
                type="followers"
              />
            )
          }
          {
            // active: following
            activeItem === "following" && (
              <Follow
                user={user}
                profileUserId={profile.user._id}
                userFollowStats={userFollowStats}
                type="following"
              />
            )
          }
          {
            // active: edit
            activeItem === "edit" && (
              <UpdateProfile Profile={profile} setToastrType={setToastrType} />
            )
          }
          {
            // active: setting
            activeItem === "setting" && (
              <Setting
                newMessagePopup={user.newMessagePopup}
                setToastrType={setToastrType}
              />
            )
          }
        </>
      )}
    </>
  );
};

export const getServerSideProps = requireAuthentication(
  async (context:GetServerSidePropsContext, 
         userRes:AxiosResponse<{user:IUser[], userFollowStats:IUserFollowStats}>) => {
    const { username } = context.query;
    try {
      const profileRes:AxiosResponse<{profile:IProfile,followingLength:number,followersLength:number}>= await axios(`${baseUrl}/api/profile/${username}`, {
        headers: {
          Cookie: context.req.headers.cookie,
        },
      });
      return {
        props: {
          user: userRes.data.user,
          userFollowStats: userRes.data.userFollowStats,
          profile: profileRes.data.profile,
          followersLength: profileRes.data.followersLength,
          followingLength: profileRes.data.followingLength,
        },
      };
    } catch (error) {
      console.log(error);
      if (error.response.status === 404) {
        return {
          props: { notFound: true, user: userRes.data.user },
        };
      }
      return { props: { errorCode: error.response?.status || 500 } };
    }
  }
);

export default withSocket(Account);
