import { useState, useEffect, useCallback } from "react";
import { InfiniteScrollPost } from "../../Post";
import { Snippet } from "../index";
import { NoPosts, DivSpinner } from "../../Layout";
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";

const Profile = ({
  user,
  username,
  profile,
  userFollowStats,
  refreshRouter,
  setToastrType,
}) => {
  // keep profile user's posts
  const [posts, setPosts] = useState([]);
  // to update data from client dide
  const [update, setUpdate] = useState(false);
  // inifinite scroll related
  const [loading, setLoading] = useState(false);
  const [maxPage, setMaxPage] = useState(2);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // check if current user following profile user
  const isFollowing =
    userFollowStats.following.filter((item) => item.user === profile.user._id)
      .length > 0;

  // check if profile user following current user
  const isFollower =
    userFollowStats.followers.filter((item) => item.user === profile.user._id)
      .length > 0;

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

  // infinite scroll fetching data
  const fetchDataOnScroll = () => {
    if (page < maxPage) {
      setPage((prev) => prev + 1);
    }
  };

  return (
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
  );
};

export default Profile;
