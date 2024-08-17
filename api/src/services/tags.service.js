const models = require('../models');

// required name to be used on exporting services on index
exports.serviceName = 'tagsService';


exports.create = async ({ name, user_id }) => {
  try {
    const tagsModel = models.tags;

    const postData = {
      name,
      user_id,
    };

    const data = await tagsModel.create(postData);

    return data;
  } catch (err) {
    console.log('Error in create tags service: ', err);
    throw err;
  }
};

exports.findAll = async () => {
  try {
    const tagsModel = models.tags;

    const data = await tagsModel.findAll();
    return data;
  } catch (err) {
    console.log('Error in find all tags service: ', err);
    throw err;
  }
};

exports.findOne = async (id) => {
  try {
    const tagsModel = models.tags;

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const data = await tagsModel.findOne({ where: { [keyField]: id } });

    return data;
  } catch (err) {
    console.log('Error in find one tags service: ', err);
    throw err;
  }
};

exports.update = async (id, { name, user_id }) => {
  try {
    const tagsModel = models.tags;

    const putData = {
      name,
      user_id,
    };

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const [updated] = await tagsModel.update(putData, {
      where: {
        [keyField]: id,
      },
    });

    if (!updated) {
      throw 'Not found!';
    }

    const data = await tagsModel.findOne({ where: { [keyField]: id } });

    return data;
  } catch (err) {
    console.log('Error in update tags service: ', err);
    throw err;
  }
};

exports.delete = async (id) => {
  try {
    const tagsModel = models.tags;

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const data = await tagsModel.destroy({ where: { [keyField]: id } });

    return data;
  } catch (err) {
    console.log('Error in delete tags service: ', err);
    throw err;
  }
};
