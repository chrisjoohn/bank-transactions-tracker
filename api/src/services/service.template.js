
/**
 * TODO:
 * Update all [modelName] to actual model name; e.g. users, accounts
 * 	- just do a find and replace
 */

const models = require('../models');

// required name to be used on exporting services on index
exports.serviceName = 'SERVICE_NAME_HERE';


exports.create = async ({ first_name, last_name, email }) => {
  try {
    const [modelName]Model = models[[modelName]];

    const postData = {
      first_name,
      last_name,
      email,
    };

    const data = await [modelName]Model.create(postData);

    return data;
  } catch (err) {
    console.log('Error in create [modelName] service: ', err);
    throw err;
  }
};

exports.findAll = async () => {
  try {
    const [modelName]Model = models.[modelName];

    const data = await [modelName]Model.findAll();
    return data;
  } catch (err) {
    console.log('Error in find all [modelName] service: ', err);
    throw err;
  }
};

exports.findOne = async (id) => {
  try {
    const [modelName]Model = models.[modelName];

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const data = await [modelName]Model.findOne({ where: { [keyField]: id } });

    return data;
  } catch (err) {
    console.log('Error in find one [modelName] service: ', err);
    throw err;
  }
};

exports.update = async (id, { first_name, last_name, email }) => {
  try {
    const [modelName]Model = models.[modelName];

    const putData = {
      first_name,
      last_name,
      email,
    };

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const [updated] = await [modelName]Model.update(putData, {
      where: {
        [keyField]: id,
      },
    });

    if (!updated) {
      throw 'Not found!';
    }

    const data = await [modelName]Model.findOne({ where: { [keyField]: id } });

    return data;
  } catch (err) {
    console.log('Error in update [modelName] service: ', err);
    throw err;
  }
};

exports.delete = async (id) => {
  try {
    const [modelName]Model = models.[modelName];

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const data = await [modelName]Model.destroy({ where: { [keyField]: id } });

    return data;
  } catch (err) {
    console.log('Error in delete [modelName] service: ', err);
    throw err;
  }
};
