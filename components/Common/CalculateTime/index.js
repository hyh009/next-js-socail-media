import dayjs from "dayjs";
import { useRouter } from "next/router";
import classes from "./calculateTime.module.css";

const checkDay = (postDate, thisYear, beforeYesterday, yesterday, today) => {
  if (postDate < thisYear) {
    return "before this year";
  } else if (postDate < beforeYesterday) {
    return "before yesterday";
  } else if (postDate < yesterday) {
    return "yesterday";
  } else if (postDate < today) {
    return "today";
  }
};

export const CalculateTime = ({ date, type, postId, msg }) => {
  const router = useRouter();
  const postDate = dayjs(date);
  const dateTitle = dayjs(date).format("YYYY MM DD, h:mm a");
  const thisYear = dayjs().startOf("year");
  const beforeYesterday = dayjs().subtract(2, "day").endOf("day");
  const yesterday = dayjs().subtract(1, "day").endOf("day");
  const today = dayjs().endOf("day");

  const clickHandler = () => {
    router.push(`/post/${postId}`);
  };
  if (
    checkDay(postDate, thisYear, beforeYesterday, yesterday, today) ===
    "before this year"
  ) {
    return (
      <div
        title={dateTitle}
        className={
          type === "post"
            ? classes.date
            : type === "comment"
            ? classes[`date-comment`]
            : ""
        }
      >
        <span
          className={classes[`link-text`]}
          onClick={postId ? router.push(`/post/${postId}`) : undefined}
        >
          {dayjs(date).format("YYYY-MM-DD hh:mm A")}
        </span>
      </div>
    );
  } else if (
    checkDay(postDate, thisYear, beforeYesterday, yesterday, today) === "today"
  ) {
    return (
      <div
        title={dateTitle}
        className={
          type === "post"
            ? classes.date
            : type === "comment"
            ? classes[`date-comment`]
            : ""
        }
      >
        <span
          className={classes[`link-text`]}
          onClick={postId ? clickHandler : undefined}
        >{`${!msg && "Today "}${dayjs(date).format("hh:mm A")}`}</span>
      </div>
    );
  } else if (
    checkDay(postDate, thisYear, beforeYesterday, yesterday, today) ===
    "yesterday"
  ) {
    return (
      <div
        title={dateTitle}
        className={
          type === "post"
            ? classes.date
            : type === "comment"
            ? classes[`date-comment`]
            : ""
        }
      >
        <span
          className={classes[`link-text`]}
          onClick={postId ? clickHandler : undefined}
        >{`${!msg && "Yesterday "}${dayjs(date).format("hh:mm A")}`}</span>
      </div>
    );
  } else if (
    checkDay(postDate, thisYear, beforeYesterday, yesterday, today) ===
    "before yesterday"
  ) {
    return (
      <div
        title={dateTitle}
        className={
          type === "post"
            ? classes.date
            : type === "comment"
            ? classes[`date-comment`]
            : ""
        }
      >
        <span
          className={classes[`link-text`]}
          onClick={postId ? clickHandler : undefined}
        >{`${dayjs(date).format("MM-DD hh:mm A")}`}</span>
      </div>
    );
  }
};
