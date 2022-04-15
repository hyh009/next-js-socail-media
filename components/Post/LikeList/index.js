import { useState, useEffect } from "react";
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
import Link from "next/link";
import { Avator } from "../../Common";
import { Spinner } from "../../Layout";
import { AiOutlineCloseCircle, AiOutlineSearch } from "react-icons/ai";
import classes from "./likeList.module.css";

const LikeList = ({ postId, propRef, setShowLikeList }) => {
  const [loading, setLoading] = useState(false);
  const [likesUserInfo, setLikesUserInfo] = useState([]);
  useEffect(() => {
    const controller = new AbortController();
    const getLikesUserInfo = async () => {
      setLoading(true);
      const res = await axios(`${baseUrl}/api/post/like/${postId}`, {
        signal: controller.signal,
      });
      setLikesUserInfo(res.data);
      setLoading(false);
    };

    getLikesUserInfo();
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
            <Link href={`/${encodeURIComponent(info.user.username)}`}>
              <a>
                <AiOutlineSearch className={classes[`search-icon`]} />
              </a>
            </Link>
          </li>
        ))}
      {loading && (
        <div className={classes[`spinner-container`]}>
          <Spinner />
        </div>
      )}
    </ul>
  );
};

export default LikeList;
