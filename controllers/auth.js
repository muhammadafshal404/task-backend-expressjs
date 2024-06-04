const bcrypt = require("bcrypt");
const generator = require("generate-password");
const { sendEmail } = require("../utils/helpers");
const { responseHandler } = require("../utils/helpers");
const { validationResult } = require("express-validator");
const { createToken } = require("../middlewares/authorization");
const { MESSAGES, WELCOME_EMAIL } = require("../utils/constants");
const renderWelcomeEmail = require("../utils/templates/emailTemplate");

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return responseHandler(res, 400, {
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req?.body;
    const { db } = req;
    const user = await db.users.findOne({ where: { email } });

    const validatePassword = bcrypt.compareSync(password, user?.password);

    if (validatePassword) {
      return responseHandler(res, 200, {
        access_token: await createToken(user),
      });
    } else {
      return responseHandler(res, 401, {
        message: MESSAGES.INCORRECT_EMAIL_OR_PASSWORD,
      });
    }
  } catch (err) {
    responseHandler(res, 500, { message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return responseHandler(res, 400, {
        success: false,
        errors: errors.array(),
      });
    }
    const { db } = req;
    const { email } = req?.body;

    const password = generator.generate({
      length: 10,
      numbers: true,
    });

    await db.users.create({ email, password });

    await sendEmail(
      email,
      WELCOME_EMAIL.SUBJECT,
      renderWelcomeEmail(`${process.env.FRONT_END}/login`, password)
    );

    return responseHandler(res, 200, { message: MESSAGES.EMAIL_SENT });
  } catch (err) {
    responseHandler(res, 500, { message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

module.exports = {
  login,
  signup,
};
