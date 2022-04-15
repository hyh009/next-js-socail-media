import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  useUserSearch,
  useFilterUser,
} from "../../../utils/hooks/useUserSearch";
import { Avator, CalculateTime } from "../../Common";
import { DivSpinner } from "../../Layout";
import { MdOutlineDeleteForever } from "react-icons/md";
import { VscCircleFilled } from "react-icons/vsc";
import classes from "./chatList.module.css";
import { v4 as uuidv4 } from "uuid";

const ChatInfo = ({
  data,
  currentChatWith,
  setCurrentChatWith,
  connectedUsers,
  messageDeleted,
  deleteChat,
}) => {
  const isActive = (messagesWithId) =>
    messagesWithId === currentChatWith?.messagesWith;
  const isOnline = (messagesWithId) =>
    connectedUsers.filter(
      (connectedUser) => connectedUser?.userId === messagesWithId
    ).length > 0;
  return (
    <div
      className={`${classes[`chat-container`]} ${
        isActive(data.messagesWith) && classes.active
      }`}
      onClick={() => {
        setCurrentChatWith({
          messagesWith: data.messagesWith,
          name: data.name,
          profilePicUrl: data.profilePicUrl,
        });
      }}
    >
      <Avator src={data.profilePicUrl} alt={data.name} shape="circle" />
      <div className={classes.content}>
        <div className={classes[`name-and-date`]}>
          <span className={`${classes.name}`}>
            {data.name}
            {isOnline(data.messagesWith) && (
              <VscCircleFilled className={classes[`online-icon`]} />
            )}
          </span>
          <div className={classes[`icon-container`]}>
            {data?.date && <CalculateTime date={data.date} />}
            {deleteChat && (
              <MdOutlineDeleteForever
                className={classes[`delete-icon`]}
                onClick={() => deleteChat(data.messagesWith)}
              />
            )}
          </div>
        </div>
        {data?.lastMessage && (
          <span
            className={`${classes[`msg-preview`]} ${
              messageDeleted && classes[`msg-deleted`]
            }`}
          >
            {!messageDeleted ? data.lastMessage : "This message was deleted"}
          </span>
        )}
      </div>
    </div>
  );
};

const PlaceHolder = ({ text, src }) => {
  return (
    <div className={classes[`image-container`]}>
      <span className={classes[`image-desc`]}>{text}</span>
      <Image
        src={src}
        alt={text}
        width={200}
        height={200}
        objectFit="contain"
      />
    </div>
  );
};

export const ChatList = ({
  setCurrentChatWith,
  currentChatWith,
  inputText,
  setSearchLoading,
  connectedUsers,
  loggedChats,
  deleteChat,
}) => {
  const [filterChats, setFilterChats] = useState(loggedChats);
  // filter user by inputText
  useFilterUser(inputText, setSearchLoading, setFilterChats, loggedChats);

  const messageDeleted = (msgText) =>
    msgText === "**This message was deleted**";

  return (
    <>
      {filterChats.length === 0 && (
        <PlaceHolder
          text="No Chat found"
          src="https://res.cloudinary.com/dh2splieo/image/upload/v1649405081/social_media/undraw_taken_re_yn20_wkoxnf.svg"
        />
      )}
      {filterChats.length > 0 &&
        filterChats.map((chat) => (
          <ChatInfo
            key={uuidv4()}
            data={chat}
            currentChatWith={currentChatWith}
            setCurrentChatWith={setCurrentChatWith}
            connectedUsers={connectedUsers}
            messageDeleted={messageDeleted(chat.lastMessage)}
            deleteChat={deleteChat}
          />
        ))}
    </>
  );
};

export const FollowingList = ({
  setSearchLoading,
  inputText,
  userId,
  currentChatWith,
  setCurrentChatWith,
  connectedUsers,
}) => {
  const [followingUser, setFollowingUser] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getFollowingUser = async () => {
      setLoading(true);
      const controller = new AbortController();
      const res = await axios(`${baseUrl}/api/profile/following/${userId}`, {
        signal: controller.signal,
      });
      setFollowingUser(() =>
        res.data.map((item) => ({
          _id: item.user._id,
          profilePicUrl: item.user.profilePicUrl,
          name: item.user.name,
        }))
      );
      setFilterData(() =>
        res.data.map((item) => ({
          _id: item.user._id,
          profilePicUrl: item.user.profilePicUrl,
          name: item.user.name,
        }))
      );
      setLoading(false);
    };
    getFollowingUser();
    return () => typeof controller !== "undefined" && controller.abort();
  }, [userId]);
  // filter user by inputText
  useFilterUser(inputText, setSearchLoading, setFilterData, followingUser);

  return (
    <>
      {loading && <DivSpinner />}
      {!loading && filterData.length === 0 && (
        <PlaceHolder
          text="No user found"
          src="https://res.cloudinary.com/dh2splieo/image/upload/v1649405081/social_media/undraw_taken_re_yn20_wkoxnf.svg"
        />
      )}
      {!loading &&
        filterData.map((data) => (
          <ChatInfo
            key={uuidv4()}
            data={{
              messagesWith: data._id,
              profilePicUrl: data.profilePicUrl,
              name: data.name,
            }}
            currentChatWith={currentChatWith}
            setCurrentChatWith={setCurrentChatWith}
            connectedUsers={connectedUsers}
          />
        ))}
    </>
  );
};

export const AllUserList = ({
  setSearchLoading,
  inputText,
  currentChatWith,
  setCurrentChatWith,
  connectedUsers,
}) => {
  const { results } = useUserSearch(inputText, setSearchLoading);
  return (
    <>
      {results.length === 0 && inputText === "" && (
        <PlaceHolder
          text="Search for users"
          src="https://res.cloudinary.com/dh2splieo/image/upload/v1649403012/social_media/undraw_people_search_re_5rre_xs8nhx.svg"
        />
      )}
      {results.length === 0 && inputText !== "" && (
        <PlaceHolder
          text="No user found"
          src="https://res.cloudinary.com/dh2splieo/image/upload/v1649405081/social_media/undraw_taken_re_yn20_wkoxnf.svg"
        />
      )}
      {results.map((data) => (
        <ChatInfo
          key={uuidv4()}
          data={{
            messagesWith: data._id,
            profilePicUrl: data.profilePicUrl,
            name: data.name,
          }}
          currentChatWith={currentChatWith}
          setCurrentChatWith={setCurrentChatWith}
          connectedUsers={connectedUsers}
        />
      ))}
    </>
  );
};
