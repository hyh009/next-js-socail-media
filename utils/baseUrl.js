const DEPLOY_URL = "https://next-socila-media.herokuapp.com/api";
const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000/api"
    : DEPLOY_URL;

export default baseUrl;
