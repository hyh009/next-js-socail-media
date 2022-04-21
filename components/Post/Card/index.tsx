import React,{ useState, useRef,Dispatch, SetStateAction } from "react";
import { IPost, IUser } from "../../../utils/types";
import { Content, CommentArea, PostModal } from "../index";
import { Popup } from "../../Common";
import { BackDrop } from "../../Layout";
import { AiOutlineClose } from "react-icons/ai";
import { MdKeyboardReturn } from "react-icons/md";
import useClickOutsideClose from "../../../utils/hooks/useClickOutsideClose";
import { deletePost } from "../../../utils/postAction";
import { useGetDataFromServer } from "../../../utils/hooks/useUpdateData";
import classes from "./card.module.css";

interface Props {
  post:IPost
  user:IUser
  setToastrType:Dispatch<SetStateAction<string>>
  setUpdateTrue?:()=>void  // for client side update
  currentPage?:number // for server side update
}
const Card:React.FC<Props> = ({ post, user, setToastrType, setUpdateTrue, currentPage }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPop, setShowPop] = useState<boolean>(false);
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const popRef = useRef<HTMLDivElement>(null);
  const commentpopRef = useRef<HTMLDivElement>(null);

  // click outside to close popup
  useClickOutsideClose(popRef, setShowPop);
  useClickOutsideClose(commentpopRef, setShowComments);
  const refreshRouter = useGetDataFromServer(setUpdateTrue);

  // delete a post
  const handleDeletePost:React.MouseEventHandler<HTMLButtonElement> = async ():Promise<void> => {
    setLoading(true);
    await deletePost(post._id, setToastrType, refreshRouter, setUpdateTrue);
    setLoading(false);
  };

  return (
    <>
      {(loading || showPostModal || showComments) && <BackDrop />}
      {
        // post model
        showPostModal && (
          <PostModal
            post={post}
            user={user}
            setShowPostModal={setShowPostModal}
            setShowComments={setShowComments}
            setUpdateTrue={setUpdateTrue}
          />
        )
      }
      {
        // comment modal
        showComments && (
          <CommentArea
            propClass="comment-modal"
            post={post}
            user={user}
            showComments={showComments}
            setUpdateTrue={setUpdateTrue}
            popRef={commentpopRef}
          />
        )
      }
      <div className={classes.container}>
        {
          // change icon & show delete button popup
          (user._id === post.user._id || user.role === "admin") && showPop && (
            <>
              <Popup popRef={popRef} clickHandler={handleDeletePost} />
              <MdKeyboardReturn
                className={classes[`icon-delete`]}
                onClick={() => {
                  setShowPop(false);
                }}
              />
            </>
          )
        }
        {(user._id === post.user._id || user.role === "admin") && !showPop && (
          <AiOutlineClose
            className={classes[`icon-delete`]}
            onClick={() => {
              setShowPop(true);
            }}
          />
        )}
        <Content
          post={post}
          user={user}
          setUpdateTrue={setUpdateTrue}
          showImage={true}
          currentPage={currentPage}
          setShowPostModal={setShowPostModal}
          setShowComments={setShowComments}
        />
        <CommentArea
          post={post}
          user={user}
          setUpdateTrue={setUpdateTrue}
          number={showComments ? undefined : 3}
          showComments={showComments}
        />
      </div>
    </>
  );
};

export default Card;
