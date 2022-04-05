import { useState, useEffect, useCallback } from "react";
import classes from "./followers.module.css";
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
import { PostUser, Button } from "../../Common";
import { DivSpinner } from "../../Layout";
import { RiUserFollowLine } from "react-icons/ri";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { followUser, unfollowUser } from "../../../utils/profileAction";

const Followers = ({ profileUserId, userFollowStats, user, refreshRouter }) => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  // check if current user is following followers of profile user
  const isFollowing = (followerId) => {
    return (
      userFollowStats.following.filter((item) => item.user === followerId)
        .length > 0
    );
  };

  const getFollower = useCallback(async () => {
    const controller = new AbortController();
    const res = await axios(`${baseUrl}/profile/followers/${profileUserId}`, {
      signal: controller.signal,
    });
    setFollowers(res.data);
  }, [profileUserId]);

  useEffect(() => {
    const getFollowerWithLoading = async () => {
      setLoading(true);
      await getFollower();
      setLoading(false);
    };
    getFollowerWithLoading();
    return () => typeof controller !== "undefined" && controller.abort();
  }, [getFollower]);

  // to get update data from client side
  useEffect(() => {
    if (update) {
      getFollower();
      setUpdate(false);
    }
    return () => typeof controller !== "undefined" && controller.abort();
  }, [getFollower, update]);

  return (
    <div className={classes.container}>
      <>
        {loading && <DivSpinner />}
        {!loading &&
          followers.map((follower) => {
            const currentFollowStat = isFollowing(follower.user._id);
            return (
              <div className={classes.row} key={follower._id}>
                <PostUser user={follower.user} />
                {
                  // if follower is current user => do not show button
                  follower.user._id !== user._id && (
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
                                follower.user._id,
                                refreshRouter,
                                setUpdate
                              )
                          : () =>
                              followUser(
                                follower.user._id,
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
      </>
    </div>
  );
};

export default Followers;
