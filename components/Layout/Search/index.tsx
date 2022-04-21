import React,{ useState, useRef, forwardRef,MouseEventHandler } from "react";
import { SearchUser } from "../../../utils/types";
import Link from "next/link";
import {useClickOutsideClose, useUserSearch} from "../../../utils/hooks";
import { Spinner } from "../index";
import { Avator } from "../../Common";
import { MdPersonSearch, MdSearch } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import classes from "./search.module.css";

interface ForwardRefProps {
  onClick?:MouseEventHandler<HTMLAnchorElement>
  href?:string
  data:SearchUser
}

const UserLink = forwardRef<HTMLAnchorElement, ForwardRefProps>(({ onClick, href, data }, ref) => {
  return (
    <a
      href={href}
      onClick={onClick}
      ref={ref}
      className={classes[`search-result-single-container`]}
    >
      <div className={classes[`search-result`]}>
        <MdSearch
          className={`${classes[`icon-white`]} ${classes[`no-bigtablet`]} ${
            classes[`mobile`]
          }`}
        />
        <Avator
          src={data.profilePicUrl}
          alt={data.name}
          size="small"
          shape="circle"
        />
        <span>{data.name}</span>
      </div>
    </a>
  );
});

UserLink.displayName = "UserLink";

const Search:React.FC = () => {
  const [text, setText] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>();
  useClickOutsideClose(searchRef, setShowSearch);
  const results = useUserSearch(text, setLoading);

  return (
    <>
      {!showSearch && (
        <MdPersonSearch
          title="show search input"
          className={`${classes[`search-icon`]} ${classes.tablet}`}
          onClick={() => {
            setShowSearch(true);
          }}
        />
      )}
      <div
        ref={searchRef}
        className={`${classes.container} ${
          showSearch && classes[`show-container`]
        }`}
      >
        {showSearch && (
          <AiOutlineClose
            className={`${classes[`close-icon`]} ${classes.tablet}`}
            onClick={() => {
              setShowSearch(false);
            }}
          />
        )}
        <div
          className={`${classes[`input-container`]}  ${
            !loading && results.length === 0 && classes[`no-user`]
          }`}
        >
          <div className={classes[`input-label`]}>
            {loading ? (
              <Spinner className={classes[`icon`]} />
            ) : (
              <MdPersonSearch className={`${classes.icon}`} />
            )}
            <input
              className={`${classes.input}`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          {results.length > 0 && text.length > 0 && (
            <div className={`${classes[`search-results-container`]}`}>
              {results.map((data, index) => (
                <Link href={`/${data.username}`} passHref key={index}>
                  <UserLink data={data} />
                </Link>
              ))}
            </div>
          )}
        </div>
        <span className={classes[`no-result`]}></span>
      </div>
    </>
  );
};

export default Search;
