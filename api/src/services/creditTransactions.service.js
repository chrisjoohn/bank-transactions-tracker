const { Op } = require('sequelize');
const { parse, format } = require('date-fns');

const { createHashFromObj } = require('../tools/createHash');
const bankStatementParser = require('../tools/parsers/bankStatementParser');

const models = require('../models');

const accountsService = require('./accounts.service');

// required name to be used on exporting services on index
exports.serviceName = 'creditTransactionsService';

exports.create = async ({ account_id, description, transaction_date, post_date }) => {
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

exports.bulkCreate = async ({ records = [], account_id }) => {
  try {
    if (!account_id) {
      throw new Error('Account ID is required');
    }

    const creditTransactionsModel = models.credit_transactions;

    const toCreate = records.map((item) => {
      const unique_code = createHashFromObj({ ...item, account_id });

      return {
        ...item,
        account_id,
        unique_code,
      };
    });

    const data = await creditTransactionsModel.bulkCreate(toCreate);

    return data;
  } catch (err) {
    console.log(`Error in bulkCreate credit transactions service: `, err);
    throw err;
  }
};

/**
 * filters = {
 *  [field_name]: value as any;
 * }
 * include = {
 *  [model_name]: {
 *    fields?: string[];
 *    order?: string[];
 *   }
 * }
 */
exports.findAll = async ({ filters = {}, includes = {} }) => {
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

        case 'date_range':
          const { start_date, end_date } = filters[filterKey];
          whereCondition['transaction_date'] = {
            [Op.between]: [start_date, end_date],
          };
          break;
      }
    }

    const include = [];
    const includeKeys = Object.keys(includes);
    for (const includeKey of includeKeys) {
      switch (includeKey) {
        case 'tags':
          const tagInclude = {
            model: models.credit_transaction_tags,
            as: 'tags',
            include: {
              model: models.tags,
              as: 'tag'
            }
          };
          include.push(tagInclude);
          break;
      }
    }

    const data = await creditTransactionsModel.findAll({
      where: whereCondition,
      include,
    });
    return data;
  } catch (err) {
    console.log('Error in find all credit_transactions service: ', err);
    throw err;
  }
};

exports.findOne = async (id, { includes } = { includes: {} }) => {
  try {
    const creditTransactionsModel = models.credit_transactions;

    const include = [];
    const includeKeys = Object.keys(includes);
    for (const includeKey of includeKeys) {
      switch (includeKey) {
        case 'tags':
          const tagInclude = {
            model: models.credit_transaction_tags,
            as: 'tags',
            include: { model: models.tags, as: 'tag' },
          };
          include.push(tagInclude);
          break;
      }
    }

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const data = await creditTransactionsModel.findOne({
      where: { [keyField]: id },
      include,
    });

    return data;
  } catch (err) {
    console.log('Error in find one credit_transactions service: ', err);
    throw err;
  }
};

exports.update = async (id, { account_id, description, transaction_date, post_date }) => {
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

exports.parseStatement = async (file) => {
  try {
    const startKeywords = ['INSTALLMENT', 'AMORTIZATION'];
    const endKeywords = ['BALANCE', 'SUMMARY', 'S.I.P.'];

    const colPositions = {
      transaction_date: [50, 130],
      post_date: [140, 200],
      description: [210, 380],
      amount: [400, 550],
    };

    const options = {
      colPositions,
      startKeywords,
      endKeywords,
    };

    const { data } = await bankStatementParser(file.buffer, options);

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.getTotalOutflow = async ({ account_id, date_range }) => {
  try {
    const creditTransactionsModel = models.credit_transactions;

    const totalOutflow = await creditTransactionsModel.sum('amount', {
      where: {
        account_id,
        transaction_date: {
          [Op.between]: [date_range.startDate, date_range.endDate],
        },
      },
    });

    return totalOutflow;
  } catch (err) {
    throw err;
  }
};
