import axios from "axios";
import baseUrl from "../../utils/baseUrl";

export function requireAuthentication(getServerSidePropsFunction) {
  return async (context) => {
    const token = context.req.headers.cookie;

    if (!token) {
      // Redirect to login page
      return {
        redirect: {
          destination: "/login",
          statusCode: 302,
        },
      };
    }

    try {
      const userRes = await axios(`${baseUrl}/api/auth`, {
        headers: {
          Cookie: context.req.headers.cookie,
        },
      });
      return await getServerSidePropsFunction(context, userRes);
    } catch (error) {
      if (error.response?.status === 401 || error.message === "Unauthorized") {
        return {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        };
      }
    }
  };
}
