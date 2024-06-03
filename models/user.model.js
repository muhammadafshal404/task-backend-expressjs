const bcrypt = require("bcrypt");
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  User.addHook(
    "beforeCreate",
    (user) => (user.password = bcrypt.hashSync(user.password, 10))
  );
  return User;
};
