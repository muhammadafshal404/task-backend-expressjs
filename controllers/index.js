const carController = require("./car");
const authController = require("./auth");
const categoryController = require("./category");

module.exports.carController = { ...carController };
module.exports.authController = { ...authController };
module.exports.categoryController = { ...categoryController };
