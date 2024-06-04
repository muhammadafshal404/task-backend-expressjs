const { deleteCarOnCategoryDeletion } = require("./car");
const { validationResult } = require("express-validator");
const { MESSAGES, SORT_ORDER } = require("../utils/constants");

const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name } = req?.body;
    const { db } = req;
    const category = await db.categories.create({ name });
    res.status(201).send(category);
  } catch (err) {
    res.status(500).send({ message: MESSAGES.INTERNAL_SERVER_ERROR });
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
    res.status(200).send(categories);
  } catch (err) {
    res.status(500).send({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const getCategory = async (req, res) => {
  try {
    const { db } = req;
    const { id } = req?.params;
    const category = await db.categories.findOne({
      where: { id },
      //   include: {
      //     model: CarModel,
      //   },
    });
    res.status(200).send(category);
  } catch (err) {
    res.status(500).send({ message: MESSAGES.INTERNAL_SERVER_ERROR });
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
    res.status(200).send();
  } catch (err) {
    await transaction?.rollback();
    res.status(500).send(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

const updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
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
    res.status(200).send(updatedCategory);
  } catch (err) {
    res.status(500).send(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  deleteCategory,
  updateCategory,
};
