const env = require("dotenv");
const Sequelize = require("sequelize");
const databaseConfig = require("../config");
env.config();

const sequelizeInstance = new Sequelize(
  databaseConfig.DB,
  databaseConfig.USER,
  databaseConfig.PASSWORD,
  {
    host: databaseConfig.HOST,
    port: process.env.DB_PORT,
    dialect: databaseConfig.dialect,
    operatorsAliases: 0,

    pool: {
      max: databaseConfig.pool.max,
      min: databaseConfig.pool.min,
      acquire: databaseConfig.pool.acquire,
      idle: databaseConfig.pool.idle,
    },
    dialectOptions: {
      multipleStatements: true,
    },
  }
);
const db = {};

db.cars = require("./car.model")(sequelizeInstance, Sequelize);
db.users = require("./user.model")(sequelizeInstance, Sequelize);
db.categories = require("./category.model")(sequelizeInstance, Sequelize);

db.categories.hasMany(db.cars, { foreignKey: "category_id" });
db.cars.belongsTo(db.categories, { foreignKey: "category_id" });

db.Sequelize = Sequelize;
db.sequelize = sequelizeInstance;

module.exports = db;
