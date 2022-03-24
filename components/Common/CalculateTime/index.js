import moment from "moment";
import Moment from "react-moment";
import classes from "./calculateTime.module.css";

const calculateTime = ({ createdat, type }) => {
  const postDate = moment(createdat);
  const dateTitle = moment(createdat).format("YYYY MM DD, h:mm a");
  const beforeYesterday = moment().subtract(2, "day").endOf("day");
  const yesterday = moment().subtract(1, "day").endOf("day");
  const today = moment().endOf("day");

  const checkDay = () => {
    if (postDate < beforeYesterday) {
      return "before yesterday";
    } else if (postDate < yesterday) {
      return "yesterday";
    } else if (postDate < today) {
      return "today";
    }
  };

  if (checkDay() === "today") {
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
        Today <Moment format="hh:mm A">{createdat}</Moment>
      </div>
    );
  } else if (checkDay() === "yesterday") {
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
        Yesterday <Moment format="hh:mm A">{createdat}</Moment>
      </div>
    );
  } else if (checkDay() === "before yesterday") {
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
        <Moment format="YYYY-MM-DD hh:mm A">{createdat}</Moment>
      </div>
    );
  }
};

export default calculateTime;
