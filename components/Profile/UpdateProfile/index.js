import { useState } from "react";
import classes from "./updateProfile.module.css";
import { uploadPic } from "../../../utils/uploadPicToCloudinary";
import { ImageDragDrop, Button, InputErrorMsg } from "../../Common";
import { TextArea, Input } from "../../Form";
import { CropImageModal } from "../../Post";
import { BackDrop } from "../../Layout";
import {
  AiFillInstagram,
  AiFillFacebook,
  AiFillYoutube,
  AiFillTwitterSquare,
} from "react-icons/ai";
import { BiCrop } from "react-icons/bi";
import { profileUpdate } from "../../../utils/profileAction";
import { useGetDataFromServer } from "../../../utils/hooks/useUpdateData";

const UpdateProfile = ({ Profile, setToastrType }) => {
  const [profile, setProfile] = useState({
    bio: Profile.bio,
    facebook: Profile?.social?.facebook || "",
    instagram: Profile?.social?.instagram || "",
    youtube: Profile?.social?.youtube || "",
    twitter: Profile?.social?.twitter || "",
  });
  const [imagePreview, setImagePreview] = useState(Profile.user.profilePicUrl);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [showModal, setShowModal] = useState(false); // for image cropper
  const refreshRouter = useGetDataFromServer();
  // handle input change
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };
  // to reset form
  const resetHandler = (e) => {
    setProfile({
      bio: Profile.bio,
      facebook: Profile?.social?.facebook || "",
      instagram: Profile?.social?.instagram || "",
      youtube: Profile?.social?.youtube || "",
      twitter: Profile?.social?.twitter || "",
    });
    setImagePreview(Profile.user.profilePicUrl);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    let picUrl;

    if (imagePreview) {
      picUrl = await uploadPic(imagePreview);
    }
    // handle uploading image error
    if (imagePreview !== "" && !picUrl) {
      return setErrorMsg("Error occurs when updating image");
    }
    // update data here
    profileUpdate(
      profile,
      picUrl,
      setErrorMsg,
      setLoading,
      setToastrType,
      refreshRouter
    );
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
      <form className={classes.container} onSubmit={submitHandler}>
        <div className={classes[`image-drop-container`]}>
          <ImageDragDrop
            setImagePreview={setImagePreview}
            imagePreview={imagePreview}
          />
        </div>
        {imagePreview && (
          <Button
            content="Crop image"
            type="button"
            icon={BiCrop}
            clickHandler={(e) => {
              setShowModal(true);
            }}
          />
        )}
        {errorMsg && <InputErrorMsg errorMsg={errorMsg} />}
        <TextArea
          name="bio"
          value={profile.bio}
          rows={5}
          changeHandler={changeHandler}
        />
        <div className={classes[`social-container`]}>
          <Button
            content={showSocialLinks ? "Hide Social Links" : "Add Social Links"}
            look="signup-button"
            type="button"
            clickHandler={
              showSocialLinks
                ? () => setShowSocialLinks(false)
                : () => setShowSocialLinks(true)
            }
          />
          {showSocialLinks && (
            <>
              <Input
                name="facebook"
                value={profile.facebook}
                icon={AiFillFacebook}
                changeHandler={changeHandler}
              />
              <Input
                name="instagram"
                value={profile.instagram}
                icon={AiFillInstagram}
                changeHandler={changeHandler}
              />
              <Input
                name="youtube"
                value={profile.youtube}
                icon={AiFillYoutube}
                changeHandler={changeHandler}
              />
              <Input
                name="twitter"
                value={profile.twitter}
                icon={AiFillTwitterSquare}
                changeHandler={changeHandler}
              />
            </>
          )}
        </div>
        <div className={classes[`button-container`]}>
          <Button
            content="reset"
            type="button"
            look="cancel-button"
            clickHandler={resetHandler}
            isDisable={loading}
          />
          <Button
            content="submit"
            type="submit"
            look="confirm-button"
            isDisable={loading}
            loading={loading}
          />
        </div>
      </form>
    </>
  );
};

export default UpdateProfile;
