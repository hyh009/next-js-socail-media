import { useState, useEffect, useCallback, forwardRef } from "react";
import classes from "./search.module.css";
import axios from "axios";
import { MdPersonSearch, MdSearch } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import baseUrl from "../../../utils/baseUrl";
import Link from "next/link";

const UserLink = forwardRef(({ onClick, href, data }, ref) => {
  return (
    <a
      href={href}
      onClick={onClick}
      ref={ref}
      className={`${classes[`search-result-container`]}`}
    >
      <div className={classes[`search-result`]}>
        <MdSearch className={classes[`icon-white`]} />
        <img className={classes.img} src={data.profilePicUrl} alt={data.name} />
        <span>{data.name}</span>
      </div>
    </a>
  );
});

const Search = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      if (text.trim().length === 0) {
        setResults([]);
        return;
      }
      const res = await axios(`${baseUrl}/search/${text}`);
      setResults(() =>
        res.data.map((data) => ({
          name: data.name,
          username: data.username,
          profilePicUrl: data.profilePicUrl,
        }))
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [text]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <div className={classes.container}>
      <div
        className={`${classes[`input-container`]}  ${
          !loading && results.length === 0 && classes[`no-user`]
        }`}
      >
        {loading ? (
          <AiOutlineLoading3Quarters
            className={`${classes.icon} ${classes.spin}`}
          />
        ) : (
          <MdPersonSearch className={`${classes.icon}`} />
        )}
        <input
          className={`${classes.input}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {results.length > 0 &&
          text.length > 0 &&
          results.map((data, index) => (
            <Link href={`/${data.username}`} passHref key={index}>
              <UserLink data={data} />
            </Link>
          ))}
      </div>
      <span className={classes[`no-result`]}></span>
    </div>
  );
};

export default Search;
