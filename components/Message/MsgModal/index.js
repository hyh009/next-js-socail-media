import ReactDOM from "react-dom";
import { Avator, CalculateTime } from "../../Common";
import classes from "./msgModal.module.css";

const MsgModal = ({ newRecievedMessage }) => {
  return ReactDOM.createPortal(
    <div className={classes.container}>
      <Avator
        src={newRecievedMessage.senderProfilePic}
        alr={newRecievedMessage.senderName}
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
