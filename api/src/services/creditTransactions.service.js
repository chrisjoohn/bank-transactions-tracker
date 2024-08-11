const { Op } = require('sequelize');
const models = require('../models');

const accountsService = require('./accounts.service');

// required name to be used on exporting services on index
exports.serviceName = 'creditTransactionsService';

exports.create = async ({
  account_id,
  description,
  transaction_date,
  post_date,
}) => {
  try {
    const creditTransactionsModel = models.credit_transactions;

    const account = await accountsService.findOne(account_id);

    if (!account) {
      throw new Error(`Cannot find account: ${account_id}`);
    }

    const postData = {
      account_id: account.id,
      description,
      transaction_date,
      post_date,
    };

    const data = await creditTransactionsModel.create(postData);

    return data;
  } catch (err) {
    console.log('Error in create credit_transactions service: ', err);
    throw err;
  }
};

exports.findAll = async ({ filters = {} }) => {
  try {
    const creditTransactionsModel = models.credit_transactions;

    const whereCondition = {};

    const filterKeys = Object.keys(filters);
    for (const filterKey of filterKeys) {
      switch (filterKey) {
        // add filters here
        case 'account_id':
          const accountId = filters[filterKey];
          const account = await accountsService.findOne(accountId);

          if (!account) {
            throw new Error(`Cannot find account: ${accountId}`);
          }

          whereCondition['account_id'] = {
            [Op.eq]: account.id,
          };
          break;
      }
    }

    const data = await creditTransactionsModel.findAll({
      where: whereCondition,
    });
    return data;
  } catch (err) {
    console.log('Error in find all credit_transactions service: ', err);
    throw err;
  }
};

exports.findOne = async (id) => {
  try {
    const creditTransactionsModel = models.credit_transactions;

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const data = await creditTransactionsModel.findOne({
      where: { [keyField]: id },
    });

    return data;
  } catch (err) {
    console.log('Error in find one credit_transactions service: ', err);
    throw err;
  }
};

exports.update = async (
  id,
  { account_id, description, transaction_date, post_date }
) => {
  try {
    const creditTransactionsModel = models.credit_transactions;

    const putData = { account_id, description, transaction_date, post_date };

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const [updated] = await creditTransactionsModel.update(putData, {
      where: {
        [keyField]: id,
      },
    });

    if (!updated) {
      throw 'Not found!';
    }

    const data = await creditTransactionsModel.findOne({
      where: { [keyField]: id },
    });

    return data;
  } catch (err) {
    console.log('Error in update credit_transactions service: ', err);
    throw err;
  }
};

exports.delete = async (id) => {
  try {
    const creditTransactionsModel = models.credit_transactions;

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const data = await creditTransactionsModel.destroy({
      where: { [keyField]: id },
    });

    return data;
  } catch (err) {
    console.log('Error in delete credit_transactions service: ', err);
    throw err;
  }
};
