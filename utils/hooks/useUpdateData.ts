import { useCallback, useEffect, useState,Dispatch,SetStateAction } from "react";
import { useRouter } from "next/router";
type setUpdateTrueType = Dispatch<SetStateAction<boolean>> | null
export const useGetDataFromServer = (setUpdateTrue:setUpdateTrueType = null) => {
  const router = useRouter();
  const refreshRouter = useCallback(
    () => router.replace(router.asPath),
    [router]
  );
  if (setUpdateTrue) {
    return null;
  } else {
    return refreshRouter;
  }
};
type NoReturnFn = ()=>void

export const useGetDataFromClient = (getDataFn:(controller:AbortController)=>Promise<void>):[NoReturnFn] => {
  const [update, setUpdate] = useState<boolean>(false);

  const setUpdateTrue = useCallback(():void => {
    setUpdate(true);
  }, []);

  // to get update data from client side
  useEffect(() => {
    const controller = new AbortController();
    const getData = async ()=>{
      if (update) {
        console.log(getDataFn);
        await getDataFn(controller);
        setUpdate(false);
      }
    }
    getData();
    return () => typeof controller !== "undefined" && controller.abort();
  }, [getDataFn, update]);

  return [setUpdateTrue];
};
