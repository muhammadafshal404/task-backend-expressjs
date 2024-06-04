const { responseHandler } = require("../utils/helpers");
const { deleteCarOnCategoryDeletion } = require("./car");
const { validationResult } = require("express-validator");
const { MESSAGES, SORT_ORDER } = require("../utils/constants");

const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return responseHandler(res, 400, {
        success: false,
        errors: errors.array(),
      });
    }

    const { name } = req?.body;
    const { db } = req;
    const category = await db.categories.create({ name });

    return responseHandler(res, 201, category);
  } catch (err) {
    responseHandler(res, 500, { message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const getCategories = async (req, res) => {
  try {
    const { db } = req;
    const { pageNo, perPage, orderBy } = req?.query;
    let find = {};
    if (orderBy) {
      if (orderBy === SORT_ORDER.ASC) {
        find["order"] = [["name", "ASC"]];
      } else if (orderBy === SORT_ORDER.DESC) {
        find["order"] = [["name", "DESC"]];
      }
    } else {
      find["order"] = [["updatedAt", "DESC"]];
    }
    if (pageNo > 0 && perPage) {
      find["limit"] = perPage;
      find["offset"] = (pageNo - 1) * perPage;
    }
    const categories = await db.categories.findAndCountAll(find);

    return responseHandler(res, 200, categories);
  } catch (err) {
    responseHandler(res, 500, { message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const getCategory = async (req, res) => {
  try {
    const { db } = req;
    const { id } = req?.params;
    const category = await db.categories.findOne({
      where: { id },
      include: {
        model: db.cars,
      },
    });

    return responseHandler(res, 200, category);
  } catch (err) {
    responseHandler(res, 500, { message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const deleteCategory = async (req, res) => {
  const { db } = req;
  const transaction = await db.sequelize.transaction();
  try {
    const { id } = req?.params;

    await deleteCarOnCategoryDeletion(id, transaction, db);
    await db.categories.destroy({ where: { id }, transaction });

    await transaction?.commit();

    return responseHandler(res, 200);
  } catch (err) {
    await transaction?.rollback();
    responseHandler(res, 500, { message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const updateCategory = async (req, res) => {
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
    const { name } = req?.body;
    const updatedCategory = await db.categories.update(
      { name },
      { where: { id } }
    );

    return responseHandler(res, 200, updatedCategory);
  } catch (err) {
    responseHandler(res, 500, { message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  deleteCategory,
  updateCategory,
};
