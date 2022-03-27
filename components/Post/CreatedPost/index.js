import React, { useState, useEffect } from "react";
import { uploadPic } from "../../../utils/uploadPicToCloudinary";
import classes from "./createdPost.module.css";
import { ImageDragDrop, InputErrorMsg, Avator, Button } from "../../Common";
import { TextArea, GooglePlaceAutoCompelete } from "../../Form";
import { BackDrop } from "../../Layout";
import { MdLocationOn } from "react-icons/md";
import { TiLocationArrowOutline } from "react-icons/ti";
import { createPost } from "../../../utils/postAction";

const CreatedPost = ({ user, refreshRouter, setToastrType }) => {
  const [newPost, setNewPost] = useState({ text: "" });
  const [imagePreview, setImagePreview] = useState("");
  const [location, setLocation] = useState("");
  const [showOption, setShowOption] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    setIsDisable(loading || newPost.text.length === 0);
  }, [loading, newPost.text]);

  const clickHandler = (e) => {
    e.preventDefault();
    setShowOption((prev) => !prev);
  };
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };
  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    let picUrl;

    if (imagePreview) {
      picUrl = await uploadPic(imagePreview);
    }
    // handle uploading image error
    if (imagePreview !== "" && !picUrl) {
      setLoading(false);
      return setErrorMsg("Error occurs when updating image");
    }

    await createPost(
      newPost,
      location,
      picUrl,
      setNewPost,
      setLocation,
      setImagePreview,
      setToastrType,
      setShowOption,
      setErrorMsg,
      refreshRouter
    );

    setLoading(false);
  };
  return (
    <>
      {loading && <BackDrop />}
      <form className={classes.container} onSubmit={handleCreatePost}>
        {errorMsg && <InputErrorMsg errorMsg={errorMsg} />}
        <div className={classes[`input-area`]}>
          <Avator
            src={user?.profilePicUrl}
            alt={user?.username}
            border="border-light"
            shape="circle"
          />
          <div className={classes[`textArea-container`]}>
            <TextArea
              name="text"
              placeholder="What's on your mind?"
              value={newPost.text}
              rows="2"
              changeHandler={changeHandler}
            />
          </div>
        </div>
        {showOption && (
          <>
            <GooglePlaceAutoCompelete
              placeholder="Add location (optional)"
              icon={MdLocationOn}
              address={location}
              setAddress={setLocation}
            />
            <ImageDragDrop
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              size="small"
            />
          </>
        )}
        <div className={classes[`button-container`]}>
          <Button
            look="signup-button"
            type="button"
            clickHandler={clickHandler}
            content={showOption ? "Hide options" : "More options"}
          />
          <Button
            look="signup-button"
            type="submit"
            isDisable={isDisable}
            icon={TiLocationArrowOutline}
            content="Post"
          />
        </div>
      </form>
    </>
  );
};

export default CreatedPost;
