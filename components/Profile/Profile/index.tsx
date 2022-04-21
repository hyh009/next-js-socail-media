import React,{ useState, useEffect, useCallback, Dispatch, SetStateAction } from "react";
import { InfiniteScrollPost } from "../../Post";
import { Snippet } from "../index";
import { NoPosts, DivSpinner } from "../../Layout";
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
import { useGetDataFromClient } from "../../../utils/hooks/useUpdateData";
import { IPost, IProfile, IUser, IUserFollowStats } from "../../../utils/types";

interface Props {
  user:IUser
  username:string
  profile:IProfile
  userFollowStats:IUserFollowStats
  setToastrType:Dispatch<SetStateAction<string>>
}

const Profile:React.FC<Props> = ({
  user,
  username,
  profile,
  userFollowStats,
  setToastrType,
}) => {
  // keep profile user's posts
  const [posts, setPosts] = useState<Array<IPost>>([]);
  // inifinite scroll related
  const [loading, setLoading] = useState<boolean>(false);
  const [maxPage, setMaxPage] = useState<number>(2);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  // check if current user following profile user
  const isFollowing =
    userFollowStats.following.filter((item) => item.user === profile.user._id)
      .length > 0;

  // get posts by username function
  const getPosts = useCallback(async (controller:AbortController=null):Promise<void> => {
    const res = await axios(
      `${baseUrl}/api/post/user/${username}?page=${page}`,
      {
        signal: controller.signal,
      }
    );
    setPosts(res.data.posts);
    setMaxPage(res.data.maxPage);
  }, [page, username]);
  const [setUpdateTrue] = useGetDataFromClient(getPosts);
  // get profile user posts
  useEffect(() => {
    const controller = new AbortController();
    const getPostWithLoading = async ():Promise<void> => {
      setLoading(true);
      await getPosts(controller);
      setLoading(false);
    };
    getPostWithLoading();
    return () => typeof controller !== "undefined" && controller.abort();
  }, [getPosts]);

  // set has more for infinite scroll
  useEffect(() => {
    if (page >= maxPage) {
      setHasMore(false);
    }
  }, [maxPage, page]);

  // infinite scroll fetching data
  const fetchDataOnScroll = ():void => {
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
      />
      {loading && <DivSpinner />}
      {!loading && posts.length === 0 && <NoPosts />}
      {!loading && posts.length > 0 && (
        <InfiniteScrollPost
          posts={posts}
          hasMore={hasMore}
          fetchDataOnScroll={fetchDataOnScroll}
          setToastrType={setToastrType}
          setUpdateTrue={setUpdateTrue}
          user={user}
        />
      )}
    </>
  );
};

export default Profile;
