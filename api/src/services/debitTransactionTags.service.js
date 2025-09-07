const models = require('../models');

// required name to be used on exporting services on index
exports.serviceName = 'debitTransactionTagService';

exports.create = async ({ first_name, last_name, email }) => {
  try {
    const debitTransactionTagsModel = models.debit_transaction_tags;

    const postData = {
      first_name,
      last_name,
      email,
    };

    const data = await debitTransactionTagsModel.create(postData);

    return data;
  } catch (err) {
    console.log('Error in create debit_transaction_tags service: ', err);
    throw err;
  }
};

exports.findAll = async () => {
  try {
    const debitTransactionTagsModel = models.debit_transaction_tags;

    const data = await debitTransactionTagsModel.findAll();
    return data;
  } catch (err) {
    console.log('Error in find all debit_transaction_tags service: ', err);
    throw err;
  }
};

exports.findOne = async (id) => {
  try {
    const debitTransactionTagsModel = models.debit_transaction_tags;

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const data = await debitTransactionTagsModel.findOne({ where: { [keyField]: id } });

    return data;
  } catch (err) {
    console.log('Error in find one debit_transaction_tags service: ', err);
    throw err;
  }
};

exports.update = async (id, { first_name, last_name, email }) => {
  try {
    const debitTransactionTagsModel = models.debit_transaction_tags;

    const putData = {
      first_name,
      last_name,
      email,
    };

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const [updated] = await debitTransactionTagsModel.update(putData, {
      where: {
        [keyField]: id,
      },
    });

    if (!updated) {
      throw 'Not found!';
    }

    const data = await debitTransactionTagsModel.findOne({ where: { [keyField]: id } });

    return data;
  } catch (err) {
    console.log('Error in update debit_transaction_tags service: ', err);
    throw err;
  }
};

exports.delete = async (id) => {
  try {
    const debitTransactionTagsModel = models.debit_transaction_tags;

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const data = await debitTransactionTagsModel.destroy({ where: { [keyField]: id } });

    return data;
  } catch (err) {
    console.log('Error in delete debit_transaction_tags service: ', err);
    throw err;
  }
};
