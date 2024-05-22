const models = require('../models');

// required
exports.serviceName = 'userService';

exports.create = async ({ first_name, last_name, email }) => {
  try {
    const userModel = models.users;

    const postData = {
      first_name,
      last_name,
      email,
    };

    const data = await userModel.create(postData);

    return data;
  } catch (err) {
    console.log('Error in create user service: ', err);
    throw err;
  }
};

exports.findAll = async () => {
  try {
    const userModel = models.users;

    const data = await userModel.findAll();
    return data;
  } catch (err) {
    console.log('Error in find all user service: ', err);
    throw err;
  }
};

exports.findOne = async (id) => {
  try {
    const userModel = models.users;

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const data = await userModel.findOne({ where: { [keyField]: id } });

    return data;
  } catch (err) {
    console.log('Error in find one user service: ', err);
    throw err;
  }
};

exports.update = async (id, { first_name, last_name, email }) => {
  try {
    const userModel = models.users;

    const putData = {
      first_name,
      last_name,
      email,
    };

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const [updated] = await userModel.update(putData, {
      where: {
        [keyField]: id,
      },
    });

    if (!updated) {
      throw 'Not found!';
    }

    const data = await userModel.findOne({ where: { [keyField]: id } });

    return data;
  } catch (err) {
    console.log('Error in update user service: ', err);
    throw err;
  }
};

exports.delete = async (id) => {
  try {
    const userModel = models.users;

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const data = await userModel.destroy({ where: { [keyField]: id } });

    return data;
  } catch (err) {
    console.log('Error in delete user service: ', err);
    throw err;
  }
};
