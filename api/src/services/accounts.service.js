const models = require('../models');

// required name to be used on exporting services on index
exports.serviceName = 'accountsService';

exports.create = async ({ user_id, name, description, type }) => {
  try {
    const accountsModel = models.accounts;

    const postData = {
      user_id,
      name,
      description,
      type,
    };

    const data = await accountsModel.create(postData);

    return data;
  } catch (err) {
    console.log('Error in create accounts service: ', err);
    throw err;
  }
};

exports.findAll = async ({ filters = {} }) => {
  try {
    const accountsModel = models.accounts;

    const whereCondition = {};

    const filterKeys = Object.keys(filters);
    for (const filterKey of filterKeys) {
      switch (filterKey) {
        default:
          whereCondition[filterKey] = filters[filterKey];
          break;
      }
    }

    const data = await accountsModel.findAll({ where: whereCondition });
    return data;
  } catch (err) {
    console.log('Error in find all accounts service: ', err);
    throw err;
  }
};

exports.findOne = async (id) => {
  try {
    const accountsModel = models.accounts;

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const data = await accountsModel.findOne({ where: { [keyField]: id } });

    return data;
  } catch (err) {
    console.log('Error in find one accounts service: ', err);
    throw err;
  }
};

exports.update = async (id, { user_id, name, description, type, }) => {
  try {
    const accountsModel = models.accounts;

    const putData = {
      user_id,
      name,
      description,
      type
    };

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const [updated] = await accountsModel.update(putData, {
      where: {
        [keyField]: id,
      },
    });

    if (!updated) {
      throw 'Not found!';
    }

    const data = await accountsModel.findOne({ where: { [keyField]: id } });

    return data;
  } catch (err) {
    console.log('Error in update accounts service: ', err);
    throw err;
  }
};

exports.delete = async (id) => {
  try {
    const accountsModel = models.accounts;

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const data = await accountsModel.destroy({ where: { [keyField]: id } });

    return data;
  } catch (err) {
    console.log('Error in delete accounts service: ', err);
    throw err;
  }
};
