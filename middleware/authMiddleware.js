const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // if request from client side get req.cookies
  let savedCookie = req.cookies;
  // if request from server side (e.g. getserversideprops)
  if (savedCookie === null) {
    savedCookie = req.headers.Cookie;
  }

  try {
    if (!savedCookie.token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(savedCookie.token, process.env.JWT_SECRECT, (err, token) => {
      if (err) throw err;
      req.userId = token.userId;
    });
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
