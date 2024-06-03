module.exports = (sequelize, Sequelize) => {
  const CategoryModel = sequelize.define("categories", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  });
  return CategoryModel;
};
