const sequelize = require('sequelize');
const { Op } = sequelize;

const models = require('../models');

const tagsService = require('./tags.service');
const creditTransactionsService = require('./creditTransactions.service');

exports.serviceName = 'tagCharts';

exports.create = async ({ title, chartType, data, preFilter, series }, options = {}) => {
  try {
    const TagChartsModel = models.tag_charts;
    const postData = {
      title,
      chartType,
      data,
      preFilter,
      series,
    };

    const result = await TagChartsModel.create(postData, options);
    return result;
  } catch (error) {
    console.error('Error creating tag chart:', error);
    throw error;
  }
};

exports.findAllByAccountId = async ({ accountId }, options = {}) => {
  try {
    const result = await models.tag_charts.findAll(
      {
        include: [
          {
            model: models.account_tag_charts,
            where: {
              account_id: accountId,
            },
            attributes: [],
            required: true,
          },
        ],
      },
      options
    );
    return result;
  } catch (error) {
    console.error('Error finding tag charts by account ID:', error);
    throw error;
  }
};

exports.findOne = async ({ chartId }, options = {}) => {
  const tagChartsModel = models.tag_charts;
  try {
    const keyField = isNaN(chartId) ? 'unique_code' : 'id';
    const result = await tagChartsModel.findOne(
      {
        where: {
          [keyField]: chartId,
        },
      },
      options
    );

    if (!result) {
      throw `Tag Chart not found: ${chartId}`;
    }

    return result;
  } catch (err) {
    throw err;
  }
};

const transformData = async (accountId, mainTag, tags) => {
  const creditTransactionModel = models.credit_transactions;
  const creditTransactionTagModel = models.credit_transaction_tags;

  const transactions = await creditTransactionModel.findAll({
    where: {
      [Op.or]: [
        {
          id: accountId,
        },
        {
          unique_code: accountId,
        },
      ],
    },
    include: [
      {
        model: creditTransactionTagModel,
        as: 'tags',
      },
    ],
  });

  return transactions;
};

exports.findChartData = async ({ accountId, chartId }) => {
  const tagChartsModel = models.tag_charts;
  try {
    const tagChart = await this.findOne({ chartId });
    const { data, preFilter } = tagChart;

    // if preFilter exists
    //   get transactions with tag from preFilter
    //
    // transactions = get transactions filtered by tags from data
    // filter transactions by data filter
  } catch (err) {
    console.error('Error finding chart data:', err);
    throw err;
  }
};
