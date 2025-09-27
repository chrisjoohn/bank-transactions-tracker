const { Op } = require('sequelize');

const bankStatementParser = require('../tools/parsers/bankStatementParser');
const { createHashFromObj } = require('../tools/createHash');

const accountsService = require('./accounts.service');

const models = require('../models');

// required name to be used on exporting services on index
exports.serviceName = 'debitTransactionsService';

exports.create = async ({
  account_id,
  description,
  transaction_date,
  transaction_type,
  amount,
}) => {
  try {
    const debitTransactionsModel = models.debit_transactions;

    const postData = {
      account_id,
      description,
      transaction_date,
      transaction_type,
      amount,
    };

    const data = await debitTransactionsModel.create(postData);

    return data;
  } catch (err) {
    console.log('Error in create debitTransactions service: ', err);
    throw err;
  }
};

exports.bulkCreate = async ({ records = [], account_id }) => {
  try {
    if (!account_id) {
      throw new Error('Account ID is required');
    }

    const debitTransactionsModel = models.debit_transactions;

    const toCreate = records.map((item) => {
      const unique_code = createHashFromObj({ ...item, account_id });

      return {
        ...item,
        account_id,
        unique_code,
      };
    });

    const data = await debitTransactionsModel.bulkCreate(toCreate);

    return data;
  } catch (err) {
    throw err;
  }
};

exports.findAll = async ({ filters = {}, includes = {} }) => {
  try {
    const debitTransactionsModel = models.debit_transactions;

    const whereCondition = {};
    const filterKeys = Object.keys(filters);
    for (const filterKey of filterKeys) {
      switch (filterKey) {
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
          if (includes[includeKey]) {
            const tagModel = models.tags;
            const debitTransactionTagsModel = models.debit_transaction_tags;

            include.push({
              model: tagModel,
              as: 'tags',
              through: {
                model: debitTransactionTagsModel,
                as: 'debit_transaction_tags',
              },
            });
          }
          break;
        default:
          break;
      }
    }

    const data = await debitTransactionsModel.findAll({
      where: whereCondition,
      include,
    });
    return data;
  } catch (err) {
    console.log('Error in find all debitTransactions service: ', err);
    throw err;
  }
};

exports.findOne = async (id, { includes } = { includes: {} }) => {
  try {
    const debitTransactionsModel = models.debit_transactions;

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const include = [];
    const includeKeys = Object.keys(includes || {});
    for (const includeKey of includeKeys) {
      switch (includeKey) {
        case 'tags':
          if (includes[includeKey]) {
            const tagModel = models.tags;
            const debitTransactionTagsModel = models.debit_transaction_tags;

            include.push({
              model: tagModel,
              as: 'tags',
              through: {
                model: debitTransactionTagsModel,
                as: 'debit_transaction_tags',
              },
            });
          }
          break;
        default:
          break;
      }
    }

    const data = await debitTransactionsModel.findOne({
      where: { [keyField]: id },
      include,
    });

    return data;
  } catch (err) {
    console.log('Error in find one debitTransactions service: ', err);
    throw err;
  }
};

exports.update = async (
  id,
  { account_id, description, transaction_date, transaction_type, amount }
) => {
  try {
    const debitTransactionsModel = models.debit_transactions;

    const putData = {
      account_id,
      description,
      transaction_date,
      transaction_type,
      amount,
    };

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const [updated] = await debitTransactionsModel.update(putData, {
      where: {
        [keyField]: id,
      },
    });

    if (!updated) {
      throw 'Not found!';
    }

    const data = await debitTransactionsModel.findOne({
      where: { [keyField]: id },
    });

    return data;
  } catch (err) {
    console.log('Error in update debitTransactions service: ', err);
    throw err;
  }
};

exports.delete = async (id) => {
  try {
    const debitTransactionsModel = models.debit_transactions;

    const keyField = isNaN(id) ? 'unique_code' : 'id';

    const data = await debitTransactionsModel.destroy({
      where: { [keyField]: id },
    });

    return data;
  } catch (err) {
    console.log('Error in delete debitTransactions service: ', err);
    throw err;
  }
};

