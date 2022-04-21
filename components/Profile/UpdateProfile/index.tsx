import React, {  useState,Dispatch,SetStateAction } from "react";
import { IProfile,ProfileUpdateState } from "../../../utils/types";
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
import classes from "./updateProfile.module.css";
import { profileUpdate } from "../../../utils/profileAction";
import { useGetDataFromServer } from "../../../utils/hooks/useUpdateData";

interface Props {
  Profile:IProfile
  setToastrType:Dispatch<SetStateAction<string>>
}
const UpdateProfile:React.FC<Props> = ({ Profile, setToastrType }) => {
  const [profile, setProfile] = useState<ProfileUpdateState>({
    bio: Profile.bio,
    facebook: Profile?.social?.facebook || "",
    instagram: Profile?.social?.instagram || "",
    youtube: Profile?.social?.youtube || "",
    twitter: Profile?.social?.twitter || "",
  });
  const [imagePreview, setImagePreview] = useState<string>(Profile.user.profilePicUrl);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showSocialLinks, setShowSocialLinks] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false); // for image cropper
  const refreshRouter = useGetDataFromServer();
  // handle input change
  const changeHandler = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>):void => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };
  // to reset form
  const resetHandler:React.MouseEventHandler<HTMLButtonElement> = ():void => {
    setProfile({
      bio: Profile.bio,
      facebook: Profile?.social?.facebook || "",
      instagram: Profile?.social?.instagram || "",
      youtube: Profile?.social?.youtube || "",
      twitter: Profile?.social?.twitter || "",
    });
    setImagePreview(Profile.user.profilePicUrl);
  };

  const submitHandler = async (e:React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();
    setLoading(true);
    let picUrl:string;

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
               type="text"
                name="facebook"
                value={profile.facebook}
                Icon={AiFillFacebook}
                changeHandler={changeHandler}
              />
              <Input
               type="text"
                name="instagram"
                value={profile.instagram}
                Icon={AiFillInstagram}
                changeHandler={changeHandler}
              />
              <Input
                type="text"
                name="youtube"
                value={profile.youtube}
                Icon={AiFillYoutube}
                changeHandler={changeHandler}
              />
              <Input
                type="text"
                name="twitter"
                value={profile.twitter}
                Icon={AiFillTwitterSquare}
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
