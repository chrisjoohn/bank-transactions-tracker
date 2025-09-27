const sequelize = require('sequelize');
const { Op } = sequelize;

const { createHashFromObj } = require('../tools/createHash');
const bankStatementParser = require('../tools/parsers/bankStatementParser');
const csvStatementParser = require('../tools/parsers/csvStatementParser');

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
    const creditTransactionTagsModel = models.credit_transaction_tags;

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

        case 'transaction_date':
          const transactionDateRange = filters[filterKey];

          whereCondition['transaction_date'] = {
            [Op.between]: [transactionDateRange.start_date, transactionDateRange.end_date],
          };

          break;

        case 'post_date':
        case 'date_range': // TODO: remove this one once API integration is updated to use `post_date`
          const postDateRange = filters[filterKey];

          whereCondition['post_date'] = {
            [Op.between]: [postDateRange.start_date, postDateRange.end_date],
          };

          break;
        case 'tags':
          const tagIds = filters[filterKey];

          if (tagIds.length === 0) {
            break;
          }

          // TODO: add validation here before query
          const ccTrxTags = await creditTransactionTagsModel.findAll({
            attributes: ['credit_transaction_id'],
            where: {
              tag_id: {
                [Op.in]: tagIds,
              },
            },
            group: ['credit_transaction_id'],
            having: sequelize.literal(`COUNT(*) = ${tagIds.length}`),
          });

          whereCondition['id'] = {
            [Op.in]: ccTrxTags.map((item) => item.credit_transaction_id),
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
            model: models.tags,
            through: { attributes: [] },
            as: 'tags',
            attributes: ['id', 'unique_code', 'name'],
          };
          include.push(tagInclude);
          break;
      }
    }

    const data = await creditTransactionsModel.findAll({
      where: whereCondition,
      include,
      order: [['post_date', 'asc']],
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
            model: models.tags,
            through: { attributes: [] },
            as: 'tags',
            attributes: ['id', 'unique_code', 'name'],
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

const parsePdfStatement = async (file) => {
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
  } catch (err) {}
};

exports.parseStatement = async (file) => {
  try {
    const fileType =
      file.mimeType === 'text/csv' || file.originalname.toLowerCase().endsWith('csv')
        ? 'csv'
        : 'pdf';

    let data = null;

    switch (fileType) {
      case 'csv':
        data = await csvStatementParser(file.buffer);
        break;
      case 'pdf':
      default:
        data = await parsePdfStatement(file);
        break;
    }

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.getTotalOutflow = async ({ account_id, post_date, transaction_date, tags = [] }) => {
  try {
    const creditTransactionsModel = models.credit_transactions;
    const creditTransactionTagsModel = models.credit_transaction_tags;

    const whereCondition = {
      account_id,
      // TODO: update post_date filter to be more dynamic
      post_date: {
        [Op.between]: [post_date.start_date, post_date.end_date],
      },
    };

    if (tags.length > 0) {
      const ccTrxTags = await creditTransactionTagsModel.findAll({
        attributes: ['credit_transaction_id'],
        where: {
          tag_id: {
            [Op.in]: tags,
          },
        },
        group: ['credit_transaction_id'],
        having: sequelize.literal(`COUNT(*) = ${tags.length}`),
      });

      whereCondition['id'] = {
        [Op.in]: ccTrxTags.map((item) => item.credit_transaction_id),
      };
    }

    const totalOutflow = await creditTransactionsModel.sum('amount', {
      where: whereCondition,
    });

    return totalOutflow;
  } catch (err) {
    throw err;
  }
};

const getIncludedTrxByTag = async (tags) => {
  const ccTrxTagsModel = models.credit_transaction_tags;

  let includedTrx = [];
  if (tags.length > 0) {
    includedTrx = await ccTrxTagsModel.findAll({
      attributes: ['credit_transaction_id'],
      where: {
        tag_id: {
          [Op.in]: tags,
        },
      },
      group: ['credit_transaction_id'],
      having: sequelize.literal(`COUNT(*) = ${tags.length}`),
    });
  }

  return includedTrx;
};

exports.getTotalPerTag = async ({ filters = {} }) => {
  try {
    const tagsModel = models.tags;
    const creditTransactionsModel = models.credit_transactions;
    const creditTransactionTagsModel = models.credit_transaction_tags;

    const whereCond = {
      tags: {},
      credit_transactions: {},
      credit_transaction_tags: {},
    };

    const filterKeys = Object.keys(filters);
    for (const filterKey of filterKeys) {
      switch (filterKey) {
        case 'account_id':
          whereCond.credit_transactions['account_id'] = {
            [Op.eq]: filters[filterKey],
          };
          break;
        case 'post_date':
          const postDateRange = filters[filterKey];
          whereCond.credit_transactions['post_date'] = {
            [Op.between]: [postDateRange.start_date, postDateRange.end_date],
          };
          break;

        case 'tags':
          const filterTags = filters[filterKey];
          if (filterTags.length > 0) {
            const includedTrx = await getIncludedTrxByTag(filterTags);

            whereCond.tags['id'] = {
              [Op.notIn]: filterTags, // TODO: query first using `id` or `unique_code` before passing value
            };

            whereCond.credit_transactions['id'] = {
              [Op.in]: includedTrx.map((item) => item.credit_transaction_id),
            };
          }
          break;
        default:
          break;
      }
    }

    const data = await tagsModel.findAll({
      attributes: [
        'id',
        'name',
        [sequelize.fn('SUM', sequelize.col('bt_credit_transactions.amount')), 'total_amount'],
        [sequelize.fn('COUNT', sequelize.col('*')), 'count'],
      ],
      include: [
        {
          model: creditTransactionsModel,
          attributes: [],
          through: { attributes: [] },
          where: whereCond.credit_transactions,
        },
      ],
      where: whereCond.tags,
      group: ['bt_tags.id'],
    });

    return data;
  } catch (err) {
    console.log('Error in creditTransactions analytics', err);
    throw err;
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

const getFieldAttribute = (field) => {
  const sequelize = models.sequelize;

  switch (field) {
    case 'outflow':
      return [sequelize.fn('SUM', sequelize.col(`amount`)), 'outflow'];
    case 'transaction_count':
      return [Op.count, sequelize.col('id'), 'transaction_count'];
    default:
      return null;
  }
};

const getFieldAttributes = (fields) => {
  const sequelize = models.sequelize;

  const defaultFields = ['outflow'];
  if (!fields || !Array.isArray(fields) || fields.length === 0) {
    fields = defaultFields;
  }

  return [
    ...fields.map((field) => getFieldAttribute(field)).filter((attr) => attr !== null),
    [sequelize.fn('COUNT', sequelize.col('id')), 'transaction_count'],
  ];
};

exports.getCashflow = async ({ account_id, date_range, group_by = 'month', fields = [] }) => {
  try {
    const creditTransactionsModel = models.credit_transactions;

    const groupExpr = getGroupExpression(group_by);
    const attributes = getFieldAttributes(fields);

    const data = await creditTransactionsModel.findAll({
      where: {
        account_id,
        transaction_date: {
          [Op.between]: [date_range.start_date, date_range.end_date],
        },
      },
      attributes: [[groupExpr, 'period'], ...attributes],
      group: ['period'],
      order: [['period', 'asc']],
    });

    const formattedData = data.map((item) => {
      const plainItem = item.get({ plain: true });
      return {
        period: plainItem.period,
        outflow: parseFloat(plainItem.outflow).toFixed(2),
        transaction_count: parseInt(plainItem.transaction_count, 10),
      };
    });

    return formattedData;
  } catch (err) {
    console.log('Error in find all debit_transactions service: ', err);
    throw err;
  }
};
