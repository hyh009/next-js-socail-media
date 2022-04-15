import moment from "moment";
import Moment from "react-moment";
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
  const postDate = moment(date);
  const dateTitle = moment(date).format("YYYY MM DD, h:mm a");
  const thisYear = moment().startOf("year");
  const beforeYesterday = moment().subtract(2, "day").endOf("day");
  const yesterday = moment().subtract(1, "day").endOf("day");
  const today = moment().endOf("day");
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
        <Moment format="YYYY-MM-DD hh:mm A">{date}</Moment>
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
        {!msg && "Today "}
        <Moment format="hh:mm A">{date}</Moment>
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
        Yesterday <Moment format="hh:mm A">{date}</Moment>
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
        <Moment format="MM-DD hh:mm A">{date}</Moment>
      </div>
    );
  }
};
