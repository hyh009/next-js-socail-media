import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { requireAuthentication } from "../components/HOC/redirectDependonAuth";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import {
  SmallNavbar,
  Profile,
  Followers,
  Following,
  UpdateProfile,
  Setting,
} from "../components/Profile";
import { PostToastr, NoUser } from "../components/Layout";

const Account = ({
  errorLoading,
  notFound,
  profile,
  followersLength,
  followingLength,
  user,
  userFollowStats,
  setToastrType,
}) => {
  const router = useRouter();
  const { username } = router.query;
  // save current choosen navbar item (profile, followers, following, edit, setting)
  const [activeItem, setActiveItem] = useState("profile");

  // to get data after follow/unfollow user
  const refreshRouter = useCallback(
    () => router.replace(router.asPath),
    [router]
  );

  // only show edit profile & setting button to current user
  const ownAccount = profile?.user._id === user?._id;

  // set activeItem to profile when profile user changed
  // scroll to top when path changed
  useEffect(() => {
    setActiveItem("profile");
    const scrollToTop = () => {
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
      {(notFound || errorLoading) && <NoUser username={user.username} />}
      {!notFound && !errorLoading && (
        <>
          <Head>
            <title>{`${profile.user.name}'s Page | Mini Social Media`}</title>
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
                username={username}
                profile={profile}
                userFollowStats={userFollowStats}
                refreshRouter={refreshRouter}
                setToastrType={setToastrType}
              />
            )
          }
          {
            // active: followers
            activeItem === "followers" && (
              <Followers
                user={user}
                profileUserId={profile.user._id}
                userFollowStats={userFollowStats}
                refreshRouter={refreshRouter}
              />
            )
          }
          {
            // active: following
            activeItem === "following" && (
              <Following
                user={user}
                profileUserId={profile.user._id}
                userFollowStats={userFollowStats}
                refreshRouter={refreshRouter}
              />
            )
          }
          {
            // active: edit
            activeItem === "edit" && (
              <UpdateProfile
                Profile={profile}
                refreshRouter={refreshRouter}
                setToastrType={setToastrType}
              />
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
  async (context, userRes) => {
    const { username } = context.query;
    try {
      const profileRes = await axios(`${baseUrl}/profile/${username}`, {
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
      return { props: { errorLoading: true } };
    }
  }
);

export default Account;
