import React,{Dispatch, SetStateAction} from "react";
import {NewReceivedMsgState} from "../../../utils/types"
import ReactDOM from "react-dom";
import { Avator, CalculateTime } from "../../Common";
import classes from "./msgModal.module.css";
interface Props {
  newRecievedMessage:NewReceivedMsgState
  setShowNewMessageModal:Dispatch<SetStateAction<boolean>>
}

const MsgModal:React.FC<Props> = ({ newRecievedMessage, setShowNewMessageModal }) => {
  return ReactDOM.createPortal(
    <div
      className={classes.container}
      onAnimationEnd={() => setShowNewMessageModal(false)}
    >
      <Avator
        src={newRecievedMessage.senderProfilePic}
        alt={newRecievedMessage.senderName}
        shape="circle"
      />
      <div className={classes[`msg-preview`]}>
        <div className={classes[`date-and-name-container`]}>
          <span>{newRecievedMessage.senderName}</span>
          <CalculateTime date={newRecievedMessage.date} msg={true} />
        </div>
        <span className={classes.msg}>{newRecievedMessage.msg}</span>
      </div>
    </div>,
    document.getElementById("backdrop-root")
  );
};

export default MsgModal;
