import { useState, useEffect } from "react";
import classes from "./likeList.module.css";
import { Avator } from "../../Common";
import baseUrl from "../../../utils/baseUrl";
import axios from "axios";
import {
  AiOutlineLoading3Quarters,
  AiOutlineCloseCircle,
  AiOutlineSearch,
} from "react-icons/ai";

const LikeList = ({ postId, propRef, setShowLikeList }) => {
  const [loading, setLoading] = useState(false);
  const [likesUserInfo, setLikesUserInfo] = useState([]);
  useEffect(() => {
    const controller = new AbortController();
    const getLikesUserInfo = async () => {
      setLoading(true);
      const res = await axios(`${baseUrl}/post/like/${postId}`, {
        signal: controller.signal,
      });
      setLikesUserInfo(res.data);
      setLoading(false);
    };

    getLikesUserInfo(likesUserInfo);
    return () => {
      controller.abort();
    };
  }, [postId]);

  return (
    <ul className={classes.container} ref={propRef}>
      <AiOutlineCloseCircle
        className={classes.icon}
        onClick={(e) => {
          e.stopPropagation();
          setShowLikeList(false);
        }}
      />
      {!loading &&
        likesUserInfo.length > 0 &&
        likesUserInfo.map((info) => (
          <li className={classes.list} key={info.user._id}>
            <Avator
              src={info.user.profilePicUrl}
              alt={info.user.name}
              size="auto"
              shape="circle"
            />
            <span className={classes[`user-name`]}>{info.user.name}</span>
            <AiOutlineSearch className={classes[`search-icon`]} />
          </li>
        ))}
      {loading && <AiOutlineLoading3Quarters className={classes.spinner} />}
    </ul>
  );
};

export default LikeList;
