import React, { useState, useEffect, Dispatch, SetStateAction, } from "react";
import {PasswordsUpdateState} from "../../../utils/types"
import { Input, Checkbox } from "../../Form";
import { Button, InputErrorMsg } from "../../Common";
import { BackDrop } from "../../Layout";
import { GiIdCard } from "react-icons/gi";
import { MdVisibilityOff, MdVisibility } from "react-icons/md";
import { BiPaperPlane } from "react-icons/bi";
import classes from "./setting.module.css";
import {
  passwordUpdate,
  toggleMessagePopup,
} from "../../../utils/profileAction";

interface Props {
  newMessagePopup:boolean
  setToastrType:Dispatch<SetStateAction<string>>
}


const Setting:React.FC<Props> = ({ newMessagePopup, setToastrType }) => {
  const [showUpdateBlock, setShowUpdateBlock] = useState<Array<boolean>>([false, false]);
  const [loading, setLoading] = useState<boolean>(false);
  // for updating password
  const [showPasswordCurrent, setShowPasswordCurrent] = useState<boolean>(false);
  const [showPasswordNew, setShowPasswordNew] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);
  const [passwords, setPasswords] = useState<PasswordsUpdateState>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isDisable, setIsDisable] = useState<boolean>(false);
  // set message popup
  const [messagePopup, setMessagePopup] = useState<boolean>(newMessagePopup);

  useEffect(() => {
    // check if newpassword is equal to confirm password
    if (
      passwords.newPassword !== passwords.confirmPassword &&
      passwords.confirmPassword !== ""
    ) {
      setErrorMsg("confirm password must be equal to new password");
    } else {
      setErrorMsg("");
    }
    // check if any password field is empty => if empty disable confirm button
    setIsDisable(() =>
      Object.values(passwords).some((item) => item.length === 0)
    );
  }, [passwords]);

  // only show error message 5 seconds
  useEffect(() => {
    let timer:any;
    if (errorMsg) {
      timer = setTimeout(() => setErrorMsg(""), 5000);
    }
    return () => timer && clearTimeout(timer);
  }, [errorMsg]);

  // handle input change
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  // handle password form submit
  const handleUpdatePassword = async (e:React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return setErrorMsg("confirm password is not equal to new password");
    }
    if (Object.values(passwords).some((item:string) => item.length < 6)) {
      return setErrorMsg("password must be at least 6 characters");
    }
    setLoading(true);
    await passwordUpdate(
      passwords.currentPassword,
      passwords.newPassword,
      setPasswords, // reset password inputs
      setToastrType
    );
    setLoading(false);
    // close update password block
    setShowUpdateBlock((prev) =>
      prev.map((status, index) => (index === 0 ? false : status))
    );
  };

  // handle reset form and hide password block
  const handleReset = ():void => {
    // reset form
    setErrorMsg("");
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    // close update password block
    setShowUpdateBlock((prev) =>
      prev.map((stauts, index) => (index === 0 ? false : stauts))
    );
  };

  // handle change show message popup
  const handleChangeMessagePopup:React.ChangeEventHandler = async ():Promise<void> => {
    setLoading(true);
    await toggleMessagePopup(setMessagePopup, setToastrType);
    setLoading(false);
  };

  return (
    <>
      {loading && <BackDrop />}
      <div className={classes.container}>
        {/* update password block */}
        <div className={classes[`update-container`]}>
          <h3
            className={classes.title}
            onClick={() =>
              setShowUpdateBlock((prev) =>
                prev.map((status, index) => (index === 0 ? !status : status))
              )
            }
          >
            <GiIdCard />
            Update Password
          </h3>
          {showUpdateBlock[0] && (
            <form
              className={classes[`password-input-container`]}
              onSubmit={handleUpdatePassword}
            >
              {errorMsg && <InputErrorMsg errorMsg={errorMsg} />}
              <Input
                label="Current Password"
                Icon={showPasswordCurrent ? MdVisibility : MdVisibilityOff}
                type={showPasswordCurrent ? "text" : "password"}
                name="currentPassword"
                value={passwords.currentPassword}
                setShowPassword={setShowPasswordCurrent}
                changeHandler={handleChange}
                require="require"
                placeholder="password must be at least 6 charcters"
              />
              <Input
                label="New Password"
                Icon={showPasswordNew ? MdVisibility : MdVisibilityOff}
                type={showPasswordNew ? "text" : "password"}
                name="newPassword"
                value={passwords.newPassword}
                setShowPassword={setShowPasswordNew}
                changeHandler={handleChange}
                require="require"
                placeholder="password must be at least 6 charcters"
              />
              <Input
                label="Confirm Password"
                Icon={showPasswordConfirm ? MdVisibility : MdVisibilityOff}
                type={showPasswordConfirm ? "text" : "password"}
                name="confirmPassword"
                value={passwords.confirmPassword}
                setShowPassword={setShowPasswordConfirm}
                changeHandler={handleChange}
                require="require"
                placeholder="password must be at least 6 charcters"
              />
              <div className={classes[`button-container`]}>
                <Button
                  content="cancel"
                  type="button"
                  look="cancel-button"
                  clickHandler={handleReset}
                />
                <Button
                  content="confirm"
                  type="submit"
                  look="confirm-button"
                  isDisable={isDisable}
                />
              </div>
            </form>
          )}
        </div>
        {/* messagePopup setting block */}
        <div className={classes[`update-container`]}>
          <h3
            className={classes.title}
            onClick={() =>
              setShowUpdateBlock((prev) =>
                prev.map((status, index) => (index === 1 ? !status : status))
              )
            }
          >
            <BiPaperPlane />
            Show New Message Popup
          </h3>
          {showUpdateBlock[1] && (
            <Checkbox
              name="messagePopup"
              checked={messagePopup}
              desc="Control whether a Popup should appear when there is a new Message"
              changeHandler={handleChangeMessagePopup}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Setting;
