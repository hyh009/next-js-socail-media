import { useEffect, useState, useCallback, Dispatch, SetStateAction } from "react";
import {SearchUser, IUser, IChat, DisplayUser} from "../types"
import axios from "axios";
import baseUrl from "../baseUrl";

export const useUserSearch = (
  text:string, 
  setLoading:Dispatch<SetStateAction<boolean>>) :Array<SearchUser> => {
  const [results, setResults] = useState<Array<SearchUser>>([]);
  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      if (text.trim().length === 0) {
        setResults([]);
        return;
      }
      const res = await axios(`${baseUrl}/api/search/${text}`);
      setResults(() =>
        res.data.map((data:SearchUser) => ({
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

  return results

};

export const useFilterUser = (
  inputText:string,
  setLoading:Dispatch<SetStateAction<boolean>>,
  setFilterData:Dispatch<SetStateAction<(DisplayUser| IChat)[]>>,
  userToBeFilter:Array<DisplayUser | IChat>
):void => {
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
