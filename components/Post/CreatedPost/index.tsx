import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { IUser } from "../../../utils/types";
import { uploadPic } from "../../../utils/uploadPicToCloudinary";
import classes from "./createdPost.module.css";
import { ImageDragDrop, InputErrorMsg, Avator, Button } from "../../Common";
import { TextArea, GooglePlaceAutoCompelete } from "../../Form";
import { CropImageModal } from "../index";
import { BackDrop } from "../../Layout";
import { MdLocationOn } from "react-icons/md";
import { BiCrop } from "react-icons/bi";
import { TiLocationArrowOutline } from "react-icons/ti";
import { createPost } from "../../../utils/postAction";
import { useGetDataFromServer } from "../../../utils/hooks/useUpdateData";

interface Props {
  user:IUser
  setToastrType:Dispatch<SetStateAction<string>>
}

const CreatedPost:React.FC<Props> = ({ user, setToastrType }) => {
  const [newPostText, setNewPostText] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [location, setLocation] = useState("");
  const [showOption, setShowOption] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const refreshRouter = useGetDataFromServer();

  useEffect(() => {
    setIsDisable(loading || newPostText.length === 0);
  }, [loading, newPostText]);

  const clickHandler:React.MouseEventHandler = () => {
    setShowOption((prev) => !prev);
  };
  const changeHandler = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setNewPostText(value);
  };
  const handleCreatePost = async (e:React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();
    setLoading(true);
    let picUrl:string;

    if (imagePreview) {
      picUrl = await uploadPic(imagePreview);
    }
    // handle uploading image error
    if (imagePreview !== "" && !picUrl) {
      setLoading(false);
      return setErrorMsg("Error occurs when updating image");
    }

    await createPost(
      newPostText,
      location,
      picUrl,
      setNewPostText,
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
      {showModal && (
        <CropImageModal
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          setShowModal={setShowModal}
        />
      )}
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
              value={newPostText}
              rows={2}
              changeHandler={changeHandler}
            />
          </div>
        </div>
        {showOption && (
          <>
            <GooglePlaceAutoCompelete
              placeholder="Add location (optional)"
              Icon={MdLocationOn}
              address={location}
              setAddress={setLocation}
            />
            <ImageDragDrop
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              size="small"
            />
            {imagePreview && (
              <Button
                content="Crop image"
                type="button"
                icon={BiCrop}
                clickHandler={() => {
                  setShowModal(true);
                }}
              />
            )}
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
