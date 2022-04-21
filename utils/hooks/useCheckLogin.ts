import { useEffect } from "react";
import { NextRouter, useRouter } from "next/router";
import baseUrl from "../baseUrl";
import axios from "axios";

const useCheckLogin = () => {
  const router = useRouter();
  useEffect(() => {
    const checkUser = async ():Promise<boolean> => {
      try {
        const res = await axios(`${baseUrl}/api/auth/verifyuser`);
        if (res.data.message === "valid user") {
          return router.push("/");
        }
      } catch (err) {
        if (err.response.status !== 401) {
          return router.push("/500");
        }
      }
    };
    checkUser();
  }, []);
};

export default useCheckLogin;
