const authController = require("./auth");
const categoryController = require("./category");
module.exports.authController = { ...authController };
module.exports.categoryController = { ...categoryController };
