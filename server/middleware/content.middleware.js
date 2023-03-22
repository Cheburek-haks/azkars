const tokenService = require("../services/token.service");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next;
  }

  try {
    // Bearer

    const token = req.headers?.authorization?.split(" ")[1]
      ? req.headers.authorization.split(" ")[1]
      : "";

    if (token) {
      const data = tokenService.validateAcces(token);
      req.user = data;
      next();
    } else {
      return next();
    }
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized middleware" });
  }
};
