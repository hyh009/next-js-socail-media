import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import baseUrl from "../baseUrl";

export const useUserSearch = (text, setLoading) => {
  const [results, setResults] = useState([]);
  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      if (text.trim().length === 0) {
        setResults([]);
        return;
      }
      const res = await axios(`${baseUrl}/api/search/${text}`);
      setResults(() =>
        res.data.map((data) => ({
          _id: data._id,
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

  return {
    results,
  };
};

export const useFilterUser = (
  inputText,
  setLoading,
  setFilterData,
  userToBeFilter
) => {
  useEffect(() => {
    if (inputText.length > 0) {
      setLoading(true);
      const userPattern = new RegExp(`(^${inputText})|([ ]${inputText})`, "i");
      setFilterData(() =>
        userToBeFilter.filter((user) => userPattern.test(user.name))
      );
      setLoading(false);
    } else if (inputText.length === 0) {
      setFilterData(userToBeFilter);
    }
  }, [inputText, userToBeFilter]);
};
