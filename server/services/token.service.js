const jwt = require("jsonwebtoken");
const config = require("config");
const Token = require("../models/Token");

class TokenServices {
  // return accesToken, refrechToken, expiresIn
  generate(paylod) {
    const accesToken = jwt.sign(paylod, config.get("accessSecret"), {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(paylod, config.get("refreshSecret"));
    return {
      accesToken,
      refreshToken,
      expiresIn: 3600,
    };
  }
  async save(user, refreshToken) {
    const data = await Token.findOne({ user });

    if (data) {
      data.refreshToken = refreshToken;
      return data.save();
    }

    const token = await Token.create({ user, refreshToken });

    return token;
  }
  validateRefresh(refreshToken) {
    try {
      return jwt.verify(refreshToken, config.get("refreshSecret"));
    } catch (e) {
      return null;
    }
  }
  validateAcces(accesToken) {
    try {
      return jwt.verify(accesToken, config.get("accessSecret"));
    } catch (e) {
      return null;
    }
  }
}
module.exports = new TokenServices();
