import React,{Dispatch,SetStateAction} from "react";
import {IPost, IUser} from "../../../utils/types"
import { Card } from "../index";
import { EndMessage, DivSpinner } from "../../Layout";
import InfiniteScroll from "react-infinite-scroll-component";
import classes from "../../Layout/MainLayout/MainLayout.module.css";

interface Props {
  posts:IPost[]
  user:IUser
  hasMore:boolean
  fetchDataOnScroll:()=>void
  setToastrType:Dispatch<SetStateAction<string>>
  setUpdateTrue:()=>void
  currentPage?:number // no need for account(profile) page
}


const InfiniteScrollPost:React.FC<Props> = ({
  posts,
  user,
  hasMore,
  fetchDataOnScroll,
  setToastrType,
  setUpdateTrue,
  currentPage,
}) => {
  return (
    <InfiniteScroll
      className={classes[`content-wrapper`]}
      hasMore={hasMore}
      next={fetchDataOnScroll}
      dataLength={posts.length}
      loader={<DivSpinner />}
      endMessage={<EndMessage />}
      scrollableTarget="scrollableDiv"
    >
      {posts.map((post:IPost) => (
        <Card
          key={post._id}
          post={post}
          user={user}
          setToastrType={setToastrType}
          setUpdateTrue={setUpdateTrue}
          currentPage={currentPage}
        />
      ))}
    </InfiniteScroll>
  );
};

export default InfiniteScrollPost;
