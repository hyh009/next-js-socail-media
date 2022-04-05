import { useEffect, useState, useCallback } from "react";
import classes from "./following.module.css";
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
import { PostUser, Button } from "../../Common";
import { DivSpinner } from "../../Layout";
import { RiUserFollowLine } from "react-icons/ri";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { followUser, unfollowUser } from "../../../utils/profileAction";

const Following = ({ profileUserId, userFollowStats, user, refreshRouter }) => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  // check if current user is following a user that is following the profile user
  const isFollowing = (followingUserId) => {
    return (
      userFollowStats.following.filter((item) => item.user === followingUserId)
        .length > 0
    );
  };

  const getFollowing = useCallback(async () => {
    const controller = new AbortController();
    const res = await axios(`${baseUrl}/profile/following/${profileUserId}`, {
      signal: controller.signal,
    });
    setFollowing(res.data);
  }, [profileUserId]);

  useEffect(() => {
    const getFollowingWithLoading = async () => {
      setLoading(true);
      await getFollowing();
      setLoading(false);
    };
    getFollowingWithLoading();
    return () => typeof controller !== "undefined" && controller.abort();
  }, [getFollowing]);

  // to get update data from client side
  useEffect(() => {
    if (update) {
      getFollowing();
      setUpdate(false);
    }
    return () => typeof controller !== "undefined" && controller.abort();
  }, [getFollowing, update]);

  return (
    <div className={classes.container}>
      {loading && <DivSpinner />}
      {!loading &&
        following.map((followingUser) => {
          const currentFollowStat = isFollowing(followingUser.user._id);
          return (
            <div className={classes.row} key={followingUser._id}>
              <PostUser user={followingUser.user} />
              {
                // if following user is current user => do not show button
                followingUser.user._id !== user._id && (
                  <Button
                    type="button"
                    content={currentFollowStat ? "Following" : "Follow"}
                    look={
                      currentFollowStat
                        ? "small-reverse-button"
                        : "small-button"
                    }
                    icon={
                      currentFollowStat
                        ? BsFillPersonCheckFill
                        : RiUserFollowLine
                    }
                    clickHandler={
                      currentFollowStat
                        ? () =>
                            unfollowUser(
                              followingUser.user._id,
                              refreshRouter,
                              setUpdate
                            )
                        : () =>
                            followUser(
                              followingUser.user._id,
                              refreshRouter,
                              setUpdate
                            )
                    }
                  />
                )
              }
            </div>
          );
        })}
    </div>
  );
};

export default Following;
