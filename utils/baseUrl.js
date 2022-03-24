const DEPLOY_URL = "https://mini-socail-media.netlify.app/";
const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000/api"
    : DEPLOY_URL;

export default baseUrl;
