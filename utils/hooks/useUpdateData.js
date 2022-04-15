import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

export const useGetDataFromServer = (setUpdateTrue = null) => {
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

export const useGetDataFromClient = (getDataFn) => {
  const [update, setUpdate] = useState(false);

  const setUpdateTrue = useCallback(() => {
    setUpdate(true);
  }, []);

  // to get update data from client side
  useEffect(() => {
    if (update) {
      getDataFn();
      setUpdate(false);
    }
    return () => typeof controller !== "undefined" && controller.abort();
  }, [getDataFn, update]);

  return [setUpdateTrue];
};
