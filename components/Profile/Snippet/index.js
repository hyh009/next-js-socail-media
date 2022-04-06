import { useState } from "react";
import Image from "next/image";
import classes from "./snippet.module.css";
import { Button } from "../../Common";
import {
  AiFillInstagram,
  AiFillFacebook,
  AiFillYoutube,
  AiFillTwitterSquare,
} from "react-icons/ai";
import { GrMail } from "react-icons/gr";
import { RiUserUnfollowLine, RiUserFollowLine } from "react-icons/ri";
import { followUser, unfollowUser } from "../../../utils/profileAction";

const Snippet = ({ user, profile, isFollowing, refreshRouter }) => {
  const [showAllBio, setShowAllBio] = useState(false);
  const ownAccount = profile.user._id === user._id;

  return (
    <div className={classes.container}>
      <div className={classes[`info-container`]}>
        <h1>{profile.user.name}</h1>
        <div>
          <span>
            {profile.bio.length > 35 && !showAllBio
              ? profile.bio.slice(0, 150) + "..."
              : profile.bio}
          </span>
          <span
            className={classes.clickText}
            onClick={() => {
              setShowAllBio((prev) => !prev);
            }}
          >
            {profile.bio.length > 35 &&
              (showAllBio ? "Hide Text" : "Read More")}
          </span>
        </div>
        <div>
          {/* email & social link area */}
          <div className={classes.iconAndText}>
            <GrMail style={{ color: "#57bdaf" }} />
            {profile.user.email}
          </div>
          {profile?.social?.facebook && (
            <div className={classes.iconAndText}>
              <AiFillFacebook style={{ color: "	#3b5998" }} />
              {profile.social.facebook}
            </div>
          )}
          {profile?.social?.instagram && (
            <div className={classes.iconAndText}>
              <AiFillInstagram style={{ color: "	#8a3ab9" }} />
              {profile.social.instagram}
            </div>
          )}
          {profile?.social?.youtube && (
            <div className={classes.iconAndText}>
              <AiFillYoutube style={{ color: "	#FF0000" }} />
              {profile.social.youtube}
            </div>
          )}
          {profile?.social?.twitter && (
            <span className={classes.iconAndText}>
              <AiFillTwitterSquare style={{ color: "	#00acee" }} />
              {profile.social.twitter}
            </span>
          )}
          {!profile?.social?.twitter &&
            !profile?.social?.instagram &&
            !profile.socail?.facebook &&
            !profile?.socail?.youtube && <span>No Social Media Link</span>}
        </div>
      </div>
      <div className={classes[`right-container`]}>
        <div className={classes[`image-container`]}>
          <Image
            src={profile.user.profilePicUrl}
            alt={user.name}
            width="100%"
            height="100%"
            layout="responsive"
            objectFit="cover"
          />
        </div>
        {!ownAccount && (
          <Button
            content={isFollowing ? "Unfollow" : "Follow"}
            icon={isFollowing ? RiUserUnfollowLine : RiUserFollowLine}
            look="small-button"
            type="button"
            clickHandler={
              isFollowing
                ? () => unfollowUser(profile.user._id, refreshRouter)
                : () => followUser(profile.user._id, refreshRouter)
            }
          />
        )}
      </div>
    </div>
  );
};

export default Snippet;
