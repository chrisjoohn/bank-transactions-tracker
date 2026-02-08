const models = require('../models');

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
