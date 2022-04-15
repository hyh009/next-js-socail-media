import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "../../Form";
import { ChatList, FollowingList, AllUserList } from "../index";
import { SiGooglechat } from "react-icons/si";
import { MdSearch } from "react-icons/md";
import { BsFileEarmarkPersonFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { CgUserList } from "react-icons/cg";
import classes from "./chatOverview.module.css";

const title = {
  chat: "Chat",
  following: "Following List",
  all: "Search",
};
const ChatOverview = ({
  loggedChats,
  currentChatWith,
  setCurrentChatWith,
  connectedUsers,
  userId,
  deleteChat,
  chatWindowRef,
}) => {
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState("chat"); // chat, following, all user
  const [searchloading, setSearchLoading] = useState(false);
  const [openChatOverview, setOpenChatOverview] = useState(true);
  const [startDrag, setStartDrag] = useState(false);
  const [startTouch, setStartTouch] = useState(false);
  const dragableIcon = useRef();
  const [openChatIconPosition, setOpenChatIconPosition] = useState({
    top: "150px",
    left: "20px",
  });
  // make smaller-device-icon dragable
  const handleMove = useCallback(
    ({ movementX, movementY }) => {
      const leftShouldWithin =
        chatWindowRef.current.offsetWidth - dragableIcon.current.offsetWidth;
      const topShouldWithin =
        chatWindowRef.current.offsetHeight - dragableIcon.current.offsetHeight;

      setOpenChatIconPosition((prev) => {
        const newTop = parseInt(prev.top) + movementY;
        const newLeft = parseInt(prev.left) + movementX;
        return {
          top:
            newTop < 0
              ? 0
              : newTop > topShouldWithin
              ? topShouldWithin
              : newTop,
          left:
            newLeft < 0
              ? 0
              : newLeft > leftShouldWithin
              ? leftShouldWithin
              : newLeft,
        };
      });
    },
    [chatWindowRef]
  );

  const handleMouseUp = useCallback(() => {
    window.removeEventListener("mousemove", handleMove);
    setStartDrag(false);
  }, [handleMove]);

  const handlePointerup = useCallback(() => {
    window.removeEventListener("pointermove", handleMove);
    setStartTouch(false);
  }, [handleMove]);

  // to add mousemove (mobile: pointermove) eventlistener
  useEffect(() => {
    if (startDrag) {
      window.addEventListener("mousemove", handleMove);
    }
  }, [startDrag, handleMove]);

  useEffect(() => {
    if (startTouch) {
      window.addEventListener("pointermove", handleMove);
    }
  }, [startTouch, handleMove]);

  // to remove event listener
  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("pointerup", handlePointerup);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("pointerup", handlePointerup);
    };
  }, [handleMouseUp, handlePointerup]);

  useEffect(() => {
    if (currentChatWith) {
      setOpenChatOverview(false);
    }
  }, [currentChatWith]);

  return (
    <>
      {!openChatOverview && (
        <div
          ref={dragableIcon}
          onClick={() => setOpenChatOverview(true)}
          onMouseDown={() => {
            setStartDrag(true);
          }}
          onPointerDown={() => setStartTouch(true)}
          className={classes[`smaller-device-icon`]}
          style={{
            top: openChatIconPosition.top,
            left: openChatIconPosition.left,
            opacity: currentChatWith ? "0.5" : "1",
          }}
          title="Show List"
        >
          <CgUserList />
        </div>
      )}
      <div
        className={`${classes.container} ${
          openChatOverview && classes[`smaller-device-container`]
        } `}
      >
        <div className={classes.header}>
          <div className={classes[`header-content`]}>
            <span className={classes[`header-title`]}>
              {openChatOverview && (
                <MdOutlineArrowBackIos
                  className={classes[`icon-return`]}
                  title="Hide List"
                  onClick={() => {
                    setOpenChatOverview(false);
                  }}
                />
              )}
              {title[mode]}
            </span>
            <div className={classes[`icon-container`]}>
              <SiGooglechat
                title="Chat History"
                className={`${classes.icon} ${
                  mode === "chat" && classes[`icon-active`]
                }`}
                onClick={() => setMode("chat")}
              />
              <BsFileEarmarkPersonFill
                title="Search within following"
                className={`${classes.icon} ${
                  mode === "following" && classes[`icon-active`]
                }`}
                onClick={() => setMode("following")}
              />
              <GiHamburgerMenu
                title="Search for users"
                className={`${classes.icon} ${
                  mode === "all" && classes[`icon-active`]
                }`}
                onClick={() => setMode("all")}
              />
            </div>
          </div>
          <Input
            icon={MdSearch}
            loading={searchloading}
            placeholder={
              mode === "chat"
                ? "search for chat history"
                : mode === "following"
                ? "Search within following"
                : "Search for users"
            }
            type="text"
            value={inputText}
            changeHandler={(e) => setInputText(e.target.value)}
          />
        </div>
        {mode === "chat" && (
          <ChatList
            loggedChats={loggedChats}
            setCurrentChatWith={setCurrentChatWith}
            currentChatWith={currentChatWith}
            inputText={inputText}
            setSearchLoading={setSearchLoading}
            connectedUsers={connectedUsers}
            deleteChat={deleteChat}
          />
        )}
        {mode === "following" && (
          <FollowingList
            setCurrentChatWith={setCurrentChatWith}
            currentChatWith={currentChatWith}
            inputText={inputText}
            setSearchLoading={setSearchLoading}
            connectedUsers={connectedUsers}
            userId={userId}
          />
        )}
        {mode === "all" && (
          <AllUserList
            setCurrentChatWith={setCurrentChatWith}
            currentChatWith={currentChatWith}
            inputText={inputText}
            setSearchLoading={setSearchLoading}
            connectedUsers={connectedUsers}
          />
        )}
      </div>
    </>
  );
};

export default ChatOverview;
