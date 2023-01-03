let jwt = require("jsonwebtoken");

module.exports = {
  isLoggedIn: async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(400).json({ error: "token required" });
    }

    try {
      let payload = await jwt.verify(token, "thisissecret");
      req.user = payload;
      next();
    } catch (error) {
      next(error);
    }
  },
  isAdmin: async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(400).json({ error: "token required" });
    }

    try {
      let payload = await jwt.verify(token, "thisissecret");
      if (!payload.isAdmin) {
        return res
          .status(400)
          .json({ error: "You have to be loggedin as Admin" });
      }
      req.user = payload;
      next();
    } catch (error) {
      next(error);
    }
  },
};