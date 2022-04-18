const SITE_NAME = "Mini Social Media";

export const PAGE_TITLE = {
  HOME: `HOME | ${SITE_NAME}`,
  SINGUP: `SINGUP | ${SITE_NAME}`,
  LOGIN: `LOGIN | ${SITE_NAME}`,
  ACCOUNT: (profileUser) =>
    `${
      typeof profileUser !== "undefined" ? profileUser : "User"
    }'s Page | ${SITE_NAME}`,
  NOTIFICATION: `NOTIFICATION | ${SITE_NAME}`,
  MESSAGE: `Message | ${SITE_NAME}`,
  POST: (postUser) =>
    `${
      typeof postUser !== "undefined" ? postUser : "User"
    }'s Post | ${SITE_NAME}`,
  FOUROFOUR: `404 Page Not Found | ${SITE_NAME}`,
  FIVEOO: `500 Server error | ${SITE_NAME}`,
  ERROR: `Error Occurred | ${SITE_NAME}`,
};