exports.parseStatement = async (file) => {
  try {
    // keywords
    const keywordsToSkip = ['BEGINNING', 'BALANCE'];
    const startKeywords = ['DATE', 'BALANCE', 'AMOUNT'];
    const endKeywords = ['BALANCETHISSTATEMENT'];

    const colPositions = {
      date: [30, 60],
      description: [60, 115],
      ref: [195, 216],
      details: [220, 360],
      debit_amount: [400, 435],
      credit_amount: [470, 500],
      running_balance: [520, 580],
    };

    const options = {
      keywordsToSkip,
      startKeywords,
      endKeywords,
      colPositions,
    };

    const { data } = await bankStatementParser(file.buffer, options);

    return data;
  } catch (err) {
    throw err;
  }
};

exports.getTotalOutflow = async ({ account_id, date_range }) => {
  try {
    const debitTransactionsModel = models.debit_transactions;

    const totalOutflow = await debitTransactionsModel.sum('amount', {
      where: {
        account_id,
        transaction_type: 'OUTFLOW',
        transaction_date: {
          [Op.between]: [date_range.start_date, date_range.end_date],
        },
      },
    });

    return totalOutflow;
  } catch (err) {
    throw err;
  }
};

exports.getTotalInflow = async ({ account_id, date_range }) => {
  try {
    const debitTransactionsModel = models.debit_transactions;

    const totalInflow = await debitTransactionsModel.sum('amount', {
      where: {
        account_id,
        transaction_type: 'INFLOW',
        transaction_date: {
          [Op.between]: [date_range.start_date, date_range.end_date],
        },
      },
    });

    return totalInflow;
  } catch (err) {
    throw err;
  }
};

const getFieldAttribute = (field) => {
  const sequelize = models.sequelize;

  switch (field) {
    case 'inflow':
      return [
        sequelize.fn(
          'SUM',
          sequelize.literal(`CASE WHEN transaction_type = 'INFLOW' THEN amount ELSE 0 END`)
        ),
        'inflow',
      ];
    case 'outflow':
      return [
        sequelize.fn(
          'SUM',
          sequelize.literal(`CASE WHEN transaction_type = 'OUTFLOW' THEN amount ELSE 0 END`)
        ),
        'outflow',
      ];
    case 'transaction_count':
      return [Op.count, sequelize.col('id'), 'transaction_count'];
    default:
      return null;
  }
};

const getGroupExpression = (group_by) => {
  const sequelize = models.sequelize;

  let groupExpr;
  switch (group_by) {
    case 'day':
      groupExpr = sequelize.literal('DATE(transaction_date)');
      break;
    case 'week':
      groupExpr = sequelize.literal('YEARWEEK(transaction_date, 1)');
      break;
    case 'month':
      groupExpr = sequelize.literal("DATE_FORMAT(transaction_date, '%Y-%m')");
      break;
    case 'year':
      groupExpr = sequelize.literal('YEAR(transaction_date)');
      break;
    default:
      groupExpr = sequelize.literal("DATE_FORMAT(transaction_date, '%Y-%m')");
      break;
  }

  return groupExpr;
};

const getFieldAttributes = (fields) => {
  const sequelize = models.sequelize;

  const defaultFields = ['inflow', 'outflow', 'transaction_count'];
  if (!fields || !Array.isArray(fields) || fields.length === 0) {
    fields = defaultFields;
  }

  return [
    ...fields.map((field) => getFieldAttribute(field)).filter((attr) => attr !== null),
    [sequelize.fn('COUNT', sequelize.col('id')), 'transaction_count'],
  ];
};

exports.getCashflow = async ({ account_id, date_range, group_by = 'month', fields }) => {
  try {
    const debitTransactionsModel = models.debit_transactions;

    const attributes = getFieldAttributes(fields);
    const groupExpr = getGroupExpression(group_by);

    // query
    const data = await debitTransactionsModel.findAll({
      logging: true,
      attributes: [[groupExpr, 'period'], ...attributes],
      where: {
        account_id,
        transaction_date: {
          [Op.between]: [date_range.start_date, date_range.end_date],
        },
      },
      group: ['period'],
      order: [[groupExpr, 'ASC']],
    });

    // format data
    const formattedData = data.map((item) => {
      const plainItem = item.get({ plain: true });
      return {
        period: plainItem.period,
        inflow: parseFloat(plainItem.inflow).toFixed(2),
        outflow: parseFloat(plainItem.outflow).toFixed(2),
        total: (parseFloat(plainItem.inflow) - parseFloat(plainItem.outflow)).toFixed(2),
        transaction_count: parseInt(plainItem.transaction_count, 10),
      };
    });

    return formattedData;
  } catch (err) {
    throw err;
  }
};
