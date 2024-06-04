const { responseHandler } = require("../utils/helpers");
const { validationResult } = require("express-validator");
const { MESSAGES, SORT_ORDER } = require("../utils/constants");

const createCar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return responseHandler(res, 400, {
        success: false,
        errors: errors.array(),
      });
    }

    const { model, color, registration_no, category_id } = req?.body;
    const { db } = req;
    const car = await db.cars.create({
      model,
      color,
      registration_no,
      category_id,
    });

    return responseHandler(res, 201, car);
  } catch (err) {
    responseHandler(res, 500, { message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const getCars = async (req, res) => {
  try {
    const { db } = req;
    const { pageNo, perPage, orderBy, order } = req?.query;
    let find = {};
    if (orderBy && order) {
      if (order === SORT_ORDER.ASC) {
        find["order"] = [[orderBy, "ASC"]];
      } else if (order === SORT_ORDER.DESC) {
        find["order"] = [[orderBy, "DESC"]];
      }
    } else {
      find["order"] = [["updatedAt", "DESC"]];
    }
    if (pageNo > 0 && perPage) {
      find["limit"] = perPage;
      find["offset"] = (pageNo - 1) * perPage;
    }

    const cars = await db.cars.findAndCountAll({
      ...find,
      include: {
        model: db.categories,
        required: true,
      },
    });

    return responseHandler(res, 200, cars);
  } catch (err) {
    responseHandler(res, 500, { message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const getCar = async (req, res) => {
  try {
    const { db } = req;
    const { id } = req?.params;

    const car = await db.cars.findOne({
      where: { id },
      include: {
        model: db.categories,
      },
    });

    return responseHandler(res, 200, car);
  } catch (err) {
    responseHandler(res, 500, { message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const deleteCar = async (req, res) => {
  const { db } = req;

  try {
    const { id } = req?.params;

    const deleted = await db.cars.destroy({ where: { id } });

    return responseHandler(res, 200, `${deleted}`);
  } catch (err) {
    responseHandler(res, 500, MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

const updateCar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return responseHandler(res, 400, {
        success: false,
        errors: errors.array(),
      });
    }

    const { db } = req;
    const { id } = req?.params;
    const { model, registration_no, color, category_id } = req?.body;
    const updatedCar = await db.cars.update(
      { model, registration_no, color, category_id },
      { where: { id } }
    );

    return responseHandler(res, 200, updatedCar);
  } catch (err) {
    responseHandler(res, 500, MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

const totalNumberofCars = async (req, res) => {
  try {
    const { db } = req;

    const { count, rows } = await db.cars.findAndCountAll();

    return responseHandler(res, 200, `${count}`);
  } catch (err) {
    responseHandler(res, 500, MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

const deleteCarOnCategoryDeletion = async (category_id, transaction, db) => {
  return await db.cars.destroy({ where: { category_id }, transaction });
};

module.exports = {
  createCar,
  getCars,
  getCar,
  deleteCar,
  updateCar,
  totalNumberofCars,
  deleteCarOnCategoryDeletion,
};
