const DEPLOY_URL = "https://next-socila-media.herokuapp.com";
const baseUrl =
  process.env.NODE_ENV !== "production" ? "http://localhost:3000" :DEPLOY_URL;

export default baseUrl;
