import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import {
  SmallNavbar,
  Snippet,
  Followers,
  Following,
  UpdateProfile,
  Setting,
} from "../components/Profile";
import { InfiniteScrollPost } from "../components/Post";
import { PostToastr, NoPosts, DivSpinner } from "../components/Layout";

const Profile = ({
  errorLoading,
  profile,
  followersLength,
  followingLength,
  user,
  userFollowStats,
  setToastrType,
}) => {
  const router = useRouter();
  const { username } = router.query;

  // keep profile user's posts
  const [posts, setPosts] = useState([]);
  // save current choosen navbar item (profile, followers, following, edit, setting)
  const [activeItem, setActiveItem] = useState("profile");
  // inifinite scroll related
  const [loading, setLoading] = useState(false);
  const [maxPage, setMaxPage] = useState(2);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // to update data from client dide
  const [update, setUpdate] = useState(false);

  // to get data after follow/unfollow user
  const refreshRouter = useCallback(
    () => router.replace(router.asPath),
    [router]
  );

  // check if current user following profile user
  const isFollowing =
    userFollowStats.following.filter((item) => item.user === profile.user._id)
      .length > 0;

  // check if profile user following current user
  const isFollower =
    userFollowStats.followers.filter((item) => item.user === profile.user._id)
      .length > 0;

  // only show edit profile & setting button to current user
  const ownAccount = profile.user._id === user._id;

  // get posts by username function
  const getPosts = useCallback(async () => {
    const controller = new AbortController();
    const res = await axios(`${baseUrl}/post/user/${username}?page=${page}`, {
      signal: controller.signal,
    });
    setPosts(res.data.posts);
    setMaxPage(res.data.maxPage);
  }, [page, username]);

  // get profile user posts
  useEffect(() => {
    const getPostWithLoading = async () => {
      setLoading(true);
      await getPosts();
      setLoading(false);
    };
    getPostWithLoading();
    return () => typeof controller !== "undefined" && controller.abort();
  }, [getPosts]);

  // to get update data from client side
  useEffect(() => {
    if (update) {
      getPosts();
      setUpdate(false);
    }
    return () => typeof controller !== "undefined" && controller.abort();
  }, [getPosts, update]);

  // set has more for infinite scroll
  useEffect(() => {
    if (page >= maxPage) {
      setHasMore(false);
    }
  }, [maxPage, page]);

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

  // infinite scroll fetching data
  const fetchDataOnScroll = () => {
    if (page < maxPage) {
      setPage((prev) => prev + 1);
    }
  };

  return (
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
          <>
            <Snippet
              user={user}
              profile={profile}
              isFollowing={isFollowing}
              isFollower={isFollower}
              refreshRouter={refreshRouter}
            />
            {loading && <DivSpinner />}
            {!loading && posts.length === 0 && <NoPosts />}
            {!loading && posts.length > 0 && (
              <InfiniteScrollPost
                posts={posts}
                hasMore={hasMore}
                fetchDataOnScroll={fetchDataOnScroll}
                setToastrType={setToastrType}
                setUpdate={setUpdate}
                user={user}
              />
            )}
          </>
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
  );
};

export const getServerSideProps = async (context) => {
  const { username } = context.query;

  try {
    if (!context.req.headers.cookie) {
      throw Error("Unauthorized");
    }
    const [userRes, profileRes] = await Promise.all([
      axios(`${baseUrl}/auth`, {
        headers: {
          Cookie: context.req.headers.cookie,
        },
      }),
      axios(`${baseUrl}/profile/${username}`, {
        headers: {
          Cookie: context.req.headers.cookie,
        },
      }),
    ]);
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
    if (
      error.response?.status === 401 ||
      error.response.name === "Unauthorized"
    ) {
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

export default Profile;
