module.exports = (sequelize, Sequelize) => {
  const CarModel = sequelize.define("cars", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    registration_no: {
      type: Sequelize.STRING(250),
      allowNull: false,
      unique: true,
    },
    model: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    color: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
  });
  return CarModel;
};
