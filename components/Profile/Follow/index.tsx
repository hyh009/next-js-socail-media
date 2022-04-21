import React,{ useEffect, useState, useCallback } from "react";
import { IUser, IUserFollowStats } from "../../../utils/types";
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
import { followUser, unfollowUser } from "../../../utils/profileAction";
import {
  useGetDataFromServer,
  useGetDataFromClient,
} from "../../../utils/hooks/useUpdateData";
import { PostUser, Button } from "../../Common";
import { DivSpinner } from "../../Layout";
import { RiUserFollowLine } from "react-icons/ri";
import { BsFillPersonCheckFill } from "react-icons/bs";
import classes from "./follow.module.css";


interface Props {
  profileUserId:string
  userFollowStats:IUserFollowStats
  user:IUser
  type:"followers"|"following"
}


const Follow:React.FC<Props> = ({ profileUserId, userFollowStats, user, type }) => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserList = useCallback(async (controller:AbortController=null) => {
    const res = await axios(`${baseUrl}/api/profile/${type}/${profileUserId}`, {
      signal: controller.signal,
    });
    setUserList(res.data);
  }, [profileUserId, type]);
  const refreshRouter = useGetDataFromServer();
  const [setUpdateTrue] = useGetDataFromClient(getUserList);
  // check if current user is following a user that is following the profile user
  const isFollowing = (followingUserId:string) => {
    return (
      userFollowStats.following.filter((item) => item.user === followingUserId)
        .length > 0
    );
  };

  useEffect(() => {
    const controller = new AbortController();
    const getUserListWithLoading = async ():Promise<void> => {
      setLoading(true);
      await getUserList(controller);
      setLoading(false);
    };
    getUserListWithLoading();
    return () => typeof controller !== "undefined" && controller.abort();
  }, [getUserList]);

  return (
    <div className={classes.container}>
      {loading && <DivSpinner />}
      {!loading &&
        userList.map((singleUser) => {
          const currentFollowStat = isFollowing(singleUser.user._id);
          return (
            <div className={classes.row} key={singleUser._id}>
              <PostUser user={singleUser.user} />
              {
                // if following user is current user => do not show button
                singleUser.user._id !== user._id && (
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
                              singleUser.user._id,
                              refreshRouter,
                              setUpdateTrue
                            )
                        : () =>
                            followUser(
                              singleUser.user._id,
                              refreshRouter,
                              setUpdateTrue
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

export default Follow;
