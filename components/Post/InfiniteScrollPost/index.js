import React from "react";
import { Card } from "../index";
import { EndMessage, DivSpinner } from "../../Layout";
import InfiniteScroll from "react-infinite-scroll-component";
import classes from "../../Layout/MainLayout/MainLayout.module.css";

const InfiniteScrollPost = ({
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
      {posts.map((post) => (
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
