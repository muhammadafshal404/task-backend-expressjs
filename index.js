const cors = require("cors");
const env = require("dotenv");
const db = require("./models");
const express = require("express");
const bodyParser = require("body-parser");
const { verifyToken } = require("./middlewares/authorization");
const injectModelMiddleware = require("./middlewares/injectModels");
const { authRoutes, categoryRoutes, carRoutes } = require("./routes");

const app = express();

env.config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(injectModelMiddleware);

app.use(verifyToken);
app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);
app.use("/car", carRoutes);

db.sequelize
  .sync()
  // .sync({ alter: true  })
  .then(() => {
    app.listen(process.env.PORT || 3000);

    console.log(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
