const env = require("dotenv");
const jwt = require("jsonwebtoken");
const { MESSAGES, PUBLIC_PATHS } = require("../utils/constants");
env.config();

const createToken = async ({ email, id }) => {
  return await jwt.sign({ email, id }, process.env.ADMIN_JWT_TOKEN_KEY);
};

const verifyToken = (req, res, next) => {
  try {
    if (PUBLIC_PATHS?.includes(req?.url)) {
      next();
    } else {
      let token = req?.headers?.["authorization"]?.split("Bearer ")?.[1];
      if (token) {
        const verified = jwt.verify(token, process.env.ADMIN_JWT_TOKEN_KEY);
        if (verified) {
          next();
        } else {
          return res
            .status(401)
            .send({ message: MESSAGES.UNAUTHORIZATION_ERROR });
        }
      } else {
        res.status(401).send({ message: MESSAGES.UNAUTHORIZATION_ERROR });
      }
    }
  } catch (err) {
    res.status(401).send({ message: MESSAGES.ERROR_WHILE_AUTHORIZING });
  }
};

module.exports = {
  createToken,
  verifyToken,
};
